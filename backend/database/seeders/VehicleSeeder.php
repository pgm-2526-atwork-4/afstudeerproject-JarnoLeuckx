<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        Vehicle::updateOrCreate(
            ['license_plate' => '1-ABC-123'],
            [
                'name' => 'Social Drive Van',
                'seats' => 6,
                'wheelchair_accessible' => true,
                'active' => true,
            ]
        );
    }
}