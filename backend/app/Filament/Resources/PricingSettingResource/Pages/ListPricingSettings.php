<?php

namespace App\Filament\Resources\PricingSettingResource\Pages;

use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPricingSettings extends ListRecords
{
    protected static string $resource = \App\Filament\Resources\PricingSettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
