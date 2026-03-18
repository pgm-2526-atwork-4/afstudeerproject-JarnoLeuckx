<?php

namespace Database\Seeders;

use App\Models\DriverAvailability;
use App\Models\User;
use Illuminate\Database\Seeder;

class DriverAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $driver = User::where('role', 'driver')->first();

        if (! $driver) {
            return;
        }

        $firstDate = now()->addDay()->toDateString();
        $secondDate = now()->addDays(2)->toDateString();

        DriverAvailability::updateOrCreate(
            [
                'driver_id' => $driver->id,
                'date' => $firstDate,
                'start_time' => '08:00',
                'end_time' => '16:00',
            ],
            [
                'status' => 'available',
            ]
        );

        DriverAvailability::updateOrCreate(
            [
                'driver_id' => $driver->id,
                'date' => $secondDate,
                'start_time' => '10:00',
                'end_time' => '18:00',
            ],
            [
                'status' => 'available',
            ]
        );
    }
}