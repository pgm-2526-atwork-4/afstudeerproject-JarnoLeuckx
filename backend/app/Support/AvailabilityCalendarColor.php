<?php

namespace App\Support;

class AvailabilityCalendarColor
{
    public const AVAILABLE = 'available';
    public const BUSY = 'busy';
    public const LEAVE_APPROVED = 'leave_approved';
    public const LEAVE_PENDING = 'leave_pending';
    public const SICK = 'sick';

    public static function resolve(?string $type, ?string $status, ?string $approval): string
    {
        if ($status === 'busy') {
            return self::BUSY;
        }

        if ($type === 'leave') {
            if (in_array($approval, ['approved', 'not_required'], true)) {
                return self::LEAVE_APPROVED;
            }

            return self::LEAVE_PENDING;
        }

        if ($type === 'sick') {
            return self::SICK;
        }

        if ($type === 'available') {
            return self::AVAILABLE;
        }

        if ($status === 'unavailable') {
            return self::SICK;
        }

        return self::AVAILABLE;
    }
}
