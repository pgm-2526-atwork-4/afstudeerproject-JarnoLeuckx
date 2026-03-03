<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DriverAvailabilityResource\Pages;
use App\Models\DriverAvailability;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class DriverAvailabilityResource extends Resource
{
    protected static ?string $model = DriverAvailability::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';
    protected static ?string $navigationLabel = 'Beschikbaarheden';
    protected static ?string $pluralModelLabel = 'Beschikbaarheden';
    protected static ?string $modelLabel = 'Beschikbaarheid';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Beschikbaarheid')
                ->schema([
                    Forms\Components\Select::make('driver_id')
                        ->label('Chauffeur')
                        ->relationship(
                            name: 'driver',
                            titleAttribute: 'email',
                            modifyQueryUsing: fn (Builder $query) => $query->where('role', 'driver')
                        )
                        ->searchable()
                        ->preload()
                        ->required(),

                    Forms\Components\DatePicker::make('date')
                        ->label('Datum')
                        ->required(),

                    Forms\Components\TimePicker::make('start_time')
                        ->label('Van')
                        ->seconds(false)
                        ->required(),

                    Forms\Components\TimePicker::make('end_time')
                        ->label('Tot')
                        ->seconds(false)
                        ->required(),

                    Forms\Components\Select::make('status')
                        ->label('Status')
                        ->options([
                            'available' => 'Beschikbaar',
                            'unavailable' => 'Niet beschikbaar',
                        ])
                        ->default('available')
                        ->required(),
                ])
                ->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('driver.email')
                    ->label('Chauffeur')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('date')
                    ->label('Datum')
                    ->date('d/m/Y')
                    ->sortable(),

                Tables\Columns\TextColumn::make('start_time')
                    ->label('Van')
                    ->time('H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('end_time')
                    ->label('Tot')
                    ->time('H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'available' => 'Beschikbaar',
                        'unavailable' => 'Niet beschikbaar',
                        default => $state,
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Aangemaakt')
                    ->dateTime('d/m/Y H:i')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('driver_id')
                    ->label('Chauffeur')
                    ->relationship(
                        name: 'driver',
                        titleAttribute: 'email',
                        modifyQueryUsing: fn (Builder $query) => $query->where('role', 'driver')
                    ),

                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'available' => 'Beschikbaar',
                        'unavailable' => 'Niet beschikbaar',
                    ]),

                Tables\Filters\Filter::make('date')
                    ->form([
                        Forms\Components\DatePicker::make('from')->label('Van'),
                        Forms\Components\DatePicker::make('until')->label('Tot'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when($data['from'] ?? null, fn (Builder $q, $date) => $q->whereDate('date', '>=', $date))
                            ->when($data['until'] ?? null, fn (Builder $q, $date) => $q->whereDate('date', '<=', $date));
                    }),
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
            'index' => Pages\ListDriverAvailabilities::route('/'),
            'create' => Pages\CreateDriverAvailability::route('/create'),
            'edit' => Pages\EditDriverAvailability::route('/{record}/edit'),
        ];
    }
}