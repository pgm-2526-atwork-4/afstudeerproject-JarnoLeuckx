<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverAvailability extends Model
{
    protected $fillable = [
        'driver_id',
        'date',
        'start_time',
        'end_time',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id', 'id');
    }
}