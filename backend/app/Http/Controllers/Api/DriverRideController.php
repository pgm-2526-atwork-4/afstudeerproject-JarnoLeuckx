<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ride;
use App\Notifications\RideArrivalNotification;
use App\Services\RideAssignmentService;
use Illuminate\Http\Request;

class DriverRideController extends Controller
{
    public function index(Request $request)
    {
        return Ride::query()
            ->with('customer:id,name,phone,email')
            ->where('driver_id', $request->user()->id)
            ->orderBy('pickup_datetime')
            ->get()
            ->map(fn (Ride $ride) => $this->toApiPayload($ride));
    }

    public function schedule(Request $request)
    {
        $data = $request->validate([
            'date' => ['required', 'date'],
        ]);

        return Ride::query()
            ->with('customer:id,name,phone,email')
            ->where('driver_id', $request->user()->id)
            ->whereDate('pickup_datetime', $data['date'])
            ->orderBy('pickup_datetime')
            ->get()
            ->map(fn (Ride $ride) => $this->toApiPayload($ride));
    }

    public function accept(Request $request, Ride $ride)
    {
        if ((int) $ride->driver_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($ride->status !== 'assigned') {
            return response()->json([
                'message' => 'Alleen toegewezen ritten kunnen bevestigd worden.',
            ], 422);
        }

        $ride->update([
            'status' => 'accepted',
        ]);

        return response()->json($ride->fresh());
    }

    public function reject(Request $request, Ride $ride, RideAssignmentService $assignmentService)
    {
        if ((int) $ride->driver_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($ride->status !== 'assigned') {
            return response()->json([
                'message' => 'Alleen toegewezen ritten kunnen geweigerd worden.',
            ], 422);
        }

        $rejectedDriverId = (int) $ride->driver_id;

        $ride->update([
            'driver_id' => null,
            'vehicle_id' => null,
            'status' => Ride::STATUS_PENDING,
        ]);

        $newDriver = $assignmentService->assignAutomatically(
            $ride->fresh(),
            [$rejectedDriverId],
        );

        return response()->json([
            'ride' => $ride->fresh(),
            'reassigned_to' => $newDriver?->only(['id', 'name', 'email']),
        ]);
    }

    public function complete(Request $request, Ride $ride)
    {
        if ((int) $ride->driver_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (! in_array($ride->status, [Ride::STATUS_ACCEPTED, Ride::STATUS_IN_PROGRESS], true)) {
            return response()->json([
                'message' => 'Alleen bevestigde ritten kunnen als afgerond gemarkeerd worden.',
            ], 422);
        }

        $ride->update([
            'status' => Ride::STATUS_COMPLETED,
        ]);

        return response()->json($ride->fresh());
    }

    public function arrived(Request $request, Ride $ride)
    {
        if ((int) $ride->driver_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $address = $ride->pickup_address
            ?? trim($ride->pickup_street . ' ' . $ride->pickup_number . ', ' . $ride->pickup_postcode . ' ' . $ride->pickup_city);

        $mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' . urlencode($address);

        if ($ride->customer) {
            $ride->customer->notify(new RideArrivalNotification($ride, $mapsUrl));
        }

        return response()->json([
            'message' => 'Klant is verwittigd van aankomst.',
        ]);
    }

    private function toApiPayload(Ride $ride): array
    {
        return [
            'id' => $ride->id,
            'pickup_datetime' => $ride->pickup_datetime,
            'return_datetime' => $ride->return_datetime,
            'pickup_city' => $ride->pickup_city,
            'dropoff_city' => $ride->dropoff_city,
            'pickup_address' => $ride->pickup_address,
            'dropoff_address' => $ride->dropoff_address,
            'pickup_street' => $ride->pickup_street,
            'pickup_number' => $ride->pickup_number,
            'pickup_postcode' => $ride->pickup_postcode,
            'dropoff_street' => $ride->dropoff_street,
            'dropoff_number' => $ride->dropoff_number,
            'dropoff_postcode' => $ride->dropoff_postcode,
            'service_type' => $ride->service_type,
            'status' => $ride->status,
            'notes' => $ride->notes,
            'customer_name' => $ride->customer?->name,
            'customer_phone' => $ride->customer?->phone,
            'customer_email' => $ride->customer?->email,
        ];
    }
}