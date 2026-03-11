<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactFormMail;
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', $emailRule, 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        Mail::to(
            config('services.contact.recipient_address'),
            config('services.contact.recipient_name')
        )->send(new ContactFormMail($data));

        return response()->json([
            'message' => 'Uw bericht werd succesvol verzonden. We nemen zo snel mogelijk contact op.',
        ]);
    }
}