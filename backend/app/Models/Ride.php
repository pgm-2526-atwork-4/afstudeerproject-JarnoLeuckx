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
        'notes',
        'distance_km',
        'total_price',
        'status',
    ];

    protected $casts = [
        'pickup_datetime' => 'datetime',
        'distance_km' => 'integer',
        'total_price' => 'decimal:2',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id', 'id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id', 'id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'id');
    }
}