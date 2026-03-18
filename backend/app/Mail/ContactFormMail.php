<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public array $data)
    {
    }

    public function envelope(): Envelope
    {
        $isQuoteRequest = ($this->data['request_type'] ?? 'contact') === 'offerte';

        return new Envelope(
            subject: $isQuoteRequest
                ? 'Nieuwe offerteaanvraag via website'
                : 'Nieuw bericht via contactformulier',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact.message',
            with: [
                'data' => $this->data,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}