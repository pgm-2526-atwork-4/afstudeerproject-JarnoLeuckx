@php
	$serviceLabel = match ($ride->service_type) {
		'airport' => 'Luchthavenvervoer',
		'wheelchair' => 'Rolstoelvervoer',
		'medical' => 'Medische rit',
		'assistance' => 'Assistentie',
		default => ucfirst((string) $ride->service_type),
	};
@endphp

<x-email-layout
	eyebrow="Admin"
	title="Nieuwe ritaanvraag"
	subtitle="Er werd een nieuwe ritaanvraag geregistreerd in Social Drive."
>
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%;">
		<tr>
			<td style="padding-bottom: 20px; font-size: 15px; line-height: 26px; color: #475569;">
				Een klant heeft een nieuwe rit aangevraagd. Hieronder vindt u het volledige overzicht van deze reservatie.
			</td>
		</tr>

		<tr>
			<td style="padding-bottom: 24px;">
				<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #dbeafe; border-radius: 20px; overflow: hidden;">
					<tr>
						<td style="background-color: #edf4ff; padding: 18px 22px; font-size: 13px; line-height: 20px; font-weight: 700; color: #0043a8; text-transform: uppercase; letter-spacing: 0.12em;">
							Reservatiegegevens
						</td>
					</tr>
					<tr>
						<td style="padding: 22px; background-color: #ffffff; font-size: 15px; line-height: 28px; color: #334155;">
							<strong>Ritnummer:</strong> #{{ $ride->id }}<br>
							<strong>Klant:</strong> {{ $customer?->name ?? 'Onbekend' }}<br>
							<strong>E-mail klant:</strong> {{ $customer?->email ?? 'Niet beschikbaar' }}<br>
							<strong>Dienst:</strong> {{ $serviceLabel }}<br>
							<strong>Vertrek:</strong> {{ $ride->pickup_datetime?->format('d/m/Y H:i') }}<br>
							<strong>Traject:</strong> {{ $ride->pickup_address }} naar {{ $ride->dropoff_address }}<br>
							<strong>Prijsindicatie:</strong>
							@if($ride->total_price !== null)
								EUR {{ number_format((float) $ride->total_price, 2, ',', '.') }}
							@else
								Nog niet berekend
							@endif
						</td>
					</tr>
				</table>
			</td>
		</tr>

		@if(!empty($ride->notes))
			<tr>
				<td style="padding-bottom: 24px;">
					<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #f8fafc;">
						<tr>
							<td style="padding: 18px 22px; font-size: 13px; line-height: 20px; font-weight: 700; color: #0043a8; text-transform: uppercase; letter-spacing: 0.12em;">
								Opmerkingen van de klant
							</td>
						</tr>
						<tr>
							<td style="padding: 0 22px 22px; font-size: 15px; line-height: 28px; color: #475569;">
								{{ $ride->notes }}
							</td>
						</tr>
					</table>
				</td>
			</tr>
		@endif

		@if($adminUrl)
			<tr>
				<td style="padding-bottom: 22px;">
					<a href="{{ $adminUrl }}" style="display: inline-block; border-radius: 14px; background-color: #0043a8; color: #ffffff; text-decoration: none; font-size: 14px; line-height: 20px; font-weight: 700; padding: 14px 22px;">
						Bekijk rit in beheer
					</a>
				</td>
			</tr>
		@endif
	</table>
</x-email-layout>
