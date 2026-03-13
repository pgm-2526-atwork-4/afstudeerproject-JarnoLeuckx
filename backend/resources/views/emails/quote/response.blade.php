<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Uw prijsofferte van Social Drive</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 14px; color: #1e293b; background: #f1f5f9; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
        .header { background: linear-gradient(135deg, #0b0b0f 0%, #0f1c3d 55%, #0043A8 100%); padding: 28px 32px; }
        .header h1 { color: #fff; font-size: 20px; margin: 0 0 4px; }
        .header p { color: rgba(255,255,255,.75); font-size: 13px; margin: 0; }
        .body { padding: 28px 32px; }
        .body p { line-height: 1.7; margin-bottom: 14px; }
        .price-card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 18px 20px; margin: 20px 0; }
        .price-card .label { font-size: 12px; color: #3b82f6; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 8px; }
        .price-card .amount { font-size: 26px; font-weight: 700; color: #0043A8; }
        .price-card .sub { font-size: 12px; color: #64748b; margin-top: 2px; }
        .details { background: #f8fafc; border-radius: 8px; padding: 16px 20px; margin: 16px 0; }
        .details .row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
        .details .row:last-child { border-bottom: none; }
        .details .row .key { color: #64748b; }
        .details .row .val { font-weight: 600; }
        .cta { text-align: center; margin: 24px 0; }
        .cta a { background: #0043A8; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; font-size: 12px; color: #94a3b8; text-align: center; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Social Drive — Uw prijsofferte</h1>
        <p>Offerte #{{ str_pad($quote->id, 5, '0', STR_PAD_LEFT) }}</p>
    </div>

    <div class="body">
        <p>Beste {{ $quote->name }},</p>
        <p>Bedankt voor uw interesse in onze diensten. Hierbij ontvangt u onze prijsofferte op basis van de door u opgegeven gegevens. De offerte vindt u als bijlage in PDF-formaat.</p>

        <div class="price-card">
            <div class="label">Totaalbedrag (excl. BTW)</div>
            <div class="amount">€ {{ number_format((float) $quote->total_price, 2, ',', '.') }}</div>
            <div class="sub">
                {{ number_format((float) $quote->estimated_km, 1, ',', '.') }} km × €&nbsp;{{ number_format((float) $quote->price_per_km, 2, ',', '.') }}/km
            </div>
        </div>

        <div class="details">
            <div class="row">
                <span class="key">Ophaallocatie</span>
                <span class="val">{{ $quote->pickup_address }}</span>
            </div>
            <div class="row">
                <span class="key">Bestemming</span>
                <span class="val">{{ $quote->dropoff_address }}</span>
            </div>
            <div class="row">
                <span class="key">Reisdatum</span>
                <span class="val">{{ $quote->travel_date?->format('d/m/Y') }}</span>
            </div>
            <div class="row">
                <span class="key">Dienst</span>
                <span class="val">{{ ucfirst($quote->service_type) }}</span>
            </div>
            @if($quote->return_trip)
            <div class="row">
                <span class="key">Retourrit</span>
                <span class="val">Ja</span>
            </div>
            @endif
        </div>

        @if($quote->quote_notes)
        <p><strong>Opmerking:</strong> {{ $quote->quote_notes }}</p>
        @endif

        <p>U kunt de offerte digitaal ondertekenen via uw klantenaccount op onze website. Na ondertekening wordt uw rit definitief ingepland.</p>

        <div class="cta">
            <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/customer/account">Naar mijn account →</a>
        </div>

        <p>Heeft u vragen? Neem gerust contact op via <a href="mailto:info@socialdrive.be">info@socialdrive.be</a> of bel ons op <strong>+32 (0) 470 12 34 56</strong>.</p>

        <p>Met vriendelijke groeten,<br><strong>Het Social Drive team</strong></p>
    </div>

    <div class="footer">
        Social Drive · info@socialdrive.be · +32 (0) 470 12 34 56 · Deze offerte is geldig voor 30 dagen.
    </div>
</div>
</body>
</html>
