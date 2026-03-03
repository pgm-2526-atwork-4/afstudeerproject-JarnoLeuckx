<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'name',
        'license_plate',
        'seats',
        'wheelchair_accessible',
        'active',
    ];

    // Vehicle <-> Drivers (pivot: driver_vehicle_assignments)
    public function drivers()
    {
        return $this->belongsToMany(
            User::class,
            'driver_vehicle_assignments',
            'vehicle_id',
            'driver_id'
        )->withPivot(['starts_at', 'ends_at'])
         ->withTimestamps();
    }

    // Vehicle -> Rides
    public function rides()
    {
        return $this->hasMany(Ride::class, 'vehicle_id', 'id');
    }
}