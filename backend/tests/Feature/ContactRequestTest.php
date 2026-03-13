<?php

namespace Tests\Feature;

use App\Mail\ContactFormMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_stores_a_quote_request(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/contact', [
            'request_type' => 'offerte',
            'name' => 'Jan Janssens',
            'email' => 'jan@example.com',
            'phone' => '+32470123456',
            'message' => 'Ik wil graag een prijsindicatie voor volgende week.',
            'service_type' => 'rolstoel',
            'pickup_address' => 'Kerkstraat 10, Mechelen',
            'dropoff_address' => 'Ziekenhuislaan 2, Antwerpen',
            'travel_date' => now()->addDays(3)->toDateString(),
            'return_trip' => true,
            'passengers' => 2,
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('contact_requests', [
            'request_type' => 'offerte',
            'name' => 'Jan Janssens',
            'email' => 'jan@example.com',
            'service_type' => 'rolstoel',
            'status' => 'nieuw',
        ]);

        Mail::assertSent(ContactFormMail::class);
    }
}
