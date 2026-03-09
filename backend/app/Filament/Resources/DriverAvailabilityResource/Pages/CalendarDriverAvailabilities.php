<?php

namespace App\Filament\Resources\DriverAvailabilityResource\Pages;

use App\Filament\Resources\DriverAvailabilityResource;
use App\Models\DriverAvailability;
use App\Models\User;
use App\Support\AvailabilityCalendarColor;
use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Resources\Pages\Page;

class CalendarDriverAvailabilities extends Page
{
    protected static string $resource = DriverAvailabilityResource::class;

    protected static string $view = 'filament.resources.driver-availability-resource.pages.calendar-driver-availabilities';

    public string $month = '';
    public ?int $driverId = null;

    public function mount(): void
    {
        $this->month = now()->startOfMonth()->toDateString();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('list')
                ->label('Lijstweergave')
                ->icon('heroicon-o-table-cells')
                ->color('gray')
                ->url(DriverAvailabilityResource::getUrl('list')),
            Action::make('create')
                ->label('Beschikbaarheid toevoegen')
                ->icon('heroicon-o-plus')
                ->url(DriverAvailabilityResource::getUrl('create')),
        ];
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
        return Carbon::parse($this->month)
            ->locale('nl_BE')
            ->translatedFormat('F Y');
    }

    public function getWeekdayLabelsProperty(): array
    {
        return ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
    }

    
    public function getCalendarWeeksProperty(): array
    {
        $monthStart = Carbon::parse($this->month)->startOfMonth();
        $monthEnd = Carbon::parse($this->month)->endOfMonth();

        $start = $monthStart->copy()->startOfWeek(Carbon::MONDAY);
        $end = $monthEnd->copy()->endOfWeek(Carbon::SUNDAY);

        $records = DriverAvailability::query()
            ->with('driver:id,name,email')
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->when($this->driverId, fn ($query) => $query->where('driver_id', $this->driverId))
            ->orderBy('date')
            ->orderBy('start_time')
            ->get()
            ->groupBy(fn (DriverAvailability $item) => $item->date->toDateString());

        $days = [];
        $cursor = $start->copy();

        while ($cursor->lte($end)) {
            $dateKey = $cursor->toDateString();
            $items = ($records->get($dateKey) ?? collect())
                ->map(function (DriverAvailability $item) {
                    return [
                        'id' => $item->id,
                        'edit_url' => DriverAvailabilityResource::getUrl('edit', ['record' => $item->id]),
                        'name' => $item->driver?->name ?? $item->driver?->email ?? 'Onbekend',
                        'start' => substr((string) $item->start_time, 0, 5),
                        'end' => substr((string) $item->end_time, 0, 5),
                        'status' => $item->status,
                        'type' => $item->availability_type,
                        'approval' => $item->approval_status,
                        'color_key' => AvailabilityCalendarColor::resolve(
                            $item->availability_type,
                            $item->status,
                            $item->approval_status,
                        ),
                    ];
                })
                ->values()
                ->all();

            $dayColorKey = collect($items)
                ->sortByDesc(fn (array $item) => $this->colorPriority((string) ($item['color_key'] ?? 'available')))
                ->pluck('color_key')
                ->first();

            $days[] = [
                'date' => $dateKey,
                'day' => (int) $cursor->format('d'),
                'is_in_month' => $cursor->month === $monthStart->month,
                'is_today' => $cursor->isToday(),
                'color_key' => $dayColorKey,
                'items' => $items,
            ];

            $cursor->addDay();
        }

        return array_chunk($days, 7);
    }

    public function getDriverOptionsProperty(): array
    {
        return User::query()
            ->where('role', 'driver')
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->mapWithKeys(fn (User $driver) => [
                $driver->id => trim(($driver->name ?? '') . ' (' . $driver->email . ')'),
            ])
            ->all();
    }

    private function colorPriority(string $colorKey): int
    {
        return match ($colorKey) {
            AvailabilityCalendarColor::SICK => 4,
            AvailabilityCalendarColor::LEAVE_PENDING => 3,
            AvailabilityCalendarColor::LEAVE_APPROVED => 2,
            AvailabilityCalendarColor::AVAILABLE => 1,
            default => 0,
        };
    }
}
