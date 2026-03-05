<?php

namespace App\Filament\Resources\DriverAvailabilityResource\Pages;

use App\Filament\Resources\DriverAvailabilityResource;
use App\Models\DriverAvailability;
use Carbon\Carbon;
use Filament\Resources\Pages\Page;

class CalendarDriverAvailabilities extends Page
{
    protected static string $resource = DriverAvailabilityResource::class;

    protected static string $view = 'filament.resources.driver-availability-resource.pages.calendar-driver-availabilities';

    public string $month = '';

    public function mount(): void
    {
        $this->month = now()->startOfMonth()->toDateString();
    }

    public function previousMonth(): void
    {
        $this->month = Carbon::parse($this->month)->subMonth()->startOfMonth()->toDateString();
    }

    public function nextMonth(): void
    {
        $this->month = Carbon::parse($this->month)->addMonth()->startOfMonth()->toDateString();
    }

    public function getMonthLabelProperty(): string
    {
        return Carbon::parse($this->month)->translatedFormat('F Y');
    }

    public function getCalendarDaysProperty(): array
    {
        $start = Carbon::parse($this->month)->startOfMonth();
        $end = Carbon::parse($this->month)->endOfMonth();

        $records = DriverAvailability::query()
            ->with('driver:id,name,email')
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->orderBy('date')
            ->orderBy('start_time')
            ->get()
            ->groupBy(fn (DriverAvailability $item) => $item->date->toDateString());

        $days = [];
        $cursor = $start->copy();

        while ($cursor->lte($end)) {
            $dateKey = $cursor->toDateString();

            $days[] = [
                'date' => $dateKey,
                'label' => $cursor->format('d/m'),
                'weekday' => $cursor->translatedFormat('D'),
                'items' => ($records->get($dateKey) ?? collect())
                    ->map(function (DriverAvailability $item) {
                        return [
                            'name' => $item->driver?->name ?? $item->driver?->email ?? 'Onbekend',
                            'start' => substr((string) $item->start_time, 0, 5),
                            'end' => substr((string) $item->end_time, 0, 5),
                            'status' => $item->status,
                            'type' => $item->availability_type,
                            'approval' => $item->approval_status,
                        ];
                    })
                    ->values()
                    ->all(),
            ];

            $cursor->addDay();
        }

        return $days;
    }
}
