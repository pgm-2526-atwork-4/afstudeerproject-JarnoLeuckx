<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactFormMail;
use App\Models\ContactRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $emailRule = app()->environment(['local', 'testing'])
            ? 'email'
            : 'email:rfc,dns';

        $data = $request->validate([
            'request_type' => ['required', 'in:contact,offerte'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', $emailRule, 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'service_type' => ['nullable', 'string', 'max:255'],
            'pickup_address' => ['nullable', 'string', 'max:255'],
            'dropoff_address' => ['nullable', 'string', 'max:255'],
            'travel_date' => ['nullable', 'date'],
            'return_trip' => ['nullable', 'boolean'],
            'passengers' => ['nullable', 'integer', 'min:1', 'max:20'],
        ]);

        if ($data['request_type'] === 'contact' && empty($data['subject'])) {
            return response()->json([
                'message' => 'Kies eerst een onderwerp.',
            ], 422);
        }

        if ($data['request_type'] === 'offerte') {
            $requiredFields = [
                'service_type' => 'Kies een dienst voor de offerteaanvraag.',
                'pickup_address' => 'Geef een ophaallocatie op.',
                'dropoff_address' => 'Geef een bestemming op.',
                'travel_date' => 'Kies een gewenste reisdatum.',
            ];

            foreach ($requiredFields as $field => $errorMessage) {
                if (empty($data[$field])) {
                    return response()->json([
                        'message' => $errorMessage,
                    ], 422);
                }
            }
        }

        ContactRequest::query()->create([
            'request_type' => $data['request_type'],
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'subject' => $data['subject'] ?? null,
            'message' => $data['message'],
            'service_type' => $data['service_type'] ?? null,
            'pickup_address' => $data['pickup_address'] ?? null,
            'dropoff_address' => $data['dropoff_address'] ?? null,
            'travel_date' => $data['travel_date'] ?? null,
            'return_trip' => (bool) ($data['return_trip'] ?? false),
            'passengers' => $data['passengers'] ?? null,
            'status' => 'nieuw',
        ]);

        Mail::to(
            config('services.contact.recipient_address'),
            config('services.contact.recipient_name')
        )->send(new ContactFormMail($data));

        return response()->json([
            'message' => $data['request_type'] === 'offerte'
                ? 'Uw offerteaanvraag werd succesvol verzonden. We nemen snel contact met u op.'
                : 'Uw bericht werd succesvol verzonden. We nemen zo snel mogelijk contact op.',
        ]);
    }
}