<?php

namespace App\Filament\Resources;


use App\Filament\Resources\RideResource\Pages\CreateRide;
use App\Filament\Resources\RideResource\Pages\EditRide;
use App\Filament\Resources\RideResource\Pages\ListRides;
use App\Models\Ride;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class RideResource extends Resource
{
    protected static ?string $model = Ride::class;
    protected static ?string $navigationIcon = 'heroicon-o-truck';
    protected static ?string $navigationLabel = 'Ritten';
    protected static ?string $pluralLabel = 'Ritten';
    protected static ?string $label = 'Rit';

    public static function form(Form $form): Form
    {
        return $form->schema([
            
            Forms\Components\Section::make('Rit')
                ->schema([
                    Forms\Components\Select::make('customer_id')
                        ->label('Klant')
                        ->relationship('customer', 'name')
                        ->searchable()
                        ->preload()
                        ->required(),
                    Forms\Components\Select::make('driver_id')
                        ->label('Chauffeur')
                        ->relationship(
                            'driver',
                            'name',
                            modifyQueryUsing: fn (Builder $query) => $query
                                ->where('role', 'driver')
                                ->where('approval_status', 'approved')
                        )
                        ->searchable()
                        ->preload()
                        ->nullable(),
                    Forms\Components\Placeholder::make('customer_email')
                        ->label('E-mail klant')
                        ->content(function (Forms\Get $get): string {
                            $customerId = $get('customer_id');

                            if (! $customerId) {
                                return '-';
                            }

                            return User::query()->whereKey($customerId)->value('email') ?? '-';
                        }),
                    Forms\Components\Placeholder::make('driver_email')
                        ->label('E-mail chauffeur')
                        ->content(function (Forms\Get $get): string {
                            $driverId = $get('driver_id');

                            if (! $driverId) {
                                return '-';
                            }

                            return User::query()->whereKey($driverId)->value('email') ?? '-';
                        }),
                    Forms\Components\Select::make('vehicle_id')
                        ->label('Voertuig')
                        ->relationship('vehicle', 'license_plate')
                        ->searchable()
                        ->preload()
                        ->nullable(),
                    Forms\Components\Select::make('status')
                        ->label('Status')
                        ->options([
                            'pending' => 'In behandeling',
                            'assigned' => 'Toegewezen',
                            'accepted' => 'Geaccepteerd',
                            'in_progress' => 'Onderweg',
                            'completed' => 'Afgerond',
                            'cancelled' => 'Geannuleerd',
                        ])
                        ->disableOptionWhen(fn (string $value): bool => $value === 'accepted')
                        ->helperText('Een rit kan pas geaccepteerd worden nadat de toegewezen chauffeur deze zelf bevestigt.')
                        ->default('pending')
                        ->required(),
                    Forms\Components\Select::make('service_type')
                        ->label('Dienst')
                        ->options([
                            'airport' => 'Luchthaven vervoer',
                            'wheelchair' => 'Rolstoel vervoer',
                            'medical' => 'Medische rit',
                            'assistance' => 'Assistentie',
                        ])
                        ->required(),
                    Forms\Components\DateTimePicker::make('pickup_datetime')
                        ->label('Ophaal datum & tijd')
                        ->seconds(false)
                        ->required(),
                ])
                ->columns(2),
            Forms\Components\Section::make('Ophaaladres')
                ->schema([
                    Forms\Components\TextInput::make('pickup_street')->label('Straat')->required(),
                    Forms\Components\TextInput::make('pickup_number')->label('Nr')->nullable(),
                    Forms\Components\TextInput::make('pickup_postcode')->label('Postcode')->required(),
                    Forms\Components\TextInput::make('pickup_city')->label('Stad')->required(),
                ])
                ->columns(4),
            Forms\Components\Section::make('Afzetadres')
                ->schema([
                    Forms\Components\TextInput::make('dropoff_street')->label('Straat')->required(),
                    Forms\Components\TextInput::make('dropoff_number')->label('Nr')->nullable(),
                    Forms\Components\TextInput::make('dropoff_postcode')->label('Postcode')->required(),
                    Forms\Components\TextInput::make('dropoff_city')->label('Stad')->required(),
                ])
                ->columns(4),
            Forms\Components\Section::make('Prijs & extra')
                ->schema([
                    Forms\Components\TextInput::make('distance_km')->label('Afstand (km)')->numeric()->nullable(),
                    Forms\Components\TextInput::make('total_price')->label('Totaal (€)')->numeric()->nullable(),
                    Forms\Components\Textarea::make('notes')->label('Opmerkingen')->rows(4)->nullable(),
                ])
                ->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->label('#')->sortable(),
                Tables\Columns\TextColumn::make('service_type')->label('Dienst')->badge()->sortable(),
                Tables\Columns\TextColumn::make('customer.name')->label('Klant')->searchable()->sortable()->wrap(),
                Tables\Columns\TextColumn::make('driver.name')->label('Chauffeur')->wrap()->toggleable(),
                Tables\Columns\TextColumn::make('route')
                    ->label('Traject')
                    ->state(fn (Ride $record): string => "{$record->pickup_city} → {$record->dropoff_city}")
                    ->wrap(),
                Tables\Columns\TextColumn::make('pickup_datetime')->label('Datum')->dateTime('d/m/Y H:i')->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($record) => match ($record->status) {
                        'pending' => 'warning',
                        'assigned' => 'info',
                        'accepted' => 'primary',
                        'in_progress' => 'success',
                        'completed' => 'gray',
                        'cancelled' => 'danger',
                        default => 'secondary',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_price')->label('Prijs')->money('EUR')->toggleable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->options([
                    'pending' => 'In behandeling',
                    'assigned' => 'Toegewezen',
                    'accepted' => 'Geaccepteerd',
                    'in_progress' => 'Onderweg',
                    'completed' => 'Afgerond',
                    'cancelled' => 'Geannuleerd',
                ]),
                Tables\Filters\SelectFilter::make('driver_id')
                    ->label('Chauffeur')
                    ->relationship('driver', 'email'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('approve')
                    ->label('Goedkeuren')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['status' => 'assigned']))
                    ->visible(fn ($record) => $record->status === 'pending' && filled($record->driver_id)),
                Tables\Actions\Action::make('reject')
                    ->label('Afkeuren')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['status' => 'cancelled']))
                    ->visible(fn ($record) => $record->status !== 'cancelled' && $record->status !== 'completed'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRides::route('/'),
            'create' => CreateRide::route('/create'),
            'edit' => EditRide::route('/{record}/edit'),
        ];
    }
}