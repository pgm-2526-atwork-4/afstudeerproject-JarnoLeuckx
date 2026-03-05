<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('pvb_contract_signature_method')->nullable()->after('pvb_contract_signer_name');
            $table->timestamp('pvb_contract_signed_pricing_updated_at')->nullable()->after('pvb_contract_signature_method');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['pvb_contract_signature_method', 'pvb_contract_signed_pricing_updated_at']);
        });
    }
};
