@props([
    'eyebrow' => null,
    'title',
    'subtitle' => null,
])

@php
    $logoUrl = rtrim((string) config('app.url'), '/') . '/logo.png';
    $appName = config('app.name');
@endphp

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #eef4ff; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #eef4ff; margin: 0; padding: 24px 0; width: 100%;">
        <tr>
            <td align="center" style="padding: 0 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 680px; width: 100%;">
                    <tr>
                        <td align="center" style="padding: 4px 0 22px;">
                            <img src="{{ $logoUrl }}" alt="{{ $appName }}" style="display: block; height: 108px; width: auto; margin: 0 auto;">
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #ffffff; border: 1px solid #d6e6ff; border-bottom: 0; border-radius: 28px 28px 0 0; padding: 28px 32px 20px; color: #0f172a;">
                            @if ($eyebrow)
                                <div style="font-size: 12px; line-height: 18px; letter-spacing: 0.18em; text-transform: uppercase; color: #0043a8; font-weight: 700; margin-bottom: 10px;">
                                    {{ $eyebrow }}
                                </div>
                            @endif

                            <div style="font-size: 30px; line-height: 36px; font-weight: 800; letter-spacing: -0.02em; margin: 0;">
                                {{ $title }}
                            </div>

                            @if ($subtitle)
                                <div style="font-size: 15px; line-height: 24px; color: #475569; margin-top: 12px; max-width: 560px;">
                                    {{ $subtitle }}
                                </div>
                            @endif
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #ffffff; border: 1px solid #d6e6ff; border-top: 0; border-radius: 0 0 28px 28px; padding: 32px; box-shadow: 0 16px 40px rgba(2, 6, 23, 0.08);">
                            {{ $slot }}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 18px 18px 0; text-align: center; font-size: 12px; line-height: 20px; color: #64748b;">
                            {{ $appName }}<br>
                            Veilig, comfortabel en persoonlijk vervoer.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>