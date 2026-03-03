<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverVehicleAssignment extends Model
{
    protected $fillable = [
        'driver_id',
        'vehicle_id',
        'starts_at',
        'ends_at',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id', 'id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'id');
    }
}