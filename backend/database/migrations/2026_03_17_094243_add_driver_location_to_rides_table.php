<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('rides', function (Blueprint $table) {
            $table->decimal('driver_latitude', 10, 7)->nullable();
            $table->decimal('driver_longitude', 10, 7)->nullable();
            $table->timestamp('driver_location_shared_at')->nullable();
        });
    }

    public function down()
    {
        Schema::table('rides', function (Blueprint $table) {
            $table->dropColumn(['driver_latitude', 'driver_longitude', 'driver_location_shared_at']);
        });
    }
};