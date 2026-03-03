<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DriverAvailability;
use Illuminate\Http\Request;

class DriverAvailabilityController extends Controller
{
    public function index(Request $request)
    {
        return DriverAvailability::query()
            ->where('driver_id', $request->user()->id)
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'status' => ['required', 'in:available,unavailable'],
        ]);

        $availability = DriverAvailability::create([
            'driver_id' => $request->user()->id,
            ...$data,
        ]);

        return response()->json($availability, 201);
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