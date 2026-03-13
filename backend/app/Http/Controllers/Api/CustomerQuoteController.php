<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use App\Models\User;
use Carbon\Carbon;
use Filament\Notifications\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerQuoteController extends Controller
{
    /**
     * List all offerte requests linked to the authenticated customer.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $quotes = ContactRequest::query()
            ->where('request_type', 'offerte')
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('email', $user->email);
            })
            ->whereIn('status', ['offerte_verstuurd', 'ondertekend', 'afgewerkt'])
            ->orderByDesc('created_at')
            ->get([
                'id', 'status', 'service_type', 'pickup_address', 'dropoff_address',
                'travel_date', 'return_trip', 'passengers',
                'price_per_km', 'estimated_km', 'empty_km', 'total_price', 'quote_notes',
                'quote_sent_at', 'quote_signed_at', 'quote_signer_name', 'quote_signature_method',
                'created_at',
            ]);

        return response()->json(['quotes' => $quotes]);
    }

    /**
     * Digitally sign a quote.
     */
    public function sign(Request $request, ContactRequest $quote): JsonResponse
    {
        $user = $request->user();

        // Verify ownership
        if ($quote->user_id !== $user->id && $quote->email !== $user->email) {
            return response()->json(['message' => 'Geen toegang tot deze offerte.'], 403);
        }

        if ($quote->request_type !== 'offerte') {
            return response()->json(['message' => 'Dit is geen offerteaanvraag.'], 422);
        }

        if ($quote->status !== 'offerte_verstuurd') {
            return response()->json(['message' => 'Deze offerte kan niet (meer) worden ondertekend.'], 422);
        }

        $validated = $request->validate([
            'signer_name'      => ['required', 'string', 'min:2', 'max:255'],
            'signer_date'      => ['required', 'date', 'before_or_equal:today'],
            'signature_method' => ['required', 'in:name,draw'],
            'accepted_terms'   => ['required', 'accepted'],
        ]);

        $signedAt = Carbon::parse($validated['signer_date'])->startOfDay();

        $quote->update([
            'quote_signed_at'         => $signedAt,
            'quote_signer_name'       => $validated['signer_name'],
            'quote_signature_method'  => $validated['signature_method'],
            'status'                  => 'ondertekend',
        ]);

        // Notify admins
        $admins = User::query()->where('role', 'admin')->get();
        if ($admins->isNotEmpty()) {
            Notification::make()
                ->title('Prijsofferte ondertekend')
                ->body(
                    "{$user->name} heeft offerte #{$quote->id} digitaal ondertekend op {$signedAt->format('d/m/Y')}."
                )
                ->icon('heroicon-o-check-circle')
                ->sendToDatabase($admins);
        }

        return response()->json([
            'message' => 'De offerte werd succesvol ondertekend.',
            'quote'   => $quote->fresh([
                'id', 'status', 'quote_signed_at', 'quote_signer_name', 'quote_signature_method',
            ]),
        ]);
    }
}
