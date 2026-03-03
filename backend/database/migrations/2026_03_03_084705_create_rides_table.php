
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rides', function (Blueprint $table) {
            $table->id();

            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained('users')->nullOnDelete();

            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();

            $table->string('service_type'); // bv. airport, wheelchair, medical

            $table->string('pickup_street');
            $table->string('pickup_number')->nullable();
            $table->string('pickup_postcode');
            $table->string('pickup_city');

            $table->string('dropoff_street');
            $table->string('dropoff_number')->nullable();
            $table->string('dropoff_postcode');
            $table->string('dropoff_city');

            $table->dateTime('pickup_datetime');
            $table->text('notes')->nullable();

            $table->integer('distance_km')->nullable();
            $table->decimal('total_price', 8, 2)->nullable();

            $table->string('status')->default('pending');
            // pending | assigned | accepted | in_progress | completed | cancelled

            $table->timestamps();

            $table->index(['customer_id', 'status']);
            $table->index(['driver_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rides');
    }
};