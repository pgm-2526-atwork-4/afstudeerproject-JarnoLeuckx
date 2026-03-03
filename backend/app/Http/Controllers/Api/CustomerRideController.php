<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ride;
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
            'pickup_postcode' => ['required', 'string', 'max:255'],
            'pickup_city' => ['required', 'string', 'max:255'],
            'dropoff_street' => ['required', 'string', 'max:255'],
            'dropoff_number' => ['nullable', 'string', 'max:255'],
            'dropoff_postcode' => ['required', 'string', 'max:255'],
            'dropoff_city' => ['required', 'string', 'max:255'],
            'pickup_datetime' => ['required', 'date'],
            'has_return_trip' => ['required', 'boolean'],
            'return_datetime' => ['nullable', 'date', 'required_if:has_return_trip,1', 'after:pickup_datetime'],
            'notes' => ['nullable', 'string'],
            'assistance_type' => ['nullable', 'in:luchthaven,ziekenhuis'],
        ]);

        $price = $this->calculatePrice(
            serviceType: $data['service_type'],
            assistanceType: $data['assistance_type'] ?? null,
        );

        $ride = Ride::create([
            'customer_id' => $request->user()->id,
            'driver_id' => null,
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
            'status' => 'pending',
        ]);

        return response()->json($ride, 201);
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
