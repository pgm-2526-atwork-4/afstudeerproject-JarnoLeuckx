<?php

namespace App\Filament\Resources\DriverAvailabilityResource\Pages;

use App\Filament\Resources\DriverAvailabilityResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListDriverAvailabilities extends ListRecords
{
    protected static string $resource = DriverAvailabilityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('calendar')
                ->label('Kalenderweergave')
                ->icon('heroicon-o-calendar-days')
                ->url(DriverAvailabilityResource::getUrl('calendar')),
            Actions\CreateAction::make(),
        ];
    }
}
