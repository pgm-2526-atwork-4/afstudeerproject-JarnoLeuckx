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
                        ->label('Medewerker (chauffeur/admin)')
                        ->relationship(
                            name: 'driver',
                            titleAttribute: 'email',
                            modifyQueryUsing: fn (Builder $query) => $query->whereIn('role', ['driver', 'admin'])
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

                    Forms\Components\Select::make('availability_type')
                        ->label('Type')
                        ->options([
                            'available' => 'Beschikbaar',
                            'sick' => 'Ziekte',
                            'leave' => 'Verlof',
                        ])
                        ->default('available')
                        ->required(),

                    Forms\Components\Select::make('approval_status')
                        ->label('Goedkeuringsstatus')
                        ->options([
                            'not_required' => 'Niet nodig',
                            'pending' => 'In afwachting',
                            'approved' => 'Goedgekeurd',
                            'rejected' => 'Afgekeurd',
                        ])
                        ->default('not_required')
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
                    ->label('Medewerker')
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

                Tables\Columns\TextColumn::make('availability_type')
                    ->label('Type')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'available' => 'Beschikbaar',
                        'sick' => 'Ziekte',
                        'leave' => 'Verlof',
                        default => $state,
                    })
                    ->color(fn (string $state) => match ($state) {
                        'available' => 'success',
                        'sick' => 'danger',
                        'leave' => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('approval_status')
                    ->label('Goedkeuring')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'not_required' => 'Niet nodig',
                        'pending' => 'In afwachting',
                        'approved' => 'Goedgekeurd',
                        'rejected' => 'Afgekeurd',
                        default => $state,
                    })
                    ->color(fn (string $state, DriverAvailability $record) => match (true) {
                        $state === 'approved' && $record->availability_type === 'leave' => 'warning',
                        $state === 'approved' => 'success',
                        'pending' => 'warning',
                        'rejected' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Aangemaakt')
                    ->dateTime('d/m/Y H:i')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('driver_id')
                    ->label('Medewerker')
                    ->relationship(
                        name: 'driver',
                        titleAttribute: 'email',
                        modifyQueryUsing: fn (Builder $query) => $query->whereIn('role', ['driver', 'admin'])
                    ),

                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'available' => 'Beschikbaar',
                        'unavailable' => 'Niet beschikbaar',
                    ]),

                Tables\Filters\SelectFilter::make('availability_type')
                    ->label('Type')
                    ->options([
                        'available' => 'Beschikbaar',
                        'sick' => 'Ziekte',
                        'leave' => 'Verlof',
                    ]),

                Tables\Filters\SelectFilter::make('approval_status')
                    ->label('Goedkeuring')
                    ->options([
                        'not_required' => 'Niet nodig',
                        'pending' => 'In afwachting',
                        'approved' => 'Goedgekeurd',
                        'rejected' => 'Afgekeurd',
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
                Tables\Actions\Action::make('approve_leave')
                    ->label('Verlof goedkeuren')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (DriverAvailability $record) => $record->availability_type === 'leave' && $record->approval_status === 'pending')
                    ->action(function (DriverAvailability $record): void {
                        $record->update([
                            'approval_status' => 'approved',
                            'status' => 'unavailable',
                        ]);
                    }),
                Tables\Actions\Action::make('reject_leave')
                    ->label('Verlof afkeuren')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (DriverAvailability $record) => $record->availability_type === 'leave' && $record->approval_status === 'pending')
                    ->action(function (DriverAvailability $record): void {
                        $record->update([
                            'approval_status' => 'rejected',
                            'status' => 'available',
                            'availability_type' => 'available',
                        ]);
                    }),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\CalendarDriverAvailabilities::route('/'),
            'list' => Pages\ListDriverAvailabilities::route('/list'),
            'create' => Pages\CreateDriverAvailability::route('/create'),
            'edit' => Pages\EditDriverAvailability::route('/{record}/edit'),
        ];
    }
}