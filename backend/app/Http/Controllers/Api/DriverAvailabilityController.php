<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DriverAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DriverAvailabilityController extends Controller
{
    public function index(Request $request)
    {
        return DriverAvailability::query()
            ->where('driver_id', $request->user()->id)
            ->orderBy('date')
            ->orderBy('start_time')
            ->get()
            ->map(fn (DriverAvailability $availability) => $this->toApiPayload($availability));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'availability_type' => ['required', 'in:' . implode(',', DriverAvailability::ALLOWED_TYPES)],
            'period_months' => ['required', 'integer', 'in:1,6'],
        ]);

        $startsAt = Carbon::parse($data['date'])->startOfDay();
        $endsAt = $startsAt->copy()->addMonths((int) $data['period_months'])->subDay();

        $records = [];

        $cursor = $startsAt->copy();
        while ($cursor->lte($endsAt)) {
            $isLeaveRequest = $data['availability_type'] === DriverAvailability::TYPE_LEAVE;

            $availability = DriverAvailability::updateOrCreate(
                [
                    'driver_id' => $request->user()->id,
                    'date' => $cursor->toDateString(),
                    'start_time' => $data['start_time'],
                    'end_time' => $data['end_time'],
                ],
                [
                    'status' => $isLeaveRequest
                        ? DriverAvailability::STATUS_AVAILABLE
                        : ($data['availability_type'] === DriverAvailability::TYPE_AVAILABLE
                            ? DriverAvailability::STATUS_AVAILABLE
                            : DriverAvailability::STATUS_UNAVAILABLE),
                    'availability_type' => $data['availability_type'],
                    'approval_status' => $isLeaveRequest ? DriverAvailability::APPROVAL_PENDING : DriverAvailability::APPROVAL_NOT_REQUIRED,
                    'requested_by_role' => DriverAvailability::REQUESTED_BY_DRIVER,
                ]
            );

            $records[] = $availability;
            $cursor->addDay();
        }

        return response()->json([
            'message' => $data['availability_type'] === 'leave'
                ? 'Verlofaanvraag ingediend. Een admin moet deze goedkeuren.'
                : 'Beschikbaarheid succesvol opgeslagen.',
            'count' => count($records),
            'items' => collect($records)->map(fn (DriverAvailability $availability) => $this->toApiPayload($availability))->values(),
        ], 201);
    }

    private function toApiPayload(DriverAvailability $availability): array
    {
        return [
            'id' => $availability->id,
            'driver_id' => $availability->driver_id,
            'date' => $availability->date,
            'start_time' => $availability->start_time,
            'end_time' => $availability->end_time,
            'status' => $availability->status,
            'availability_type' => $availability->availability_type,
            'approval_status' => $availability->approval_status,
            'requested_by_role' => $availability->requested_by_role,
            'status_label' => match ($availability->status) {
                DriverAvailability::STATUS_AVAILABLE => 'Beschikbaar',
                DriverAvailability::STATUS_UNAVAILABLE => 'Niet beschikbaar',
                default => (string) $availability->status,
            },
            'availability_type_label' => match ($availability->availability_type) {
                DriverAvailability::TYPE_AVAILABLE => 'Beschikbaar',
                DriverAvailability::TYPE_SICK => 'Ziekte',
                DriverAvailability::TYPE_LEAVE => 'Verlof',
                default => (string) $availability->availability_type,
            },
            'approval_status_label' => match ($availability->approval_status) {
                DriverAvailability::APPROVAL_NOT_REQUIRED => 'Niet nodig',
                DriverAvailability::APPROVAL_PENDING => 'In afwachting',
                DriverAvailability::APPROVAL_APPROVED => 'Goedgekeurd',
                DriverAvailability::APPROVAL_REJECTED => 'Afgekeurd',
                default => (string) $availability->approval_status,
            },
            'created_at' => $availability->created_at,
            'updated_at' => $availability->updated_at,
        ];
    }

    public function destroy(Request $request, DriverAvailability $availability)
    {
        if ($availability->driver_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $availability->delete();

        return response()->json(['ok' => true]);
    }
}