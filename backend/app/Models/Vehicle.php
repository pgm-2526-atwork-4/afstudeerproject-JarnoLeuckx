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
    public function rides()
    {
        return $this->hasMany(Ride::class, 'vehicle_id', 'id');
    }
}