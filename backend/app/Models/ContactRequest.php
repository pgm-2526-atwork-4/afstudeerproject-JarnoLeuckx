<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactRequest extends Model
{
    protected $fillable = [
        'user_id',
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
        'price_per_km',
        'estimated_km',
        'empty_km',
        'total_price',
        'quote_notes',
        'quote_sent_at',
        'quote_signed_at',
        'quote_signer_name',
        'quote_signature_method',
        'quote_signature_image',
        'hulpbehoeften',
    ];

    protected $casts = [
        'travel_date' => 'date',
        'return_trip' => 'boolean',
        'passengers' => 'integer',
        'price_per_km' => 'decimal:2',
        'estimated_km' => 'decimal:2',
        'empty_km' => 'decimal:2',
        'total_price' => 'decimal:2',
        'quote_sent_at' => 'datetime',
        'quote_signed_at' => 'datetime',
        'hulpbehoeften' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}