<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Ride;

class RideConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Ride $ride,
        public ?string $accountUrl = null,
    )
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Uw ritaanvraag #{$this->ride->id} is ontvangen",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.rides.confirmation',
            with: [
                'ride' => $this->ride,
                'customer' => $this->ride->customer,
                'driver' => $this->ride->driver,
                'accountUrl' => $this->accountUrl,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
