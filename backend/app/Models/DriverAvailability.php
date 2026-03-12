<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class DriverAvailability extends Model
{
    public const STATUS_AVAILABLE = 'available';
    public const STATUS_UNAVAILABLE = 'unavailable';
    public const STATUS_BUSY = 'busy';

    public const TYPE_AVAILABLE = 'available';
    public const TYPE_SICK = 'sick';
    public const TYPE_LEAVE = 'leave';

    public const APPROVAL_NOT_REQUIRED = 'not_required';
    public const APPROVAL_PENDING = 'pending';
    public const APPROVAL_APPROVED = 'approved';
    public const APPROVAL_REJECTED = 'rejected';

    public const REQUESTED_BY_DRIVER = 'driver';
    public const REQUESTED_BY_ADMIN = 'admin';

    public const ALLOWED_STATUSES = [
        self::STATUS_AVAILABLE,
        self::STATUS_UNAVAILABLE,
        self::STATUS_BUSY,
    ];

    public const ALLOWED_TYPES = [
        self::TYPE_AVAILABLE,
        self::TYPE_SICK,
        self::TYPE_LEAVE,
    ];

    public const ALLOWED_APPROVAL_STATUSES = [
        self::APPROVAL_NOT_REQUIRED,
        self::APPROVAL_PENDING,
        self::APPROVAL_APPROVED,
        self::APPROVAL_REJECTED,
    ];

    protected static function booted(): void
    {
        static::saving(function (self $availability): void {
            if ($availability->ride_id && $availability->exists) {
                throw ValidationException::withMessages([
                    'status' => 'Bezettingsblokken die aan een rit gekoppeld zijn, worden automatisch beheerd door het systeem.',
                ]);
            }

            if ($availability->ride_id) {
                return;
            }

            if ($availability->status !== self::STATUS_AVAILABLE) {
                return;
            }

            $date = $availability->date instanceof Carbon
                ? $availability->date->toDateString()
                : (string) $availability->date;

            $startAt = Carbon::parse($date . ' ' . $availability->start_time);
            $endAt = Carbon::parse($date . ' ' . $availability->end_time);

            $hasBlockingRide = Ride::query()
                ->where('driver_id', $availability->driver_id)
                ->blockingSchedule()
                ->overlappingWindow($startAt, $endAt)
                ->exists();

            if ($hasBlockingRide) {
                throw ValidationException::withMessages([
                    'start_time' => 'Deze chauffeur heeft al een rit in dit tijdsblok en kan hier niet als beschikbaar worden gezet.',
                ]);
            }
        });
    }

    protected $fillable = [
        'driver_id',
        'ride_id',
        'date',
        'start_time',
        'end_time',
        'status',
        'availability_type',
        'approval_status',
        'requested_by_role',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id', 'id');
    }

    public function ride()
    {
        return $this->belongsTo(Ride::class, 'ride_id');
    }

    public function isLeaveRequest(): bool
    {
        return $this->availability_type === self::TYPE_LEAVE;
    }

    public function isApprovedForPlanning(): bool
    {
        return in_array($this->approval_status, [self::APPROVAL_NOT_REQUIRED, self::APPROVAL_APPROVED], true);
    }
}