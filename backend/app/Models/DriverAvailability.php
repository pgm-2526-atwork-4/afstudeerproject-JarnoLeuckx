<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverAvailability extends Model
{
    public const STATUS_AVAILABLE = 'available';
    public const STATUS_UNAVAILABLE = 'unavailable';

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

    protected $fillable = [
        'driver_id',
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

    public function isLeaveRequest(): bool
    {
        return $this->availability_type === self::TYPE_LEAVE;
    }

    public function isApprovedForPlanning(): bool
    {
        return in_array($this->approval_status, [self::APPROVAL_NOT_REQUIRED, self::APPROVAL_APPROVED], true);
    }
}