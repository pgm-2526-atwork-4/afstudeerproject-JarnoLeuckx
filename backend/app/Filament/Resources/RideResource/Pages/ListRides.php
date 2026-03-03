<?php

namespace App\Filament\Resources\RideResource\Pages;

use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListRides extends ListRecords
{
    protected static string $resource = \App\Filament\Resources\RideResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
