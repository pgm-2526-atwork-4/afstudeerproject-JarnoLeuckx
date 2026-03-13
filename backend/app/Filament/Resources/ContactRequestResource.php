<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactRequestResource\Pages\ListContactRequests;
use App\Mail\QuoteResponseMail;
use App\Models\ContactRequest;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;

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

    protected static function quoteFields(): array
    {
        return [
            TextInput::make('estimated_km')
                ->label('Volle kilometers')
                ->numeric()
                ->minValue(0.1)
                ->step(0.1)
                ->required()
                ->default(fn (ContactRequest $record) => $record->estimated_km)
                ->suffix('km')
                ->helperText('Volle kilometers worden automatisch aangerekend aan € 2,50 per km.'),
            TextInput::make('empty_km')
                ->label('Lege kilometers')
                ->numeric()
                ->minValue(0)
                ->step(0.1)
                ->required()
                ->default(fn (ContactRequest $record) => $record->empty_km ?? 0)
                ->suffix('km')
                ->helperText('Lege kilometers worden automatisch aangerekend aan € 0,50 per km.'),
            Textarea::make('quote_notes')
                ->label('Opmerkingen voor de klant (optioneel)')
                ->rows(3)
                ->maxLength(1000)
                ->default(fn (ContactRequest $record) => $record->quote_notes),
        ];
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
                    ->formatStateUsing(fn (?string $state): string => $state ? ucfirst($state) : '-')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Offertebedrag')
                    ->formatStateUsing(fn (?string $state): string => $state ? '€ ' . number_format((float) $state, 2, ',', '.') : '-')
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
                        'nieuw'              => 'warning',
                        'in_behandeling'     => 'info',
                        'offerte_verstuurd'  => 'primary',
                        'ondertekend'        => 'success',
                        'afgewerkt'          => 'success',
                        default              => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'nieuw'             => 'Nieuw',
                        'in_behandeling'    => 'In behandeling',
                        'offerte_verstuurd' => 'Offerte verstuurd',
                        'ondertekend'       => 'Ondertekend',
                        'afgewerkt'         => 'Afgewerkt',
                        default             => ucfirst(str_replace('_', ' ', $state)),
                    }),
                Tables\Columns\TextColumn::make('quote_signed_at')
                    ->label('Ondertekend op')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(),
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
                        'nieuw'             => 'Nieuw',
                        'in_behandeling'    => 'In behandeling',
                        'offerte_verstuurd' => 'Offerte verstuurd',
                        'ondertekend'       => 'Ondertekend',
                        'afgewerkt'         => 'Afgewerkt',
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

                Tables\Actions\Action::make('voorbereid_offerte')
                    ->label('Offerte voorbereiden')
                    ->icon('heroicon-o-pencil-square')
                    ->color('warning')
                    ->visible(fn (ContactRequest $record): bool =>
                        $record->request_type === 'offerte' &&
                        ! in_array($record->status, ['offerte_verstuurd', 'ondertekend', 'afgewerkt'])
                    )
                    ->form(static::quoteFields())
                    ->modalHeading('Offerte voorbereiden')
                    ->modalDescription('Sla eerst de prijsgegevens op zodat je de PDF-preview kan controleren voor het versturen.')
                    ->action(function (ContactRequest $record, array $data): void {
                        $pricePerKm = 2.50;
                        $estimatedKm = (float) $data['estimated_km'];
                        $emptyKm = (float) ($data['empty_km'] ?? 0);
                        $totalPrice = round(($pricePerKm * $estimatedKm) + ($emptyKm * 0.50), 2);

                        $record->update([
                            'price_per_km' => $pricePerKm,
                            'estimated_km' => $estimatedKm,
                            'empty_km' => $emptyKm,
                            'total_price' => $totalPrice,
                            'quote_notes' => $data['quote_notes'] ?? null,
                            'status' => $record->status === 'nieuw' ? 'in_behandeling' : $record->status,
                        ]);

                        Notification::make()
                            ->title('Offerte opgeslagen als concept')
                            ->body('De offertegegevens zijn opgeslagen. Je kan nu eerst de PDF-preview bekijken.')
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('preview_pdf')
                    ->label('PDF preview')
                    ->icon('heroicon-o-document-text')
                    ->color('gray')
                    ->visible(fn (ContactRequest $record): bool => $record->request_type === 'offerte' && $record->total_price !== null)
                    ->modalHeading('Offertepreview')
                    ->modalWidth('5xl')
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel('Sluiten')
                    ->modalContent(fn (ContactRequest $record) => view('filament.resources.contact-request-resource.preview-quote', [
                        'record' => $record,
                    ])),

                Tables\Actions\Action::make('verstuur_offerte')
                    ->label('Offerte versturen')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('success')
                    ->visible(fn (ContactRequest $record): bool =>
                        $record->request_type === 'offerte' &&
                        ! in_array($record->status, ['offerte_verstuurd', 'ondertekend', 'afgewerkt'])
                    )
                    ->form(static::quoteFields())
                    ->modalHeading('Offerte opmaken & versturen')
                    ->modalDescription('Vul de volle en lege kilometers in. Het systeem rekent automatisch met € 2,50 voor volle kilometers en € 0,50 voor lege kilometers.')
                    ->action(function (ContactRequest $record, array $data): void {
                        $pricePerKm  = 2.50;
                        $estimatedKm = (float) $data['estimated_km'];
                        $emptyKm = (float) ($data['empty_km'] ?? 0);
                        $totalPrice  = round(($pricePerKm * $estimatedKm) + ($emptyKm * 0.5), 2);

                        $record->update([
                            'price_per_km'  => $pricePerKm,
                            'estimated_km'  => $estimatedKm,
                            'empty_km'      => $emptyKm,
                            'total_price'   => $totalPrice,
                            'quote_notes'   => $data['quote_notes'] ?? null,
                            'quote_sent_at' => now(),
                            'status'        => 'offerte_verstuurd',
                        ]);

                        Mail::to($record->email, $record->name)
                            ->send(new QuoteResponseMail($record->fresh()));

                        Notification::make()
                            ->title('Offerte verstuurd')
                            ->body("Offerte voor {$record->name} (€ " . number_format($totalPrice, 2, ',', '.') . ") werd succesvol per e-mail verzonden.")
                            ->success()
                            ->send();
                    }),

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
                    ->visible(fn (ContactRequest $record): bool => ! in_array($record->status, ['afgewerkt']))
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
