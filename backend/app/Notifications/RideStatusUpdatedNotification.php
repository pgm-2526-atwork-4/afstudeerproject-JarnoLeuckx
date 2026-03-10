<?php

namespace App\Notifications;

use App\Models\Ride;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RideStatusUpdatedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Ride $ride,
    )
    {
    }

    public function via(object $notifiable): array
    {
        $channels = ['database'];

        if (($notifiable->email_notifications_enabled ?? true) && ! empty($notifiable->email)) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        $statusMessage = $this->messageForStatus();
        $accountUrl = $this->customerAccountUrl();

        return (new MailMessage)
            ->subject($statusMessage['title'])
            ->view('emails.rides.status', [
                'ride' => $this->ride,
                'notifiable' => $notifiable,
                'statusMessage' => $statusMessage,
                'accountUrl' => $accountUrl,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        $message = $this->messageForStatus();

        return [
            'title' => $message['title'],
            'body' => $message['body'],
            'ride_id' => $this->ride->id,
            'status' => $this->ride->status,
            'actions' => [
                [
                    'label' => 'Bekijk ritten',
                    'url' => $this->customerAccountUrl(),
                ],
            ],
        ];
    }

    private function messageForStatus(): array
    {
        return match ($this->ride->status) {
            'assigned' => [
                'title' => 'Uw rit werd toegewezen',
                'body' => 'Er werd een chauffeur aan uw rit gekoppeld. U vindt de details terug in uw account.',
            ],
            'accepted' => [
                'title' => 'Uw chauffeur bevestigde de rit',
                'body' => 'De toegewezen chauffeur heeft uw rit bevestigd. Alles staat klaar voor vertrek.',
            ],
            'cancelled' => [
                'title' => 'Uw rit werd geannuleerd',
                'body' => 'Uw rit werd geannuleerd. Neem contact op als u een alternatief vervoer nodig heeft.',
            ],
            'completed' => [
                'title' => 'Uw rit is afgerond',
                'body' => 'Uw rit werd succesvol afgerond. Bedankt om met Social Drive te reizen.',
            ],
            default => [
                'title' => 'Status van uw rit gewijzigd',
                'body' => "De status van uw rit staat nu op {$this->ride->status_label}.",
            ],
        };
    }

    private function customerAccountUrl(): string
    {
        return rtrim((string) config('services.frontend.url', config('app.url')), '/').'/customer/account';
    }
}
