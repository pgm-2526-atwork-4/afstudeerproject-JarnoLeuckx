<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_requests', function (Blueprint $table): void {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();

            // Admin quote response fields
            $table->decimal('price_per_km', 8, 2)->nullable()->after('status');
            $table->decimal('estimated_km', 8, 2)->nullable()->after('price_per_km');
            $table->decimal('total_price', 8, 2)->nullable()->after('estimated_km');
            $table->text('quote_notes')->nullable()->after('total_price');
            $table->timestamp('quote_sent_at')->nullable()->after('quote_notes');

            // Customer signature fields
            $table->timestamp('quote_signed_at')->nullable()->after('quote_sent_at');
            $table->string('quote_signer_name')->nullable()->after('quote_signed_at');
            $table->string('quote_signature_method')->nullable()->after('quote_signer_name');
        });
    }

    public function down(): void
    {
        Schema::table('contact_requests', function (Blueprint $table): void {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'user_id',
                'price_per_km',
                'estimated_km',
                'total_price',
                'quote_notes',
                'quote_sent_at',
                'quote_signed_at',
                'quote_signer_name',
                'quote_signature_method',
            ]);
        });
    }
};
