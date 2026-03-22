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
        
        $airportPickupAt = now()->addDays(2)->startOfDay()->setHour(9);
        $wheelchairPickupAt = now()->addDays(5)->startOfDay()->setHour(10);
        $customer = User::where('role', 'customer')->first();
        $driver = User::where('role', 'driver')->first();
        $vehicle = Vehicle::first();

        if (! $customer) {
            return;
        }


        // Rit op vandaag
        $todayPickupAt = now()->startOfDay()->setHour(14); // 14u vandaag
        // Rit op vandaag toevoegen
        Ride::updateOrCreate(
            [
                'customer_id' => $customer->id,
                'service_type' => 'regular',
                'pickup_street' => 'Teststraat',
                'pickup_postcode' => '1000',
                'pickup_city' => 'Brussel',
                'dropoff_street' => 'Centrumlaan',
                'dropoff_postcode' => '1000',
                'dropoff_city' => 'Brussel',
                'pickup_datetime' => $todayPickupAt,
            ],
            [
                'driver_id' => $driver?->id,
                'vehicle_id' => $vehicle?->id,
                'distance_km' => 5,
                'total_price' => 12.50,
                'status' => 'confirmed',
            ]
        );

        Ride::updateOrCreate(
            [
                'customer_id' => $customer->id,
                'service_type' => 'airport',
                'pickup_street' => 'Stationsstraat',
                'pickup_postcode' => '2800',
                'pickup_city' => 'Mechelen',
                'dropoff_street' => 'Brussels Airport',
                'dropoff_postcode' => '1930',
                'dropoff_city' => 'Zaventem',
            ],
            [
                'driver_id' => $driver?->id,
                'vehicle_id' => $vehicle?->id,
                'pickup_datetime' => $airportPickupAt,
                'distance_km' => 25,
                'total_price' => 55.00,
                'status' => 'confirmed',
            ]
        );

        Ride::updateOrCreate(
            [
                'customer_id' => $customer->id,
                'service_type' => 'wheelchair',
                'pickup_street' => 'Kerkstraat',
                'pickup_postcode' => '2800',
                'pickup_city' => 'Mechelen',
                'dropoff_street' => 'AZ Sint-Maarten',
                'dropoff_postcode' => '2800',
                'dropoff_city' => 'Mechelen',
            ],
            [
                'pickup_datetime' => $wheelchairPickupAt,
                'distance_km' => 8,
                'total_price' => 21.00,
                'status' => 'pending',
            ]
        );
    }
}