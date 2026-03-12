<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('driver_availabilities', function (Blueprint $table) {
            $table->foreignId('ride_id')
                ->nullable()
                ->after('driver_id')
                ->constrained('rides')
                ->nullOnDelete();

            $table->index(['driver_id', 'date', 'status']);
            $table->index('ride_id');
        });
    }

    public function down(): void
    {
        Schema::table('driver_availabilities', function (Blueprint $table) {
            $table->dropConstrainedForeignId('ride_id');
        });
    }
};