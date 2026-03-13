<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_requests', function (Blueprint $table): void {
            if (! Schema::hasColumn('contact_requests', 'empty_km')) {
                $table->decimal('empty_km', 8, 2)->nullable()->after('estimated_km');
            }
        });
    }

    public function down(): void
    {
        Schema::table('contact_requests', function (Blueprint $table): void {
            if (Schema::hasColumn('contact_requests', 'empty_km')) {
                $table->dropColumn('empty_km');
            }
        });
    }
};
