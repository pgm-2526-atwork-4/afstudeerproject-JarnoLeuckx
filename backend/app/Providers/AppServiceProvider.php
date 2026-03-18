<?php

namespace App\Providers;

use App\Models\Ride;
use App\Observers\RideObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    
    public function register(): void
    {
    }

    
    public function boot(): void
    {
        Ride::observe(RideObserver::class);
    }
}
