<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ride extends Model
{
    protected $fillable = [
        'customer_id',
        'driver_id',
        'vehicle_id',
        'service_type',
        'pickup_street',
        'pickup_number',
        'pickup_postcode',
        'pickup_city',
        'dropoff_street',
        'dropoff_number',
        'dropoff_postcode',
        'dropoff_city',
        'pickup_datetime',
        'return_datetime',
        'notes',
        'distance_km',
        'total_price',
        'status',
    ];

    protected $casts = [
        'pickup_datetime' => 'datetime',
        'return_datetime' => 'datetime',
        'distance_km' => 'integer',
        'total_price' => 'decimal:2',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    public function getPickupAddressAttribute(): string
    {
        return "{$this->pickup_street} {$this->pickup_number}, {$this->pickup_postcode} {$this->pickup_city}";
    }

    public function getDropoffAddressAttribute(): string
    {
        return "{$this->dropoff_street} {$this->dropoff_number}, {$this->dropoff_postcode} {$this->dropoff_city}";
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'In behandeling',
            'approved' => 'Goedgekeurd',
            'rejected' => 'Geweigerd',
            'completed' => 'Afgerond',
            default => $this->status,
        };
    }
}