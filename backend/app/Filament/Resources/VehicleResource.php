<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VehicleResource\Pages;
use App\Models\Vehicle;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class VehicleResource extends Resource
{
    protected static ?string $model = Vehicle::class;

    protected static ?string $navigationIcon = 'heroicon-o-truck';
    protected static ?string $navigationLabel = 'Voertuigen';
    protected static ?string $pluralModelLabel = 'Voertuigen';
    protected static ?string $modelLabel = 'Voertuig';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Voertuig')
                ->schema([
                    Forms\Components\TextInput::make('name')
                        ->label('Naam')
                        ->required()
                        ->maxLength(255),

                    Forms\Components\TextInput::make('license_plate')
                        ->label('Kentekenplaat')
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->maxLength(50),

                    Forms\Components\TextInput::make('seats')
                        ->label('Zitplaatsen')
                        ->numeric()
                        ->minValue(1)
                        ->nullable(),

                    Forms\Components\Toggle::make('wheelchair_accessible')
                        ->label('Rolstoeltoegankelijk')
                        ->default(true),

                    Forms\Components\Toggle::make('active')
                        ->label('Actief')
                        ->default(true),
                ])
                ->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Naam')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('license_plate')
                    ->label('Kenteken')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\IconColumn::make('wheelchair_accessible')
                    ->label('Rolstoel')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\IconColumn::make('active')
                    ->label('Actief')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Aangemaakt')
                    ->dateTime('d/m/Y H:i')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('active')
                    ->label('Actief'),

                Tables\Filters\TernaryFilter::make('wheelchair_accessible')
                    ->label('Rolstoeltoegankelijk'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVehicles::route('/'),
            'create' => Pages\CreateVehicle::route('/create'),
            'edit' => Pages\EditVehicle::route('/{record}/edit'),
        ];
    }
}