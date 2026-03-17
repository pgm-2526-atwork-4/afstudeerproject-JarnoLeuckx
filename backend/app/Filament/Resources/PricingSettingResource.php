<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PricingSettingResource\Pages;
use App\Models\PricingSetting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PricingSettingResource extends Resource
{
    protected static ?string $model = PricingSetting::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-euro';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Prijsinstellingen')
                ->schema([
                    Forms\Components\Toggle::make('enabled')
                        ->label('Prijsinstellingen actief')
                        ->helperText('Schakel uit om deze prijsinstellingen tijdelijk niet te gebruiken.'),
                    Forms\Components\TextInput::make('base_fee')
                        ->label('Startkost (€)')
                        ->numeric()
                        ->minValue(0)
                        ->required(),

                    Forms\Components\TextInput::make('price_per_km')
                        ->label('Prijs per km (€)')
                        ->numeric()
                        ->minValue(0)
                        ->required(),

                    Forms\Components\TextInput::make('empty_km_price')
                        ->label('Prijs per lege km (€)')
                        ->numeric()
                        ->minValue(0)
                        ->required(),

                    Forms\Components\TextInput::make('vat_percentage')
                        ->label('BTW-percentage (%)')
                        ->numeric()
                        ->minValue(0)
                        ->maxValue(100)
                        ->step(0.01)
                        ->required(),
                ])
                ->columns(4),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('base_fee')->label('Startkost (€)')->money('EUR')->sortable(),
                Tables\Columns\TextColumn::make('price_per_km')->label('€/km')->money('EUR')->sortable(),
                Tables\Columns\TextColumn::make('empty_km_price')->label('Lege km (€)')->money('EUR')->sortable(),
                Tables\Columns\TextColumn::make('vat_percentage')->label('BTW (%)')->sortable(),
                Tables\Columns\BadgeColumn::make('enabled')
                    ->label('Actief')
                    ->colors([
                        'success' => true,
                        'gray' => false,
                    ])
                    ->formatStateUsing(fn ($state) => $state ? 'Actief' : 'Uit'),
                Tables\Columns\TextColumn::make('updated_at')->label('Laatst aangepast')->dateTime('d/m/Y H:i')->sortable(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPricingSettings::route('/'),
            'create' => Pages\CreatePricingSetting::route('/create'),
            'edit' => Pages\EditPricingSetting::route('/{record}/edit'),
        ];
    }
}