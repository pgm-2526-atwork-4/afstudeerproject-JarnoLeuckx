<?php

namespace App\Notifications;

use App\Models\Ride;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RideArrivalNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Ride $ride,
        public string $mapsUrl,
    ) {}

    public function via(object $notifiable): array
    {
        $channels = ['database'];
        if (($notifiable->email_notifications_enabled ?? true) && !empty($notifiable->email)) {
            $channels[] = 'mail';
        }
        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Uw chauffeur is gearriveerd!')
            ->greeting('Beste ' . ($notifiable->name ?? 'klant') . ',')
            ->line('Uw chauffeur is gearriveerd op het ophaaladres:')
            ->line($this->ride->pickup_address ?? $this->ride->pickup_street . ' ' . $this->ride->pickup_number . ', ' . $this->ride->pickup_postcode . ' ' . $this->ride->pickup_city)
            ->action('Bekijk op Google Maps', $this->mapsUrl)
            ->line('Gelieve tijdig naar het voertuig te komen.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Uw chauffeur is gearriveerd!',
            'body' => 'Uw chauffeur is aangekomen op het ophaaladres.',
            'ride_id' => $this->ride->id,
            'status' => $this->ride->status,
            'actions' => [
                [
                    'label' => 'Bekijk op Google Maps',
                    'url' => $this->mapsUrl,
                ],
            ],
        ];
    }
}
