<?php

namespace App\Mail;

use App\Models\ContactRequest;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuoteResponseMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactRequest $quote)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Uw prijsofferte van Social Drive',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quote.response',
            with: [
                'quote' => $this->quote,
            ],
        );
    }

    public function attachments(): array
    {
        $pdf = Pdf::loadView('pdf.quote', ['quote' => $this->quote])
            ->setPaper('a4');

        return [
            Attachment::fromData(
                fn () => $pdf->output(),
                'social-drive-prijsofferte.pdf',
            )->withMime('application/pdf'),
        ];
    }
}
