<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        Vehicle::create([
            'name' => 'Social Drive Van',
            'license_plate' => '1-ABC-123',
            'seats' => 6,
            'wheelchair_accessible' => true,
            'active' => true,
        ]);
    }
}