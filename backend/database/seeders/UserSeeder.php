<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@socialdrive.test',
            'phone' => null,
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Driver Test',
            'email' => 'driver@socialdrive.test',
            'phone' => '0400000000',
            'password' => Hash::make('password123'),
            'role' => 'driver',
        ]);

        User::create([
            'name' => 'Customer Test',
            'email' => 'customer@socialdrive.test',
            'phone' => '0499000000',
            'password' => Hash::make('password123'),
            'role' => 'customer',
        ]);
    }
}