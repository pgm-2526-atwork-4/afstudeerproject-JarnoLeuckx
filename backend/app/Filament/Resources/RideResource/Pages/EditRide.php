<?php

namespace App\Filament\Resources\RideResource\Pages;

use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditRide extends EditRecord
{
    protected static string $resource = \App\Filament\Resources\RideResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
