<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingSetting extends Model
{
    protected $fillable = [
        'base_fee',
        'price_per_km',
    ];
}