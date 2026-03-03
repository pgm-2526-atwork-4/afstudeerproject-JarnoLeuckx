<?php

namespace Database\Seeders;

use App\Models\Ride;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class RideSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('role', 'customer')->first();
        $driver = User::where('role', 'driver')->first();
        $vehicle = Vehicle::first();

        Ride::create([
            'customer_id' => $customer->id,
            'driver_id' => $driver->id,
            'vehicle_id' => $vehicle->id,
            'service_type' => 'airport',
            'pickup_street' => 'Stationsstraat',
            'pickup_postcode' => '2800',
            'pickup_city' => 'Mechelen',
            'dropoff_street' => 'Brussels Airport',
            'dropoff_postcode' => '1930',
            'dropoff_city' => 'Zaventem',
            'pickup_datetime' => now()->addDays(2),
            'distance_km' => 25,
            'total_price' => 55.00,
            'status' => 'confirmed',
        ]);

        Ride::create([
            'customer_id' => $customer->id,
            'service_type' => 'wheelchair',
            'pickup_street' => 'Kerkstraat',
            'pickup_postcode' => '2800',
            'pickup_city' => 'Mechelen',
            'dropoff_street' => 'AZ Sint-Maarten',
            'dropoff_postcode' => '2800',
            'dropoff_city' => 'Mechelen',
            'pickup_datetime' => now()->addDays(5),
            'distance_km' => 8,
            'total_price' => 21.00,
            'status' => 'pending',
        ]);
    }
}