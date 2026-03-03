<?php

namespace App\Filament\Resources\RideResource\Pages;

use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateRide extends CreateRecord
{
    protected static string $resource = \App\Filament\Resources\RideResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (! empty($data['driver_id']) && (($data['status'] ?? 'pending') === 'pending')) {
            $data['status'] = 'assigned';
        }

        return $data;
    }
}
