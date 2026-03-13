<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_requests', function (Blueprint $table): void {
            if (! Schema::hasColumn('contact_requests', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
                $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            }

            if (! Schema::hasColumn('contact_requests', 'price_per_km')) {
                $table->decimal('price_per_km', 8, 2)->nullable()->after('status');
            }

            if (! Schema::hasColumn('contact_requests', 'estimated_km')) {
                $table->decimal('estimated_km', 8, 2)->nullable()->after('price_per_km');
            }

            if (! Schema::hasColumn('contact_requests', 'total_price')) {
                $table->decimal('total_price', 8, 2)->nullable()->after('estimated_km');
            }

            if (! Schema::hasColumn('contact_requests', 'quote_notes')) {
                $table->text('quote_notes')->nullable()->after('total_price');
            }

            if (! Schema::hasColumn('contact_requests', 'quote_signature_method')) {
                $table->string('quote_signature_method')->nullable()->after('quote_signer_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('contact_requests', function (Blueprint $table): void {
            $columns = ['user_id', 'price_per_km', 'estimated_km', 'total_price', 'quote_notes', 'quote_signature_method'];

            foreach ($columns as $column) {
                if (Schema::hasColumn('contact_requests', $column)) {
                    if ($column === 'user_id') {
                        $table->dropForeign(['user_id']);
                    }
                    $table->dropColumn($column);
                }
            }
        });
    }
};
