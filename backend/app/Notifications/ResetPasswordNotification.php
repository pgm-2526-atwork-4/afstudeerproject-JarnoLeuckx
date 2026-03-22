<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $token,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $resetUrl = rtrim((string) config('services.frontend.url'), '/')
            . '/reset-password?token=' . $this->token
            . '&email=' . urlencode($notifiable->getEmailForPasswordReset());

        return (new MailMessage())
            ->subject('Wachtwoord opnieuw instellen')
            ->greeting('Hallo ' . $notifiable->name . ',')
            ->line('U ontvangt deze e-mail omdat er een aanvraag werd gedaan om uw wachtwoord opnieuw in te stellen.')
            ->action('Wachtwoord opnieuw instellen', $resetUrl)
            ->line('Deze resetlink blijft ' . config('auth.passwords.' . config('auth.defaults.passwords') . '.expire') . ' minuten geldig.')
            ->line('Heeft u deze aanvraag niet gedaan? Dan hoeft u verder niets te doen.');
    }
}