<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prijsofferte – Social Drive</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1e293b; background: #fff; }

        .page { padding: 32px 40px; }

        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 2px solid #0043A8; padding-bottom: 20px; }
        .brand-block { display: table; }
        .brand-logo { display: block; height: 52px; width: auto; margin-bottom: 10px; }
        .header-left h1 { font-size: 22px; font-weight: 700; color: #0043A8; margin-bottom: 4px; }
        .header-left p { font-size: 10px; color: #64748b; }
        .header-right { text-align: right; }
        .header-right .doc-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .header-right .doc-number { font-size: 14px; font-weight: 700; color: #0043A8; margin-top: 2px; }
        .header-right .doc-date { font-size: 10px; color: #64748b; margin-top: 2px; }

        .section { margin-bottom: 20px; }
        .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #0043A8; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }

        .info-grid { display: table; width: 100%; border-collapse: collapse; }
        .info-row { display: table-row; }
        .info-label { display: table-cell; width: 38%; font-size: 10px; font-weight: 600; color: #64748b; padding: 4px 0; vertical-align: top; }
        .info-value { display: table-cell; font-size: 11px; color: #1e293b; padding: 4px 0; }

        .two-col { display: table; width: 100%; border-collapse: separate; border-spacing: 12px 0; }
        .col { display: table-cell; width: 50%; vertical-align: top; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; }
        .col-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; margin-bottom: 6px; }

        .price-box { background: #eff6ff; border: 2px solid #0043A8; border-radius: 8px; padding: 18px 20px; margin-bottom: 20px; }
        .price-row { display: table; width: 100%; margin-bottom: 6px; }
        .price-row-cell { display: table-cell; }
        .price-row-cell.right { text-align: right; font-weight: 600; }
        .price-divider { border: none; border-top: 1px solid #bfdbfe; margin: 10px 0; }
        .price-total-row { display: table; width: 100%; }
        .price-total-cell { display: table-cell; font-weight: 700; font-size: 13px; color: #0043A8; }
        .price-total-cell.right { text-align: right; }

        .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; white-space: pre-wrap; word-wrap: break-word; line-height: 1.6; }

        .notes-box { background: #fefce8; border: 1px solid #fde68a; border-radius: 6px; padding: 14px; white-space: pre-wrap; line-height: 1.6; }

        .signature-section { margin-top: 28px; border: 2px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; }
        .signature-title { font-size: 11px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
        .signature-grid { display: table; width: 100%; }
        .sig-col { display: table-cell; width: 50%; vertical-align: top; }
        .sig-line { border-bottom: 1px solid #cbd5e1; margin-top: 40px; margin-right: 20px; }
        .sig-label { font-size: 9px; color: #64748b; margin-top: 4px; }

        .signed-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 14px 18px; }
        .signed-title { font-size: 11px; font-weight: 700; color: #065f46; margin-bottom: 6px; }
        .signed-detail { font-size: 10px; color: #064e3b; line-height: 1.8; }

        .footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: table; width: 100%; }
        .footer-left { display: table-cell; font-size: 9px; color: #94a3b8; }
        .footer-right { display: table-cell; text-align: right; font-size: 9px; color: #94a3b8; }

        .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
        .badge-pending { background: #fef9c3; color: #854d0e; }
        .badge-signed  { background: #d1fae5; color: #065f46; }

        .valid-notice { font-size: 9px; color: #64748b; font-style: italic; margin-top: 8px; }
    </style>
</head>
<body>
<div class="page">

    
    <div class="header">
        <div class="header-left">
            <div class="brand-block">
                <img src="{{ public_path('logo.png') }}" alt="Social Drive logo" class="brand-logo">
            </div>
            <h1>Social Drive</h1>
            <p>Betrouwbaar en zorgzaam vervoer</p>
        </div>
        <div class="header-right">
            <div class="doc-label">Prijsofferte</div>
            <div class="doc-number">#{{ str_pad($quote->id, 5, '0', STR_PAD_LEFT) }}</div>
            <div class="doc-date">Opgemaakt op {{ $quote->quote_sent_at?->format('d/m/Y') ?? now()->format('d/m/Y') }}</div>
        </div>
    </div>

    
    <div class="section">
        <div class="section-title">Klantgegevens</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Naam</div>
                <div class="info-value">{{ $quote->name }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">E-mail</div>
                <div class="info-value">{{ $quote->email }}</div>
            </div>
            @if($quote->phone)
            <div class="info-row">
                <div class="info-label">Telefoon</div>
                <div class="info-value">{{ $quote->phone }}</div>
            </div>
            @endif
        </div>
    </div>

    
    <div class="section">
        <div class="section-title">Ritdetails</div>
        <div style="margin-bottom: 10px;">
            <div class="two-col">
                <div class="col">
                    <div class="col-title">Ophaallocatie</div>
                    <div>{{ $quote->pickup_address ?: '-' }}</div>
                </div>
                <div class="col">
                    <div class="col-title">Bestemming</div>
                    <div>{{ $quote->dropoff_address ?: '-' }}</div>
                </div>
            </div>
        </div>
        <div style="margin-top: 10px;">
            <div class="two-col">
                <div class="col">
                    <div class="col-title">Reisdatum</div>
                    <div>{{ $quote->travel_date?->format('d/m/Y') ?: '-' }}</div>
                </div>
                <div class="col">
                    <div class="col-title">Dienst</div>
                    <div>{{ ucfirst($quote->service_type ?: '-') }}</div>
                </div>
            </div>
        </div>
        @if($quote->passengers)
        <div style="margin-top: 10px;">
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Aantal passagiers</div>
                    <div class="info-value">{{ $quote->passengers }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Retourrit</div>
                    <div class="info-value">{{ $quote->return_trip ? 'Ja' : 'Nee' }}</div>
                </div>
            </div>
        </div>
        @endif
    </div>

    
    <div class="section">
        <div class="section-title">Prijsberekening</div>
        <div class="price-box">
            <div class="price-row">
                <div class="price-row-cell">Volle kilometers</div>
                <div class="price-row-cell right">{{ number_format((float) $quote->estimated_km, 1, ',', '.') }}&nbsp;km × €&nbsp;{{ number_format((float) ($quote->price_per_km ?? 2.5), 2, ',', '.') }}</div>
            </div>
            <div class="price-row">
                <div class="price-row-cell">Lege kilometers</div>
                <div class="price-row-cell right">{{ number_format((float) ($quote->empty_km ?? 0), 1, ',', '.') }}&nbsp;km × €&nbsp;0,50</div>
            </div>
            <hr class="price-divider">
            <div class="price-total-row">
                <div class="price-total-cell">Totaalprijs (excl. BTW)</div>
                <div class="price-total-cell right">€&nbsp;{{ number_format((float) $quote->total_price, 2, ',', '.') }}</div>
            </div>
        </div>
        <p class="valid-notice">* Offerte geldig voor 30 dagen. Prijs is een raming op basis van de opgegeven gegevens.</p>
    </div>

    @if($quote->quote_notes)
    
    <div class="section">
        <div class="section-title">Opmerkingen</div>
        <div class="notes-box">{{ $quote->quote_notes }}</div>
    </div>
    @endif

    
    <div class="signature-section">
        @if($quote->quote_signed_at)
        <div class="signed-box">
            <div class="signed-title">✓ Digitaal ondertekend</div>
            <div class="signed-detail">
                Ondertekend door: {{ $quote->quote_signer_name }}<br>
                Datum: {{ $quote->quote_signed_at->format('d/m/Y H:i') }}<br>
                Methode: {{ $quote->quote_signature_method === 'draw' ? 'Handtekening' : 'Naam' }}
            </div>
        </div>
        @else
        <div class="signature-title">Handtekening voor akkoord</div>
        <div class="signature-grid">
            <div class="sig-col">
                <div class="sig-line"></div>
                <div class="sig-label">Klant: {{ $quote->name }}</div>
            </div>
            <div class="sig-col">
                <div class="sig-line"></div>
                <div class="sig-label">Social Drive</div>
            </div>
        </div>
        @endif
    </div>

    
    <div class="footer">
        <div class="footer-left">Social Drive · info@socialdrive.be · +32 (0) 470 12 34 56</div>
        <div class="footer-right">Offerte #{{ str_pad($quote->id, 5, '0', STR_PAD_LEFT) }}</div>
    </div>

</div>
</body>
</html>
