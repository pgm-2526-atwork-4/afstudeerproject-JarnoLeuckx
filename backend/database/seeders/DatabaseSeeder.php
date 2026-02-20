<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User seeding verwijderd omdat het model niet bestaat

        // Voeg admin login toe
        User::create([
            'name' => 'Admin',
            'email' => 'admin@socialdrive.be',
            'password' => Hash::make('adminTest2026'),
            // Voeg extra velden toe indien nodig, zoals 'role' => 'admin'
        ]);
    }
}
