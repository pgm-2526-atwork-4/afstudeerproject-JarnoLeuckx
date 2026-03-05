<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Filament\Resources\RideResource;
use App\Models\DriverAvailability;
use App\Models\Ride;
use App\Models\User;
use Carbon\Carbon;
use Filament\Notifications\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Http\Request;

class CustomerRideController extends Controller
{
    public function index(Request $request)
    {
        return Ride::query()
            ->where('customer_id', $request->user()->id)
            ->orderByDesc('pickup_datetime')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'service_type' => ['required', 'in:airport,wheelchair,medical,assistance'],
            'pickup_street' => ['required', 'string', 'max:255'],
            'pickup_number' => ['nullable', 'string', 'max:255'],
            'pickup_postcode' => ['required', 'string', 'size:4', 'regex:/^[0-9]{4}$/'],
            'pickup_city' => ['required', 'string', 'max:255'],
            'dropoff_street' => ['required', 'string', 'max:255'],
            'dropoff_number' => ['nullable', 'string', 'max:255'],
            'dropoff_postcode' => ['required', 'string', 'size:4', 'regex:/^[0-9]{4}$/'],
            'dropoff_city' => ['required', 'string', 'max:255'],
            'pickup_datetime' => ['required', 'date', 'after_or_equal:now'],
            'has_return_trip' => ['required', 'boolean'],
            'return_datetime' => ['nullable', 'date', 'required_if:has_return_trip,1', 'after:pickup_datetime'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'assistance_type' => ['nullable', 'in:luchthaven,ziekenhuis'],
        ]);

        $price = $this->calculatePrice(
            serviceType: $data['service_type'],
            assistanceType: $data['assistance_type'] ?? null,
        );

        $pickupAt = Carbon::parse($data['pickup_datetime']);
        $returnAt = isset($data['return_datetime'])
            ? Carbon::parse($data['return_datetime'])
            : $pickupAt->copy();

        $assignedDriver = $this->findAvailableDriver($pickupAt, $returnAt);

        $ride = Ride::create([
            'customer_id' => $request->user()->id,
            'driver_id' => $assignedDriver?->id,
            'vehicle_id' => null,
            'service_type' => $data['service_type'],
            'pickup_street' => $data['pickup_street'],
            'pickup_number' => $data['pickup_number'] ?? null,
            'pickup_postcode' => $data['pickup_postcode'],
            'pickup_city' => $data['pickup_city'],
            'dropoff_street' => $data['dropoff_street'],
            'dropoff_number' => $data['dropoff_number'] ?? null,
            'dropoff_postcode' => $data['dropoff_postcode'],
            'dropoff_city' => $data['dropoff_city'],
            'pickup_datetime' => $data['pickup_datetime'],
            'return_datetime' => $data['return_datetime'] ?? null,
            'notes' => $data['notes'] ?? null,
            'distance_km' => null,
            'total_price' => $price,
            'status' => $assignedDriver ? 'assigned' : 'pending',
        ]);

        $admins = User::query()
            ->where('role', 'admin')
            ->get();

        if ($admins->isNotEmpty()) {
            Notification::make()
                ->title('Nieuwe ritaanvraag')
                ->body($assignedDriver
                    ? "Nieuwe rit (#{$ride->id}) van {$request->user()->name} is automatisch toegewezen aan {$assignedDriver->name}."
                    : "Er is een nieuwe rit (#{$ride->id}) aangemaakt door {$request->user()->name}.")
                ->icon('heroicon-o-bell-alert')
                ->actions([
                    Action::make('view_ride')
                        ->label('Bekijk rit')
                        ->url(RideResource::getUrl('edit', ['record' => $ride->id]))
                        ->button(),
                ])
                ->sendToDatabase($admins);
        }

        if ($assignedDriver) {
            Notification::make()
                ->title('Rit automatisch toegewezen')
                ->body("Je rit (#{$ride->id}) werd automatisch toegewezen aan chauffeur {$assignedDriver->name}.")
                ->icon('heroicon-o-check-circle')
                ->sendToDatabase([$request->user()]);

            Notification::make()
                ->title('Nieuwe toegewezen rit')
                ->body("Je hebt een nieuwe rit (#{$ride->id}) van klant {$request->user()->name}.")
                ->icon('heroicon-o-truck')
                ->sendToDatabase([$assignedDriver]);
        }

        return response()->json([
            'message' => $assignedDriver
                ? "Rit aangevraagd en automatisch toegewezen aan {$assignedDriver->name}."
                : 'Rit aangevraagd. Er is momenteel geen vrije chauffeur, een admin wijst deze later toe.',
            'ride' => $ride,
        ], 201);
    }

    private function findAvailableDriver(Carbon $pickupAt, Carbon $returnAt): ?User
    {
        if (! $pickupAt->isSameDay($returnAt)) {
            return null;
        }

        $availableDriverIds = DriverAvailability::query()
            ->where('status', 'available')
            ->whereDate('date', $pickupAt->toDateString())
            ->whereTime('start_time', '<=', $pickupAt->format('H:i:s'))
            ->whereTime('end_time', '>=', $returnAt->format('H:i:s'))
            ->pluck('driver_id');

        if ($availableDriverIds->isEmpty()) {
            return null;
        }

        return User::query()
            ->where('role', 'driver')
            ->where('approval_status', 'approved')
            ->whereIn('id', $availableDriverIds)
            ->whereDoesntHave('ridesAsDriver', function ($query) use ($pickupAt, $returnAt) {
                $query
                    ->whereNotIn('status', ['cancelled'])
                    ->where('pickup_datetime', '<=', $returnAt->toDateTimeString())
                    ->whereRaw(
                        'COALESCE(return_datetime, pickup_datetime) >= ?',
                        [$pickupAt->toDateTimeString()]
                    );
            })
            ->orderBy('id')
            ->first();
    }

    private function calculatePrice(string $serviceType, ?string $assistanceType): float
    {
        $basePrice = match ($serviceType) {
            'airport' => 55,
            'wheelchair' => 60,
            'medical' => 50,
            'assistance' => 65,
            default => 50,
        };

        $assistanceExtra = match ($assistanceType) {
            'luchthaven' => 15,
            'ziekenhuis' => 10,
            default => 0,
        };

        return (float) ($basePrice + $assistanceExtra);
    }
}
