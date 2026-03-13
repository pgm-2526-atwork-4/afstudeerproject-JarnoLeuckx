<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactRequestResource\Pages\ListContactRequests;
use App\Models\ContactRequest;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ContactRequestResource extends Resource
{
    protected static ?string $model = ContactRequest::class;

    protected static ?string $navigationIcon = 'heroicon-o-inbox-stack';
    protected static ?string $navigationLabel = 'Contact & offertes';
    protected static ?string $pluralLabel = 'Contact & offertes';
    protected static ?string $label = 'Aanvraag';
    protected static ?string $navigationGroup = 'Communicatie';

    public static function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('request_type')
                    ->label('Type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => $state === 'offerte' ? 'Offerte' : 'Contact')
                    ->color(fn (string $state): string => $state === 'offerte' ? 'info' : 'gray')
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Naam')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('service_type')
                    ->label('Dienst')
                    ->formatStateUsing(fn (?string $state): string => $state ?: '-')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('travel_date')
                    ->label('Reisdatum')
                    ->date('d/m/Y')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->sortable()
                    ->color(fn (string $state): string => match ($state) {
                        'nieuw' => 'warning',
                        'in_behandeling' => 'info',
                        'afgewerkt' => 'success',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ontvangen')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('request_type')
                    ->label('Type')
                    ->options([
                        'contact' => 'Contact',
                        'offerte' => 'Offerte',
                    ]),
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'nieuw' => 'Nieuw',
                        'in_behandeling' => 'In behandeling',
                        'afgewerkt' => 'Afgewerkt',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('bekijk')
                    ->label('Bekijk')
                    ->icon('heroicon-o-eye')
                    ->color('primary')
                    ->modalHeading('Aanvraagdetails')
                    ->modalWidth('4xl')
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel('Sluiten')
                    ->modalContent(fn (ContactRequest $record) => view('filament.resources.contact-request-resource.view-request', [
                        'record' => $record,
                    ])),
                Tables\Actions\Action::make('mark_processing')
                    ->label('In behandeling')
                    ->icon('heroicon-o-arrow-path')
                    ->color('info')
                    ->requiresConfirmation()
                    ->visible(fn (ContactRequest $record): bool => $record->status === 'nieuw')
                    ->action(fn (ContactRequest $record) => $record->update(['status' => 'in_behandeling'])),
                Tables\Actions\Action::make('mark_done')
                    ->label('Afgewerkt')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (ContactRequest $record): bool => $record->status !== 'afgewerkt')
                    ->action(fn (ContactRequest $record) => $record->update(['status' => 'afgewerkt'])),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListContactRequests::route('/'),
        ];
    }
}
