<?php
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DriverAvailabilityController;
use App\Http\Controllers\Api\DriverRideController;
use App\Http\Controllers\Api\CustomerRideController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\CustomerContractController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register/driver', [AuthController::class, 'registerDriver']);
Route::post('/email-exists', [AuthController::class, 'emailExists']);


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::delete('/me', [AuthController::class, 'deleteAccount']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);

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
        Route::get('/available-drivers', [CustomerRideController::class, 'availableDrivers']);
        Route::post('/contract/sign', [CustomerContractController::class, 'sign']);
    });