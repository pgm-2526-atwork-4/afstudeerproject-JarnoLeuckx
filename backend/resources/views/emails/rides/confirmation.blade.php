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
	eyebrow="Ritaanvraag"
	title="Uw ritaanvraag is ontvangen"
	subtitle="We hebben uw aanvraag goed ontvangen en verwerken die zo snel mogelijk."
>
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%;">
		<tr>
			<td style="padding-bottom: 22px; font-size: 15px; line-height: 26px; color: #475569;">
				Beste {{ $customer?->name ?? 'klant' }},<br>
				uw rit staat geregistreerd in ons systeem. Hieronder vindt u een duidelijk overzicht van de aanvraag.
			</td>
		</tr>

		<tr>
			<td style="padding-bottom: 22px;">
				<span style="display: inline-block; background-color: #eaf3ff; color: #0043a8; border: 1px solid #c6dcff; border-radius: 999px; padding: 8px 14px; font-size: 13px; line-height: 18px; font-weight: 700;">
					Status: {{ $ride->status_label }}
				</span>
			</td>
		</tr>

		<tr>
			<td style="padding-bottom: 24px;">
				<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #dbeafe; border-radius: 20px; overflow: hidden;">
					<tr>
						<td style="background-color: #edf4ff; padding: 18px 22px; font-size: 13px; line-height: 20px; font-weight: 700; color: #0043a8; text-transform: uppercase; letter-spacing: 0.12em;">
							Ritoverzicht
						</td>
					</tr>
					<tr>
						<td style="padding: 22px; background-color: #ffffff; font-size: 15px; line-height: 28px; color: #334155;">
							<strong>Ritnummer:</strong> #{{ $ride->id }}<br>
							<strong>Dienst:</strong> {{ $serviceLabel }}<br>
							<strong>Vertrek:</strong> {{ $ride->pickup_datetime?->format('d/m/Y H:i') }}<br>
							<strong>Van:</strong> {{ $ride->pickup_address }}<br>
							<strong>Naar:</strong> {{ $ride->dropoff_address }}
							@if($ride->total_price !== null)
								<br><strong>Prijsindicatie:</strong> EUR {{ number_format((float) $ride->total_price, 2, ',', '.') }}
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
								Opmerkingen
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

		@if($accountUrl)
			<tr>
				<td style="padding-bottom: 22px;">
					<a href="{{ $accountUrl }}" style="display: inline-block; border-radius: 14px; background-color: #0043a8; color: #ffffff; text-decoration: none; font-size: 14px; line-height: 20px; font-weight: 700; padding: 14px 22px;">
						Bekijk mijn ritten
					</a>
				</td>
			</tr>
		@endif

		<tr>
			<td style="font-size: 14px; line-height: 25px; color: #64748b;">
				U ontvangt een bijkomende melding zodra de status van uw rit wijzigt.
			</td>
		</tr>
	</table>
</x-email-layout>
