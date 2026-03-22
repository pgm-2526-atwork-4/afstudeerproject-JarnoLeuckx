<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {

        User::updateOrCreate(
            ['email' => 'admin@socialdrive.test'],
            [
                'name' => 'Admin',
                'phone' => null,
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'email_verified_at' => now(),
                'avatar' => 'image/default-avatar.svg',
            ]
        );


        User::updateOrCreate(
            ['email' => 'driver@socialdrive.test'],
            [
                'name' => 'Driver Test',
                'phone' => '0400000000',
                'password' => Hash::make('password123'),
                'role' => 'driver',
                'email_verified_at' => now(),
                'avatar' => 'image/default-avatar.svg',
            ]
        );

        User::updateOrCreate(
            ['email' => 'customer@socialdrive.test'],
            [
                'name' => 'Customer Test',
                'phone' => '0499000000',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'email_verified_at' => now(),
                'avatar' => 'image/default-avatar.svg',
            ]
        );
    }
}