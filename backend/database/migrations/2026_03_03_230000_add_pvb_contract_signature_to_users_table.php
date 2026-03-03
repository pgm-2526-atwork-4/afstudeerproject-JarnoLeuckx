<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('pvb_contract_signed_at')->nullable()->after('vaph_number');
            $table->string('pvb_contract_signer_name')->nullable()->after('pvb_contract_signed_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['pvb_contract_signed_at', 'pvb_contract_signer_name']);
        });
    }
};
