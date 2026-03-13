<?php

namespace App\Models;

use App\Mail\DriverApprovedMail;
use App\Notifications\ResetPasswordNotification;
use Filament\Panel;
use App\Notifications\VerifyEmailAddressNotification;
use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, MustVerifyEmailTrait, Notifiable;

    protected static function booted(): void
    {
        static::saved(function (self $user): void {
            if (! $user->isDriver()) {
                return;
            }

            if ($user->approval_status !== 'approved' || empty($user->email)) {
                return;
            }

            if (! $user->wasRecentlyCreated && ! $user->wasChanged('approval_status')) {
                return;
            }

            Mail::to($user->email)->send(new DriverApprovedMail(
                $user,
                $user->driverLoginUrl(),
            ));
        });
    }

   
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'vaph_number',
        'email_notifications_enabled',
        'pvb_contract_signed_at',
        'pvb_contract_signer_name',
        'pvb_contract_signature_method',
        'pvb_contract_signed_pricing_updated_at',
        'role',
        'approval_status',
    ];

   
    protected $hidden = [
        'password',
        'remember_token',
    ];

    
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'email_notifications_enabled' => 'boolean',
            'pvb_contract_signed_at' => 'datetime',
            'pvb_contract_signed_pricing_updated_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

  

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

 
   public function hasVerifiedEmail(): bool
   {
       if ($this->isAdmin()) {
           return true;
       }

       return parent::hasVerifiedEmail();
   }

      public function isDriver(): bool
    {
        return $this->role === 'driver';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    

    
    public function ridesAsCustomer()
    {
        return $this->hasMany(Ride::class, 'customer_id', 'id');
    }

   
    public function ridesAsDriver()
    {
        return $this->hasMany(Ride::class, 'driver_id', 'id');
    }

    public function availabilities()
    {
        return $this->hasMany(DriverAvailability::class, 'driver_id', 'id');
    }

    public function vehicles()
    {
        return $this->belongsToMany(
            Vehicle::class,
            'driver_vehicle_assignments',
            'driver_id',
            'vehicle_id'
        )
        ->withPivot(['starts_at', 'ends_at'])
        ->withTimestamps();
    }

    

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isAdmin();
    }

    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new VerifyEmailAddressNotification());
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    public function driverLoginUrl(): string
    {
        return rtrim((string) config('services.frontend.url', config('app.url')), '/') . '/login';
    }

    public function passwordResetUrl(string $token): string
    {
        $baseUrl = rtrim((string) config('services.frontend.url', config('app.url')), '/');

        return $baseUrl . '/reset-password?token=' . urlencode($token) . '&email=' . urlencode((string) $this->email);
    }
}