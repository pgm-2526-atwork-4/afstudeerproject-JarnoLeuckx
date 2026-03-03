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

        DriverAvailability::create([
            'driver_id' => $driver->id,
            'date' => now()->addDay()->toDateString(),
            'start_time' => '08:00',
            'end_time' => '16:00',
            'status' => 'available',
        ]);

        DriverAvailability::create([
            'driver_id' => $driver->id,
            'date' => now()->addDays(2)->toDateString(),
            'start_time' => '10:00',
            'end_time' => '18:00',
            'status' => 'available',
        ]);
    }
}