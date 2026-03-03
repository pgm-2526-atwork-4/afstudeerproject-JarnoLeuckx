<?php
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DriverAvailabilityController;
use App\Http\Controllers\Api\DriverRideController;
use App\Http\Controllers\Api\CustomerRideController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register/driver', [AuthController::class, 'registerDriver']);


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

});
Route::middleware(['auth:sanctum', 'role:driver'])
    ->prefix('driver')
    ->group(function () {
        Route::get('/availabilities', [DriverAvailabilityController::class, 'index']);
        Route::post('/availabilities', [DriverAvailabilityController::class, 'store']);
        Route::delete('/availabilities/{availability}', [DriverAvailabilityController::class, 'destroy']);

        Route::get('/rides', [DriverRideController::class, 'index']);
        Route::patch('/rides/{ride}/accept', [DriverRideController::class, 'accept']);
        Route::patch('/rides/{ride}/reject', [DriverRideController::class, 'reject']);
        Route::get('/schedule', [DriverRideController::class, 'schedule']); 
    });

Route::middleware(['auth:sanctum', 'role:customer'])
    ->prefix('customer')
    ->group(function () {
        Route::get('/rides', [CustomerRideController::class, 'index']);
        Route::post('/rides', [CustomerRideController::class, 'store']);
    });