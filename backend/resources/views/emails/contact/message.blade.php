<x-email-layout
	eyebrow="{{ ($data['request_type'] ?? 'contact') === 'offerte' ? 'Offerte' : 'Contact' }}"
	title="{{ ($data['request_type'] ?? 'contact') === 'offerte' ? 'Nieuwe offerteaanvraag' : 'Nieuw contactbericht' }}"
	subtitle="Er werd een nieuw {{ ($data['request_type'] ?? 'contact') === 'offerte' ? 'offerteaanvraag' : 'bericht' }} verstuurd via de website van Social Drive."
>
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%;">
		<tr>
			<td style="padding-bottom: 22px; font-size: 15px; line-height: 26px; color: #475569;">
				Bekijk hieronder de gegevens van de nieuwe aanvraag.
			</td>
		</tr>

		<tr>
			<td style="padding-bottom: 24px;">
				<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border: 1px solid #d6e6ff; border-radius: 20px; background-color: #edf4ff;">
					<tr>
						<td style="padding: 20px 22px;">
							<div style="font-size: 13px; line-height: 20px; font-weight: 700; color: #0043a8; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px;">
								Afzender
							</div>

							<div style="font-size: 15px; line-height: 26px; color: #0f172a;">
								<strong>Naam:</strong> {{ $data['name'] }}<br>
								<strong>E-mail:</strong> {{ $data['email'] }}<br>
								<strong>Type:</strong> {{ ($data['request_type'] ?? 'contact') === 'offerte' ? 'Offerteaanvraag' : 'Contactbericht' }}
								@if(!empty($data['subject']))
									<br><strong>Onderwerp:</strong> {{ $data['subject'] }}
								@endif
								@if(!empty($data['phone']))
									<br><strong>Telefoon:</strong> {{ $data['phone'] }}
								@endif
							</div>
						</td>
					</tr>
				</table>
			</td>
		</tr>

		@if(($data['request_type'] ?? 'contact') === 'offerte')
			<tr>
				<td style="padding-bottom: 24px;">
					<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border: 1px solid #d6e6ff; border-radius: 20px; background-color: #ffffff;">
						<tr>
							<td style="padding: 20px 22px; font-size: 15px; line-height: 26px; color: #0f172a;">
								<div style="font-size: 13px; line-height: 20px; font-weight: 700; color: #0043a8; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px;">
									Offertedetails
								</div>

								@if(!empty($data['service_type']))
									<strong>Dienst:</strong> {{ $data['service_type'] }}<br>
								@endif
								@if(!empty($data['pickup_address']))
									<strong>Ophaallocatie:</strong> {{ $data['pickup_address'] }}<br>
								@endif
								@if(!empty($data['dropoff_address']))
									<strong>Bestemming:</strong> {{ $data['dropoff_address'] }}<br>
								@endif
								@if(!empty($data['travel_date']))
									<strong>Reisdatum:</strong> {{ \Illuminate\Support\Carbon::parse($data['travel_date'])->format('d/m/Y') }}<br>
								@endif
								@if(isset($data['return_trip']))
									<strong>Retourrit:</strong> {{ $data['return_trip'] ? 'Ja' : 'Nee' }}<br>
								@endif
								@if(!empty($data['passengers']))
									<strong>Aantal passagiers:</strong> {{ $data['passengers'] }}
								@endif
							</td>
						</tr>
					</table>
				</td>
			</tr>
		@endif

		<tr>
			<td style="padding-bottom: 10px; font-size: 13px; line-height: 20px; font-weight: 700; color: #0043a8; text-transform: uppercase; letter-spacing: 0.12em;">
				Bericht
			</td>
		</tr>

		<tr>
			<td style="border: 1px solid #e2e8f0; border-radius: 20px; background-color: #f8fafc; padding: 22px; font-size: 15px; line-height: 28px; color: #334155; white-space: pre-line;">
				{{ $data['message'] }}
			</td>
		</tr>
	</table>
</x-email-layout>