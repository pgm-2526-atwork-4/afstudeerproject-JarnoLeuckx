<?php

namespace App\Http\Controllers;

use App\Models\ContactRequest;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class QuotePdfController extends Controller
{
    public function preview(ContactRequest $quote): Response
    {
        $pdf = Pdf::loadView('pdf.quote', ['quote' => $quote])->setPaper('a4');

        return response($pdf->output(), 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="offerte-preview.pdf"',
        ]);
    }

    public function download(ContactRequest $quote): Response
    {
        $pdf = Pdf::loadView('pdf.quote', ['quote' => $quote])->setPaper('a4');
        $filename = 'social-drive-offerte-' . str_pad($quote->id, 5, '0', STR_PAD_LEFT) . '.pdf';

        return response($pdf->output(), 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
