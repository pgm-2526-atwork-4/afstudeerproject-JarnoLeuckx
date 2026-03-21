<?php

namespace App\Models;

use App\Services\RideAssignmentService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Ride extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_ASSIGNED = 'assigned';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public const BLOCKING_STATUSES = [
        self::STATUS_ASSIGNED,
        self::STATUS_ACCEPTED,
        self::STATUS_IN_PROGRESS,
    ];

    protected static function booted(): void
    {
        static::saving(function (self $ride): void {
            if (! $ride->driver_id) {
                return;
            }

            if ($ride->isDirty('driver_id')) {
                $ride->status = in_array($ride->status, [self::STATUS_CANCELLED, self::STATUS_COMPLETED], true)
                    ? $ride->status
                    : self::STATUS_ASSIGNED;
            }

            app(RideAssignmentService::class)->ensureDriverCanTakeRide(
                (int) $ride->driver_id,
                $ride,
            );

            if (($ride->status ?? self::STATUS_PENDING) === self::STATUS_PENDING) {
                $ride->status = self::STATUS_ASSIGNED;
            }
        });

        static::saved(function (self $ride): void {
            app(RideAssignmentService::class)->syncBusySlots($ride->fresh());
        });

        static::deleted(function (self $ride): void {
            app(RideAssignmentService::class)->clearBusySlots($ride);
        });
    }

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

        public function review()
        {
            return $this->hasOne(Review::class);
        }

    public function getEffectiveEndAtAttribute(): Carbon
    {
        return ($this->return_datetime ?? $this->pickup_datetime)->copy();
    }

    public function scopeBlockingSchedule(Builder $query): Builder
    {
        return $query->whereIn('status', self::BLOCKING_STATUSES);
    }

    public function scopeOverlappingWindow(Builder $query, Carbon $start, Carbon $end): Builder
    {
        return $query
            ->where('pickup_datetime', '<=', $end->toDateTimeString())
            ->whereRaw(
                'COALESCE(return_datetime, pickup_datetime) >= ?',
                [$start->toDateTimeString()]
            );
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
            self::STATUS_PENDING => 'In behandeling',
            self::STATUS_ASSIGNED => 'Toegewezen',
            self::STATUS_ACCEPTED => 'Geaccepteerd',
            self::STATUS_IN_PROGRESS => 'Onderweg',
            self::STATUS_COMPLETED => 'Afgerond',
            self::STATUS_CANCELLED => 'Geannuleerd',
            default => $this->status,
        };
    }
}