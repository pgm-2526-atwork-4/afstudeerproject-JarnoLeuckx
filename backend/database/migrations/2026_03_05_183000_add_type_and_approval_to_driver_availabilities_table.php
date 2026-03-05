<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('driver_availabilities', function (Blueprint $table) {
            $table->string('availability_type')->default('available')->after('status');
            $table->string('approval_status')->default('not_required')->after('availability_type');
            $table->string('requested_by_role')->default('driver')->after('approval_status');
        });
    }

    public function down(): void
    {
        Schema::table('driver_availabilities', function (Blueprint $table) {
            $table->dropColumn(['availability_type', 'approval_status', 'requested_by_role']);
        });
    }
};
