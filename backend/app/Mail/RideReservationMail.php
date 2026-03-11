<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Ride;

class RideReservationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Ride $ride,
        public ?string $adminUrl = null,
    )
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Nieuwe ritaanvraag #{$this->ride->id}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.rides.reservation',
            with: [
                'ride' => $this->ride,
                'customer' => $this->ride->customer,
                'driver' => $this->ride->driver,
                'adminUrl' => $this->adminUrl,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
