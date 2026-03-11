@php
    $serviceLabel = match ($ride->service_type) {
        'airport' => 'Luchthavenvervoer',
        'wheelchair' => 'Rolstoelvervoer',
        'medical' => 'Medische rit',
        'assistance' => 'Assistentie',
        default => ucfirst((string) $ride->service_type),
    };

    $statusColor = match ($ride->status) {
        'assigned' => '#0f5bd3',
        'accepted' => '#0f766e',
        'cancelled' => '#b91c1c',
        'completed' => '#475569',
        default => '#0043a8',
    };

    $statusBackground = match ($ride->status) {
        'assigned' => '#eaf3ff',
        'accepted' => '#ecfdf5',
        'cancelled' => '#fef2f2',
        'completed' => '#f1f5f9',
        default => '#edf4ff',
    };
@endphp

<x-email-layout
    eyebrow="Ritstatus"
    :title="$statusMessage['title']"
    :subtitle="$statusMessage['body']"
>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%;">
        <tr>
            <td style="padding-bottom: 22px; font-size: 15px; line-height: 26px; color: #475569;">
                Beste {{ $notifiable->name }},<br>
                hieronder vindt u de meest recente update van uw rit.
            </td>
        </tr>

        <tr>
            <td style="padding-bottom: 22px;">
                <span style="display: inline-block; background-color: {{ $statusBackground }}; color: {{ $statusColor }}; border: 1px solid {{ $statusColor }}22; border-radius: 999px; padding: 8px 14px; font-size: 13px; line-height: 18px; font-weight: 700;">
                    Status: {{ $ride->status_label }}
                </span>
            </td>
        </tr>

        <tr>
            <td style="padding-bottom: 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #dbeafe; border-radius: 20px; overflow: hidden;">
                    <tr>
                        <td style="background-color: #edf4ff; padding: 18px 22px; font-size: 13px; line-height: 20px; font-weight: 700; color: #0043a8; text-transform: uppercase; letter-spacing: 0.12em;">
                            Ritdetails
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 22px; background-color: #ffffff; font-size: 15px; line-height: 28px; color: #334155;">
                            <strong>Ritnummer:</strong> #{{ $ride->id }}<br>
                            <strong>Dienst:</strong> {{ $serviceLabel }}<br>
                            <strong>Vertrek:</strong> {{ $ride->pickup_datetime?->format('d/m/Y H:i') }}<br>
                            <strong>Traject:</strong> {{ $ride->pickup_address }} naar {{ $ride->dropoff_address }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        @if($accountUrl)
            <tr>
                <td style="padding-bottom: 22px;">
                    <a href="{{ $accountUrl }}" style="display: inline-block; border-radius: 14px; background-color: #0043a8; color: #ffffff; text-decoration: none; font-size: 14px; line-height: 20px; font-weight: 700; padding: 14px 22px;">
                        Bekijk uw ritten
                    </a>
                </td>
            </tr>
        @endif

        <tr>
            <td style="font-size: 14px; line-height: 25px; color: #64748b;">
                Bedankt voor uw vertrouwen in Social Drive.
            </td>
        </tr>
    </table>
</x-email-layout>