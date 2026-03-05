<x-filament-panels::page>
    <div class="space-y-4">
        <div class="flex items-center justify-between gap-3">
            <x-filament::button color="gray" wire:click="previousMonth">
                Vorige maand
            </x-filament::button>

            <h2 class="text-lg font-bold">
                {{ $this->monthLabel }}
            </h2>

            <x-filament::button color="gray" wire:click="nextMonth">
                Volgende maand
            </x-filament::button>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-3">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Legenda</p>
            <div class="flex flex-wrap gap-2 text-xs">
                <span class="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-800">Beschikbaar</span>
                <span class="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-red-800">Ziekte</span>
                <span class="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-amber-800">Verlof</span>
                <span class="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-blue-800">Verlof in afwachting</span>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            @foreach ($this->calendarDays as $day)
                <div class="rounded-xl border border-gray-200 bg-white p-3">
                    <div class="mb-2 flex items-center justify-between">
                        <p class="text-sm font-semibold">{{ $day['label'] }}</p>
                        <p class="text-xs text-gray-500 uppercase">{{ $day['weekday'] }}</p>
                    </div>

                    @if (count($day['items']) === 0)
                        <p class="text-xs text-gray-500">Geen beschikbaarheden.</p>
                    @else
                        <div class="space-y-2">
                            @foreach ($day['items'] as $item)
                                <div
                                    @class([
                                        'rounded-lg border p-2 text-xs',
                                        'border-emerald-200 bg-emerald-50' => $item['type'] === 'available',
                                        'border-red-200 bg-red-50' => $item['type'] === 'sick',
                                        'border-amber-200 bg-amber-50' => $item['type'] === 'leave' && $item['approval'] === 'approved',
                                        'border-blue-200 bg-blue-50' => $item['type'] === 'leave' && $item['approval'] === 'pending',
                                        'border-gray-200 bg-white' => !in_array($item['type'], ['available', 'sick', 'leave']),
                                    ])
                                >
                                    <p class="font-semibold text-gray-900">{{ $item['name'] }}</p>
                                    <p class="text-gray-600">{{ $item['start'] }} - {{ $item['end'] }}</p>
                                    <p class="mt-1 text-gray-600">
                                        Type:
                                        {{ match ($item['type']) {
                                            'available' => 'Beschikbaar',
                                            'sick' => 'Ziekte',
                                            'leave' => 'Verlof',
                                            default => $item['type'],
                                        } }}
                                        · Goedkeuring:
                                        {{ match ($item['approval']) {
                                            'not_required' => 'Niet nodig',
                                            'pending' => 'In afwachting',
                                            'approved' => 'Goedgekeurd',
                                            'rejected' => 'Afgekeurd',
                                            default => $item['approval'],
                                        } }}
                                    </p>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
</x-filament-panels::page>
