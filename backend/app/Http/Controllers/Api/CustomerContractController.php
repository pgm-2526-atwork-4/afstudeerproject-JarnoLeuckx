<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PricingSetting;
use App\Models\User;
use Carbon\Carbon;
use Filament\Notifications\Notification;
use Illuminate\Http\Request;

class CustomerContractController extends Controller
{
    public function sign(Request $request)
    {
        $data = $request->validate([
            'signer_name' => ['required', 'string', 'max:255'],
            'signer_date' => ['required', 'date', 'before_or_equal:today'],
            'signature_method' => ['required', 'in:name,draw'],
        ]);

        $user = $request->user();

        $latestPricingUpdatedAt = PricingSetting::query()->max('updated_at');
        $latestPricingMoment = $latestPricingUpdatedAt
            ? Carbon::parse($latestPricingUpdatedAt)
            : null;

        if (
            $user->pvb_contract_signed_pricing_updated_at &&
            (
                ! $latestPricingMoment ||
                $latestPricingMoment->lte($user->pvb_contract_signed_pricing_updated_at)
            )
        ) {
            return response()->json([
                'message' => 'Dit contract is al ondertekend. Opnieuw ondertekenen kan pas na een prijswijziging door admin.',
            ], 422);
        }

        $user->update([
            'pvb_contract_signer_name' => $data['signer_name'],
            'pvb_contract_signed_at' => Carbon::parse($data['signer_date'])->startOfDay(),
            'pvb_contract_signature_method' => $data['signature_method'],
            'pvb_contract_signed_pricing_updated_at' => $latestPricingMoment ?? now(),
        ]);

        $admins = User::query()
            ->where('role', 'admin')
            ->get();

        if ($admins->isNotEmpty()) {
            Notification::make()
                ->title('PVB-contract ondertekend')
                ->body("{$user->name} heeft het PVB-contract digitaal ondertekend op {$data['signer_date']} ({$data['signature_method']}).")
                ->icon('heroicon-o-check-circle')
                ->sendToDatabase($admins);
        }

        return response()->json([
            'message' => 'PVB-contract werd succesvol ondertekend en opgeslagen.',
            'user' => $user->fresh(),
        ]);
    }
}
