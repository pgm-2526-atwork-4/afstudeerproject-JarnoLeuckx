<?php

namespace App\Observers;

use App\Filament\Resources\RideResource;
use App\Mail\RideConfirmationMail;
use App\Mail\RideReservationMail;
use App\Models\Ride;
use App\Models\User;
use App\Notifications\RideStatusUpdatedNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class RideObserver
{
    public function created(Ride $ride): void
    {
        $ride->loadMissing(['customer', 'driver']);

        try {
            if ($this->canReceiveMail($ride->customer?->email)) {
                Mail::to($ride->customer->email)->send(
                    new RideConfirmationMail($ride, $this->customerAccountUrl())
                );
            }

            $adminEmails = User::query()
                ->where('role', 'admin')
                ->whereNotNull('email')
                ->pluck('email')
                ->filter(fn ($email) => $this->canReceiveMail($email))
                ->unique()
                ->values();

            if ($adminEmails->isNotEmpty()) {
                Mail::to($adminEmails->all())->send(
                    new RideReservationMail(
                        $ride,
                        RideResource::getUrl('edit', ['record' => $ride->id])
                    )
                );
            }
        } catch (\Throwable $e) {
            Log::error('Mail send failed', [
                'ride_id' => $ride->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function updated(Ride $ride): void
    {
        if (! $ride->wasChanged('status')) {
            return;
        }

        $ride->loadMissing(['customer', 'driver']);

        if (! $ride->customer || ! $this->canReceiveMail($ride->customer->email)) {
            return;
        }

        try {
            $ride->customer->notify(new RideStatusUpdatedNotification($ride));
        } catch (\Throwable $e) {
            Log::error('Ride status notification failed', [
                'ride_id' => $ride->id,
                'customer_id' => $ride->customer->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function customerAccountUrl(): string
    {
        return rtrim((string) config('services.frontend.url', config('app.frontend_url', config('app.url'))), '/') . '/customer/account';
    }

    private function canReceiveMail(?string $email): bool
    {
        return filled($email)
            && filter_var($email, FILTER_VALIDATE_EMAIL)
            && ! str_ends_with(strtolower($email), '.test');
    }
}