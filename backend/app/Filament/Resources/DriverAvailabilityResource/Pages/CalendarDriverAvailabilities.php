<?php

namespace App\Filament\Resources\DriverAvailabilityResource\Pages;

use App\Filament\Resources\DriverAvailabilityResource;
use App\Models\DriverAvailability;
use App\Models\User;
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
        return Carbon::parse($this->month)->translatedFormat('F Y');
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
            ->whereBetween('date', [$monthStart->toDateString(), $monthEnd->toDateString()])
            ->when($this->driverId, fn ($query) => $query->where('driver_id', $this->driverId))
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
                'day' => (int) $cursor->format('d'),
                'is_in_month' => $cursor->month === $monthStart->month,
                'is_today' => $cursor->isToday(),
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
}
