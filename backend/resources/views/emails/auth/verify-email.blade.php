<x-email-layout
    eyebrow="Accountbevestiging"
    title="Bevestig uw e-mailadres"
    subtitle="Uw account is bijna klaar. Bevestig eerst uw e-mailadres zodat we zeker weten dat we u op het juiste adres kunnen bereiken."
>
    <p style="margin: 0 0 18px; font-size: 15px; line-height: 24px; color: #334155;">
        Hallo {{ $user->name }},
    </p>

    <p style="margin: 0 0 20px; font-size: 15px; line-height: 24px; color: #334155;">
        Bedankt om een account aan te maken bij {{ config('app.name') }}. Klik op de knop hieronder om uw e-mailadres te bevestigen.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
        <tr>
            <td>
                <a
                    href="{{ $verificationUrl }}"
                    style="display: inline-block; border-radius: 999px; background-color: #0043a8; color: #ffffff; font-size: 14px; font-weight: 700; line-height: 20px; padding: 14px 24px; text-decoration: none;"
                >
                    E-mailadres bevestigen
                </a>
            </td>
        </tr>
    </table>

    <div style="border: 1px solid #d6e6ff; border-radius: 20px; background-color: #f8fbff; padding: 18px 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-size: 13px; line-height: 18px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #0043a8;">
            Belangrijk
        </p>
        <p style="margin: 0; font-size: 14px; line-height: 22px; color: #475569;">
            Deze verificatielink blijft 24 uur geldig. Na bevestiging kunt u inloggen. Voor chauffeurs blijft daarna nog admin-goedkeuring nodig.
        </p>
    </div>

    <p style="margin: 0; font-size: 13px; line-height: 21px; color: #64748b;">
        Werkt de knop niet? Open dan deze link in uw browser:<br>
        <a href="{{ $verificationUrl }}" style="color: #0043a8; word-break: break-all;">{{ $verificationUrl }}</a>
    </p>
</x-email-layout>