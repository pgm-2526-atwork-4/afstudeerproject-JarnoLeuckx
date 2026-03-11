<x-email-layout
	eyebrow="Contact"
	title="Nieuw contactbericht"
	subtitle="Er werd een nieuw bericht verstuurd via de website van Social Drive."
>
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%;">
		<tr>
			<td style="padding-bottom: 22px; font-size: 15px; line-height: 26px; color: #475569;">
				Bekijk hieronder de gegevens van het nieuwe contactbericht.
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
								<strong>Onderwerp:</strong> {{ $data['subject'] }}
								@if(!empty($data['phone']))
									<br><strong>Telefoon:</strong> {{ $data['phone'] }}
								@endif
							</div>
						</td>
					</tr>
				</table>
			</td>
		</tr>

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