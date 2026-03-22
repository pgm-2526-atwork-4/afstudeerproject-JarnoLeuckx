@if(isset($error_message))
    <div class="rounded-xl border border-red-300 bg-red-50 p-4 mb-4">
        <div class="text-sm text-red-700 font-semibold">{{ $error_message }}</div>
    </div>
@elseif($record)
    <div class="space-y-6">
        <div class="rounded-2xl border border-primary-200 bg-primary-50 p-5">
            <div class="text-xs font-bold uppercase tracking-wider text-primary-700">Type aanvraag</div>
            <div class="mt-2 text-lg font-semibold text-gray-900">
                {{ $record->request_type === 'offerte' ? 'Offerteaanvraag' : 'Contactbericht' }}
            </div>
            <div class="mt-1 text-sm text-gray-600">Ontvangen op {{ $record->created_at?->format('d/m/Y H:i') }}</div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <div class="text-xs font-bold uppercase tracking-wider text-gray-500">Naam</div>
                <div class="mt-1 text-sm font-medium text-gray-900">{{ $record->name }}</div>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <div class="text-xs font-bold uppercase tracking-wider text-gray-500">E-mail</div>
                <div class="mt-1 text-sm font-medium text-gray-900">{{ $record->email }}</div>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <div class="text-xs font-bold uppercase tracking-wider text-gray-500">Telefoon</div>
                <div class="mt-1 text-sm font-medium text-gray-900">{{ $record->phone ?: '-' }}</div>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <div class="text-xs font-bold uppercase tracking-wider text-gray-500">Status</div>
                <div class="mt-1 text-sm font-medium text-gray-900">{{ str_replace('_', ' ', ucfirst($record->status)) }}</div>
            </div>
        </div>

        @if($record->request_type === 'contact')
            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <div class="text-xs font-bold uppercase tracking-wider text-gray-500">Onderwerp</div>
                <div class="mt-1 text-sm font-medium text-gray-900">{{ $record->subject ?: '-' }}</div>
            </div>
        @endif

        @if($record->request_type === 'offerte')
            <div class="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <div class="mb-4 text-xs font-bold uppercase tracking-wider text-blue-700">Offertedetails</div>

                <div class="grid gap-4 md:grid-cols-2">
                    <div>
                        <div class="text-xs font-bold uppercase tracking-wider text-gray-500">Dienst</div>
                        <div class="mt-1 text-sm text-gray-900">{{ $record->service_type ?: '-' }}</div>
                    </div>

                    <div>
                        <div class="text-xs font-bold uppercase tracking-wider text-gray-500">Reisdatum</div>
                        <div class="mt-1 text-sm text-gray-900">{{ $record->travel_date?->format('d/m/Y') ?: '-' }}</div>
                    </div>

                    <div>
                        <div class="text-xs font-bold uppercase tracking-wider text-gray-500">Aantal passagiers</div>
                        <div class="mt-1 text-sm text-gray-900">{{ $record->passengers ?: '-' }}</div>
                    </div>

                    <div>
                        <div class="text-xs font-bold uppercase tracking-wider text-gray-500">Retourrit</div>
                        <div class="mt-1 text-sm text-gray-900">{{ $record->return_trip ? 'Ja' : 'Nee' }}</div>
                    </div>

                    <div class="md:col-span-2">
                        <div class="text-xs font-bold uppercase tracking-wider text-gray-500">Ophaallocatie</div>
                        <div class="mt-1 text-sm text-gray-900">{{ $record->pickup_address ?: '-' }}</div>
                    </div>

                    <div class="md:col-span-2">
                        <div class="text-xs font-bold uppercase tracking-wider text-gray-500">Bestemming</div>
                        <div class="mt-1 text-sm text-gray-900">{{ $record->dropoff_address ?: '-' }}</div>
                    </div>
                </div>
            </div>
        @endif

        <div class="rounded-xl border border-gray-200 bg-white p-4">
            <div class="text-xs font-bold uppercase tracking-wider text-gray-500">Bericht</div>
            <div class="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-800">{{ $record->message }}</div>
        </div>
    </div>
@endif
