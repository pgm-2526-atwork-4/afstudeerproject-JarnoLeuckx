<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')
                ->label('Naam')
                ->required()
                ->maxLength(255),

            Forms\Components\TextInput::make('email')
                ->label('E-mail')
                ->email()
                ->required()
                ->unique(ignoreRecord: true)
                ->maxLength(255),

            Forms\Components\TextInput::make('phone')
                ->label('Telefoon')
                ->tel()
                ->maxLength(255),

            Forms\Components\TextInput::make('address')
                ->label('Adres')
                ->required(fn (Forms\Get $get): bool => $get('role') === 'customer')
                ->maxLength(255),

            Forms\Components\TextInput::make('vaph_number')
                ->label('VAPH-nummer')
                ->maxLength(255),

            Forms\Components\Select::make('role')
                ->label('Rol')
                ->options([
                    'driver' => 'Chauffeur',
                    'customer' => 'Klant',
                    'admin' => 'Admin',
                ])
                ->default('customer')
                ->required(),

            Forms\Components\Select::make('approval_status')
                ->label('Goedkeuringsstatus')
                ->options([
                    'pending' => 'In afwachting',
                    'approved' => 'Goedgekeurd',
                    'rejected' => 'Afgekeurd',
                ])
                ->default('approved')
                ->required(),

            Forms\Components\TextInput::make('password')
                ->label('Wachtwoord')
                ->password()
                ->revealable()
                ->minLength(8)
                ->required(fn (string $operation): bool => $operation === 'create')
                ->dehydrated(fn (?string $state): bool => filled($state)),
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
                Tables\Columns\TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('phone')
                    ->label('Telefoon')
                    ->searchable(),
                Tables\Columns\TextColumn::make('address')
                    ->label('Adres')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('vaph_number')
                    ->label('VAPH-nummer')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('role')
                    ->label('Rol')
                    ->badge(),
                Tables\Columns\TextColumn::make('approval_status')
                    ->label('Goedkeuring')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'approved' => 'success',
                        'rejected' => 'danger',
                        default => 'warning',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Aangemaakt')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('role')
                    ->options([
                        'driver' => 'Chauffeur',
                        'customer' => 'Klant',
                        'admin' => 'Admin',
                    ]),
                Tables\Filters\SelectFilter::make('approval_status')
                    ->options([
                        'pending' => 'In afwachting',
                        'approved' => 'Goedgekeurd',
                        'rejected' => 'Afgekeurd',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('approve')
                    ->label('Goedkeuren')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn (User $record): bool => $record->role === 'driver' && $record->approval_status !== 'approved')
                    ->action(fn (User $record) => $record->update(['approval_status' => 'approved'])),
                Tables\Actions\Action::make('reject')
                    ->label('Afkeuren')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->visible(fn (User $record): bool => $record->role === 'driver' && $record->approval_status !== 'rejected')
                    ->action(fn (User $record) => $record->update(['approval_status' => 'rejected'])),
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}