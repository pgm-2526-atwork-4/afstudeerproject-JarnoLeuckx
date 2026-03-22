<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Ride;

class RideArrivalMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Ride $ride,
        public ?string $mapsUrl = null,
    )
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Uw chauffeur is gearriveerd (#{$this->ride->id})",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.rides.arrival',
            with: [
                'ride' => $this->ride,
                'customer' => $this->ride->customer,
                'driver' => $this->ride->driver,
                'mapsUrl' => $this->mapsUrl,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
