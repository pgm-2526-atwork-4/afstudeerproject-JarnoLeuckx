<?php

namespace App\Services;

use App\Models\DriverAvailability;
use App\Models\Ride;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class RideAssignmentService
{
    public function getAvailableDrivers(
        Carbon $pickupAt,
        Carbon $endAt,
        ?int $ignoreRideId = null,
        array $excludedDriverIds = [],
    ): Collection {
        if (! $pickupAt->isSameDay($endAt)) {
            return collect();
        }

        $availableDriverIds = DriverAvailability::query()
            ->where('status', DriverAvailability::STATUS_AVAILABLE)
            ->whereIn('approval_status', [
                DriverAvailability::APPROVAL_NOT_REQUIRED,
                DriverAvailability::APPROVAL_APPROVED,
            ])
            ->whereDate('date', $pickupAt->toDateString())
            ->whereTime('start_time', '<=', $pickupAt->format('H:i:s'))
            ->whereTime('end_time', '>=', $endAt->format('H:i:s'))
            ->pluck('driver_id');

        if ($availableDriverIds->isEmpty()) {
            return collect();
        }

        return User::query()
            ->where('role', 'driver')
            ->where('approval_status', 'approved')
            ->whereIn('id', $availableDriverIds)
            ->when(
                $excludedDriverIds !== [],
                fn ($query) => $query->whereNotIn('id', $excludedDriverIds)
            )
            ->whereDoesntHave('ridesAsDriver', function ($query) use ($pickupAt, $endAt, $ignoreRideId) {
                $query
                    ->blockingSchedule()
                    ->when($ignoreRideId, fn ($q) => $q->whereKeyNot($ignoreRideId))
                    ->overlappingWindow($pickupAt, $endAt);
            })
            ->orderBy('id')
            ->get(['id', 'name', 'phone', 'email']);
    }

    public function findAvailableDriver(
        Carbon $pickupAt,
        Carbon $endAt,
        ?int $ignoreRideId = null,
        array $excludedDriverIds = [],
    ): ?User {
        return $this->getAvailableDrivers($pickupAt, $endAt, $ignoreRideId, $excludedDriverIds)->first();
    }

    public function assignAutomatically(Ride $ride, array $excludedDriverIds = []): ?User
    {
        $ride->refresh();

        $driver = $this->findAvailableDriver(
            $ride->pickup_datetime->copy(),
            $ride->effective_end_at->copy(),
            $ride->id,
            $excludedDriverIds,
        );

        if (! $driver) {
            $this->clearBusySlots($ride);

            return null;
        }

        $ride->forceFill([
            'driver_id' => $driver->id,
            'status' => in_array($ride->status, [Ride::STATUS_CANCELLED, Ride::STATUS_COMPLETED], true)
                ? $ride->status
                : Ride::STATUS_ASSIGNED,
        ])->save();

        return $driver;
    }

    public function ensureDriverCanTakeRide(int|User $driver, Ride $ride): void
    {
        $driver = $driver instanceof User ? $driver : User::query()->findOrFail($driver);

        if (! $driver->isDriver() || $driver->approval_status !== 'approved') {
            throw ValidationException::withMessages([
                'driver_id' => 'Alleen goedgekeurde chauffeurs kunnen aan een rit worden gekoppeld.',
            ]);
        }

        $pickupAt = $ride->pickup_datetime->copy();
        $endAt = $ride->effective_end_at->copy();

        if (! $pickupAt->isSameDay($endAt)) {
            throw ValidationException::withMessages([
                'pickup_datetime' => 'Automatische planning ondersteunt voorlopig enkel ritten binnen dezelfde dag.',
            ]);
        }

        $hasAvailability = DriverAvailability::query()
            ->where('driver_id', $driver->id)
            ->where('status', DriverAvailability::STATUS_AVAILABLE)
            ->whereIn('approval_status', [
                DriverAvailability::APPROVAL_NOT_REQUIRED,
                DriverAvailability::APPROVAL_APPROVED,
            ])
            ->whereDate('date', $pickupAt->toDateString())
            ->whereTime('start_time', '<=', $pickupAt->format('H:i:s'))
            ->whereTime('end_time', '>=', $endAt->format('H:i:s'))
            ->exists();

        if (! $hasAvailability) {
            throw ValidationException::withMessages([
                'driver_id' => 'Deze chauffeur heeft geen vrije beschikbaarheid in dit tijdsblok.',
            ]);
        }

        $hasOverlap = Ride::query()
            ->where('driver_id', $driver->id)
            ->blockingSchedule()
            ->when($ride->id, fn ($query) => $query->whereKeyNot($ride->id))
            ->overlappingWindow($pickupAt, $endAt)
            ->exists();

        if ($hasOverlap) {
            throw ValidationException::withMessages([
                'driver_id' => 'Deze chauffeur heeft al een andere rit in dit tijdsblok.',
            ]);
        }
    }

    public function syncBusySlots(Ride $ride): void
    {
        $this->clearBusySlots($ride);

        if (! $ride->driver_id) {
            return;
        }

        if (! in_array($ride->status, Ride::BLOCKING_STATUSES, true)) {
            return;
        }

        $pickupAt = $ride->pickup_datetime->copy();
        $endAt = $ride->effective_end_at->copy();

        if (! $pickupAt->isSameDay($endAt)) {
            return;
        }

        DriverAvailability::create([
            'driver_id' => $ride->driver_id,
            'ride_id' => $ride->id,
            'date' => $pickupAt->toDateString(),
            'start_time' => $pickupAt->format('H:i:s'),
            'end_time' => $endAt->format('H:i:s'),
            'status' => DriverAvailability::STATUS_BUSY,
            'availability_type' => DriverAvailability::TYPE_AVAILABLE,
            'approval_status' => DriverAvailability::APPROVAL_NOT_REQUIRED,
            'requested_by_role' => DriverAvailability::REQUESTED_BY_ADMIN,
        ]);
    }

    public function clearBusySlots(Ride $ride): void
    {
        DriverAvailability::query()
            ->where('ride_id', $ride->id)
            ->delete();
    }
}