<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactRequest extends Model
{
    protected $fillable = [
        'request_type',
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'service_type',
        'pickup_address',
        'dropoff_address',
        'travel_date',
        'return_trip',
        'passengers',
        'status',
    ];

    protected $casts = [
        'travel_date' => 'date',
        'return_trip' => 'boolean',
        'passengers' => 'integer',
    ];
}
