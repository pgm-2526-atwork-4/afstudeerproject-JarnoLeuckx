<?php

namespace App\Filament\Resources\PricingSettingResource\Pages;

use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPricingSetting extends EditRecord
{
    protected static string $resource = \App\Filament\Resources\PricingSettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
