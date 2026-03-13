<?php

use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\QuotePdfController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
    ->middleware('signed')
    ->name('verification.verify');

// Filament PDF preview/download (protected by Filament auth middleware)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/filament/quote/{quote}/preview', [QuotePdfController::class, 'preview'])
        ->name('filament.quote.pdf.preview');
    Route::get('/filament/quote/{quote}/download', [QuotePdfController::class, 'download'])
        ->name('filament.quote.pdf.download');
});
