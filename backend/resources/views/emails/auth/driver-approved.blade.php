<x-email-layout
    eyebrow="Account goedgekeurd"
    title="Uw chauffeuraccount is goedgekeurd"
    subtitle="Een beheerder heeft uw chauffeuraccount geactiveerd. U kunt nu inloggen op uw account."
>
    <p style="margin: 0 0 18px; font-size: 15px; line-height: 24px; color: #334155;">
        Hallo {{ $user->name }},
    </p>

    <p style="margin: 0 0 20px; font-size: 15px; line-height: 24px; color: #334155;">
        Goed nieuws: uw chauffeuraccount bij {{ config('app.name') }} werd goedgekeurd door een beheerder.
    </p>

    @if (! empty($loginUrl))
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
            <tr>
                <td>
                    <a
                        href="{{ $loginUrl }}"
                        style="display: inline-block; border-radius: 999px; background-color: #0043a8; color: #ffffff; font-size: 14px; font-weight: 700; line-height: 20px; padding: 14px 24px; text-decoration: none;"
                    >
                        Inloggen
                    </a>
                </td>
            </tr>
        </table>
    @endif

    <div style="border: 1px solid #d6e6ff; border-radius: 20px; background-color: #f8fbff; padding: 18px 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-size: 13px; line-height: 18px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #0043a8;">
            Klaar om te starten
        </p>
        <p style="margin: 0; font-size: 14px; line-height: 22px; color: #475569;">
            U kunt vanaf nu aanmelden en uw chauffeursaccount gebruiken.
        </p>
    </div>

    @if (! empty($loginUrl))
        <p style="margin: 0; font-size: 13px; line-height: 21px; color: #64748b;">
            Werkt de knop niet? Open dan deze link in uw browser:<br>
            <a href="{{ $loginUrl }}" style="color: #0043a8; word-break: break-all;">{{ $loginUrl }}</a>
        </p>
    @endif
</x-email-layout>