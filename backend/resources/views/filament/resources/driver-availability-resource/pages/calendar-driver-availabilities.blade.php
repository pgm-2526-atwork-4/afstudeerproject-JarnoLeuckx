<x-filament-panels::page>
    <div class="space-y-5">
        <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <x-filament::button color="gray" icon="heroicon-o-chevron-left" wire:click="previousMonth">
                    Vorige maand
                </x-filament::button>

                <div class="text-center">
                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Planningsoverzicht</p>
                    <h2 class="text-xl font-bold text-gray-900">
                        {{ $this->monthLabel }}
                    </h2>
                </div>

                <x-filament::button color="gray" icon="heroicon-o-chevron-right" icon-position="after" wire:click="nextMonth">
                    Volgende maand
                </x-filament::button>
            </div>

            <div class="mt-4 max-w-md">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Filter op chauffeur
                </label>
                <select
                    wire:model.live="driverId"
                    class="block w-full rounded-lg border-gray-300 bg-white text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                    <option value="">Alle chauffeurs</option>
                    @foreach ($this->driverOptions as $id => $label)
                        <option value="{{ $id }}">{{ $label }}</option>
                    @endforeach
                </select>
            </div>

            <div class="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Legenda</p>
                <div class="flex flex-wrap gap-2 text-xs">
                    <span class="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">Beschikbaar</span>
                    <span class="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 font-medium text-orange-800">Verlof toegekend</span>
                    <span class="rounded-full border border-gray-300 bg-gray-100 px-2.5 py-1 font-medium text-gray-700">Verlof in afwachting</span>
                    <span class="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 font-medium text-red-800">Ziekte / afwezig</span>
                </div>
            </div>
        </div>

        <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                @foreach ($this->weekdayLabels as $weekday)
                    <div class="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {{ $weekday }}
                    </div>
                @endforeach
            </div>

            @foreach ($this->calendarWeeks as $week)
                <div class="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
                    @foreach ($week as $day)
                        <div
                            @class([
                                'min-h-[160px] border-r border-gray-100 p-2 last:border-r-0',
                                'bg-white' => $day['is_in_month'],
                                'bg-gray-50/60 text-gray-400' => ! $day['is_in_month'],
                            ])
                        >
                            <div class="mb-2 flex items-center justify-between">
                                <span
                                    @class([
                                        'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                                        'bg-primary-600 text-white' => $day['is_today'],
                                        'text-gray-700' => ! $day['is_today'] && $day['is_in_month'],
                                        'text-gray-400' => ! $day['is_today'] && ! $day['is_in_month'],
                                    ])
                                >
                                    {{ $day['day'] }}
                                </span>

                                @if (count($day['items']) > 0)
                                    <span class="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                                        {{ count($day['items']) }}
                                    </span>
                                @endif
                            </div>

                            <div class="space-y-1.5">
                                @foreach (array_slice($day['items'], 0, 3) as $item)
                                    <div
                                        @class([
                                            'rounded-lg border px-2 py-1 text-[10px] leading-tight',
                                            'border-emerald-200 bg-emerald-50 text-emerald-900' => $item['type'] === 'available',
                                            'border-orange-200 bg-orange-50 text-orange-900' => $item['type'] === 'leave' && $item['approval'] === 'approved',
                                            'border-gray-300 bg-gray-100 text-gray-800' => $item['type'] === 'leave' && $item['approval'] === 'pending',
                                            'border-red-200 bg-red-50 text-red-900' => $item['type'] === 'sick' || $item['status'] === 'unavailable',
                                            'border-gray-200 bg-white text-gray-700' => !in_array($item['type'], ['available', 'sick', 'leave']),
                                        ])
                                    >
                                        <p class="truncate font-semibold">{{ $item['name'] }}</p>
                                        <p>{{ $item['start'] }} - {{ $item['end'] }}</p>
                                    </div>
                                @endforeach

                                @if (count($day['items']) > 3)
                                    <p class="text-[10px] font-medium text-gray-500">
                                        + {{ count($day['items']) - 3 }} extra
                                    </p>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            @endforeach
        </div>
    </div>
</x-filament-panels::page>
