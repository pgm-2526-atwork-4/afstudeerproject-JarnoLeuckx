<?php

namespace Database\Seeders;

use App\Models\PricingSetting;
use Illuminate\Database\Seeder;

class PricingSeeder extends Seeder
{
    public function run(): void
    {
        PricingSetting::updateOrCreate(
            ['id' => 1],
            [
                'base_fee' => 5.00,
                'price_per_km' => 2.00,
            ]
        );
    }
}