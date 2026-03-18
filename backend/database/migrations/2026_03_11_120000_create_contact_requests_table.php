<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('contact_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('email')->nullable();
            $table->string('request_type')->nullable();
            $table->string('status')->nullable();
            $table->string('service_type')->nullable();
            $table->string('pickup_address')->nullable();
            $table->string('dropoff_address')->nullable();
            $table->date('travel_date')->nullable();
            $table->boolean('return_trip')->default(false);
            $table->integer('passengers')->nullable();
            $table->decimal('price_per_km', 8, 2)->nullable();
            $table->decimal('estimated_km', 8, 2)->nullable();
            $table->decimal('empty_km', 8, 2)->nullable();
            $table->decimal('total_price', 10, 2)->nullable();
            $table->text('quote_notes')->nullable();
            $table->timestamp('quote_sent_at')->nullable();
            $table->timestamp('quote_signed_at')->nullable();
            $table->string('quote_signer_name')->nullable();
            $table->string('quote_signature_method')->nullable();
            $table->string('quote_signature_image')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contact_requests');
    }
};
