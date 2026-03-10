<?php

namespace App\Observers;

use App\Filament\Resources\RideResource;
use App\Mail\RideConfirmationMail;
use App\Mail\RideReservationMail;
use App\Models\Ride;
use App\Models\User;
use App\Notifications\RideStatusUpdatedNotification;
use Illuminate\Support\Facades\Mail;

class RideObserver
{
    public function created(Ride $ride): void
    {
        $ride->loadMissing(['customer', 'driver']);

        if (! empty($ride->customer?->email)) {
            Mail::to($ride->customer->email)->send(
                new RideConfirmationMail($ride, $this->customerAccountUrl())
            );
        }

        $adminEmails = User::query()
            ->where('role', 'admin')
            ->whereNotNull('email')
            ->pluck('email')
            ->filter()
            ->unique()
            ->values();

        if ($adminEmails->isNotEmpty()) {
            Mail::to($adminEmails->all())->send(
                new RideReservationMail($ride, RideResource::getUrl('edit', ['record' => $ride->id]))
            );
        }
    }

    public function updated(Ride $ride): void
    {
        if (! $ride->wasChanged('status')) {
            return;
        }

        $ride->loadMissing(['customer', 'driver']);

        if (! $ride->customer) {
            return;
        }

        $ride->customer->notify(new RideStatusUpdatedNotification($ride));
    }

    private function customerAccountUrl(): string
    {
        return rtrim((string) config('services.frontend.url', config('app.url')), '/').'/customer/account';
    }
}