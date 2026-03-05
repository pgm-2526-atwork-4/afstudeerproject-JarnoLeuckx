<?php

namespace App\Models;

use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

   
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
}