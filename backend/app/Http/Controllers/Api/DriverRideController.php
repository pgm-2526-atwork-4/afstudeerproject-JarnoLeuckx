<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ride;
use Illuminate\Http\Request;

class DriverRideController extends Controller
{
    public function index(Request $request)
    {
        return Ride::query()
            ->where('driver_id', $request->user()->id)
            ->orderBy('pickup_datetime')
            ->get();
    }

    public function schedule(Request $request)
    {
        $data = $request->validate([
            'date' => ['required', 'date'],
        ]);

        return Ride::query()
            ->where('driver_id', $request->user()->id)
            ->whereDate('pickup_datetime', $data['date'])
            ->orderBy('pickup_datetime')
            ->get();
    }

    public function accept(Request $request, Ride $ride)
    {
        if ((int) $ride->driver_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($ride->status !== 'assigned') {
            return response()->json([
                'message' => 'Alleen toegewezen ritten kunnen bevestigd worden.'
            ], 422);
        }

        $ride->update([
            'status' => 'accepted',
        ]);

        return response()->json($ride->fresh());
    }

    public function reject(Request $request, Ride $ride)
    {
        if ((int) $ride->driver_id !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($ride->status !== 'assigned') {
            return response()->json([
                'message' => 'Alleen toegewezen ritten kunnen geweigerd worden.'
            ], 422);
        }

        $ride->update([
            'status' => 'cancelled',
        ]);

        return response()->json($ride->fresh());
    }
}