<?php

namespace App\Filament\Widgets;

use App\Models\Ride;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentRides extends BaseWidget
{
    protected static ?string $heading = 'Recente ritten';
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Ride::query()->latest('pickup_datetime')
            )
            ->defaultPaginationPageOption(5)
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('Rit ID')
                    ->formatStateUsing(fn ($state) => 'R-' . str_pad((string) $state, 3, '0', STR_PAD_LEFT)),

                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Klant')
                    ->searchable(),

                Tables\Columns\TextColumn::make('pickup_city')
                    ->label('Van'),

                Tables\Columns\TextColumn::make('dropoff_city')
                    ->label('Naar'),

                Tables\Columns\TextColumn::make('pickup_datetime')
                    ->label('Datum')
                    ->date('Y-m-d'),

                Tables\Columns\TextColumn::make('pickup_datetime')
                    ->label('Tijd')
                    ->time('H:i'),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'pending' => 'Gepland',
                        'assigned' => 'Toegewezen',
                        'accepted' => 'Geaccepteerd',
                        'in_progress' => 'Onderweg',
                        'completed' => 'Afgerond',
                        'cancelled' => 'Geannuleerd',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'assigned' => 'info',
                        'accepted' => 'primary',
                        'in_progress' => 'success',
                        'completed' => 'gray',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),
            ]);
    }
}