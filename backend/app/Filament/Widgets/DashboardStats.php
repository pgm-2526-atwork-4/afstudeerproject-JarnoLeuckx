<?php

namespace App\Filament\Widgets;

use App\Models\DriverAvailability;
use App\Models\Ride;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStats extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Totaal klanten', User::where('role', 'customer')->count())
                ->description('Geregistreerde klanten')
                ->descriptionIcon('heroicon-m-user-group')
                ->icon('heroicon-m-user-group')
                ->color('primary'),

            Stat::make('Actieve ritten', Ride::whereIn('status', ['assigned', 'accepted', 'in_progress'])->count())
                ->description(Ride::whereDate('pickup_datetime', today())->count() . ' vandaag gepland')
                ->descriptionIcon('heroicon-m-calendar-days')
                ->icon('heroicon-m-truck')
                ->color('success'),

            Stat::make(
                'Chauffeurs vandaag',
                DriverAvailability::whereDate('date', today())
                    ->where('status', 'available')
                    ->distinct('driver_id')
                    ->count('driver_id')
            )
                ->description('Beschikbaar voor ritten')
                ->descriptionIcon('heroicon-m-user')
                ->icon('heroicon-m-user')
                ->color('info'),

            Stat::make('In behandeling', Ride::where('status', 'pending')->count())
                ->description('Wachten op toewijzing')
                ->descriptionIcon('heroicon-m-clock')
                ->icon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('Afgerond', Ride::where('status', 'completed')->count())
                ->description('Succesvol uitgevoerd')
                ->descriptionIcon('heroicon-m-check-circle')
                ->icon('heroicon-m-check-circle')
                ->color('info'),
        ];
    }
}