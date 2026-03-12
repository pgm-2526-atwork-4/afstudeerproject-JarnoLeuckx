<?php

namespace App\Filament\Resources\RideResource\Pages;

use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditRide extends EditRecord
{
    protected static string $resource = \App\Filament\Resources\RideResource::class;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (($data['status'] ?? 'pending') === 'accepted' && ($this->record->status ?? null) !== 'accepted') {
            $data['status'] = ! empty($data['driver_id']) ? 'assigned' : 'pending';
        }

        if (! empty($data['driver_id']) && (($data['status'] ?? 'pending') === 'pending')) {
            $data['status'] = 'assigned';
        }

        return $data;
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
