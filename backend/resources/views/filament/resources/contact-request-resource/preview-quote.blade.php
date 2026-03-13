<div class="space-y-4">
    {{-- Info banner --}}
    <div class="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Dit is een preview van de offerte-PDF die naar <strong>{{ $record->email }}</strong> wordt / werd gestuurd.
    </div>

    {{-- Embedded PDF preview via iframe (server route) --}}
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" style="height: 680px;">
        <iframe
            src="{{ route('filament.quote.pdf.preview', $record) }}"
            class="h-full w-full border-0"
            title="Offerte PDF preview"
        ></iframe>
    </div>

    {{-- Download knop --}}
    <div class="flex justify-end">
        <a
            href="{{ route('filament.quote.pdf.download', $record) }}"
            target="_blank"
            class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
            PDF downloaden
        </a>
    </div>
</div>
