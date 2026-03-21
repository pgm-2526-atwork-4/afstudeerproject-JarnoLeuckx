import jsPDF from "jspdf";
import type { CustomerQuote } from "./quote.api";

async function imageUrlToDataUrl(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Kon logo niet laden."));
      }
    };
    reader.onerror = () => reject(new Error("Kon logo niet laden."));
    reader.readAsDataURL(blob);
  });
}

function fmtDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("nl-BE");
}

function fmtMoney(val: string | null): string {
  if (!val) return "-";
  return `€ ${parseFloat(val).toFixed(2).replace(".", ",")}`;
}

type SignatureData = {
  method: "name" | "draw";
  signerName: string;
  signerDate: string;
  signedAt: string;
  drawnSignatureDataUrl?: string;
};

export async function generateOfferPdf(
  quote: CustomerQuote,
  signature?: SignatureData,
) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  try {
    const logoDataUrl = await imageUrlToDataUrl("/image/logo.png");
    try {
      pdf.addImage(logoDataUrl, "PNG", 15, 12, 34, 20);
    } catch {
      // Fout bij toevoegen van logo, ga verder zonder logo
    }
  } catch {
    // Logo kon niet geladen worden, verder gaan zonder logo
  }
  // Titel en samenvatting
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("SOCIAL DRIVE – OFFERTE", 15, 42);
  const createdAtDate =
    quote.quote_sent_at?.substring(0, 10) ??
    quote.created_at?.substring(0, 10) ??
    null;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(
    `Offerte nr. ${String(quote.id).padStart(5, "0")} | Opgemaakt op: ${fmtDate(createdAtDate)}`,
    15,
    49,
  );
  pdf.setTextColor(30, 41, 59);
  let y = 58;
  const lh = 7;
  const line = (label: string, value: string) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text(label, 15, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(value, 75, y);
    y += lh;
  };
  // 1. Klantgegevens
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0, 67, 168);
  pdf.text("1. KLANTGEGEVENS", 15, y);
  pdf.setTextColor(30, 41, 59);
  y += 2;
  pdf.setDrawColor(0, 67, 168);
  pdf.setLineWidth(0.3);
  pdf.line(15, y, 195, y);
  y += 5;
  line("Naam", signature?.signerName ?? "-");
  y += 4;
  // 2. Ritdetails
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0, 67, 168);
  pdf.text("2. RITDETAILS", 15, y);
  pdf.setTextColor(30, 41, 59);
  y += 2;
  pdf.line(15, y, 195, y);
  y += 5;
  line("Ophaallocatie", quote.pickup_address ?? "-");
  line("Bestemming", quote.dropoff_address ?? "-");
  line("Reisdatum", fmtDate(quote.travel_date));
  line("Dienst", quote.service_type ? ucfirst(quote.service_type) : "-");
  if (quote.passengers) {
    line("Passagiers", String(quote.passengers));
  }
  line("Retourrit", quote.return_trip ? "Ja" : "Nee");
  y += 4;
  // 3. Prijsberekening
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0, 67, 168);
  pdf.text("3. PRIJSBEREKENING", 15, y);
  pdf.setTextColor(30, 41, 59);
  y += 2;
  pdf.line(15, y, 195, y);
  y += 5;
  pdf.setFillColor(239, 246, 255);
  pdf.setDrawColor(0, 67, 168);
  pdf.roundedRect(15, y - 2, 180, 35, 2, 2, "FD");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("Volle kilometers:", 20, y + 5);
  pdf.text(
    `${parseFloat(quote.estimated_km ?? "0")
      .toFixed(1)
      .replace(".", ",")} km x ${fmtMoney(quote.price_per_km ?? "2.50")}`,
    140,
    y + 5,
  );
  pdf.text("Lege kilometers:", 20, y + 19);
  pdf.text(
    `${parseFloat(quote.empty_km ?? "0")
      .toFixed(1)
      .replace(".", ",")} km x € 0,50`,
    140,
    y + 19,
  );
  pdf.setDrawColor(191, 219, 254);
  pdf.line(20, y + 22, 192, y + 22);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(0, 67, 168);
  pdf.text("Totaalprijs (excl. BTW):", 20, y + 29);
  pdf.text(fmtMoney(quote.total_price), 140, y + 29);
  pdf.setTextColor(30, 41, 59);
  y += 41;
  // 4. Opmerkingen
  if (quote.quote_notes) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(0, 67, 168);
    pdf.text("4. OPMERKINGEN", 15, y);
    pdf.setTextColor(30, 41, 59);
    y += 2;
    pdf.line(15, y, 195, y);
    y += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const wrapped = pdf.splitTextToSize(quote.quote_notes, 180) as string[];
    for (const wLine of wrapped) {
      pdf.text(wLine, 15, y);
      y += lh;
    }
    y += 4;
  }
  // 5. Voorwaarden
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0, 67, 168);
  pdf.text("5. VOORWAARDEN EN INFORMATIE", 15, y);
  pdf.setTextColor(30, 41, 59);
  y += 2;
  pdf.line(15, y, 195, y);
  y += 5;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(100);
  pdf.text(
    "Deze offerte is 30 dagen geldig. De prijs is een raming op basis van de opgegeven gegevens. Annulatievoorwaarden worden bij reservatie bevestigd. Voor vragen: info@socialdrive.be.",
    15,
    y,
  );
  pdf.setTextColor(30, 41, 59);
  y += 8;
  if (quote.quote_notes) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(0, 67, 168);
    pdf.text("OPMERKINGEN", 15, y);
    pdf.setTextColor(30, 41, 59);
    y += 2;
    pdf.line(15, y, 195, y);
    y += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const wrapped = pdf.splitTextToSize(quote.quote_notes, 180) as string[];
    for (const wLine of wrapped) {
      pdf.text(wLine, 15, y);
      y += lh;
    }
    y += 4;
  }
  if (signature) {
    pdf.setDrawColor(16, 185, 129);
    pdf.setFillColor(240, 253, 244);
    pdf.roundedRect(
      15,
      y,
      180,
      signature.method === "draw" ? 36 : 28,
      2,
      2,
      "FD",
    );
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(6, 95, 70);
    pdf.text("✓ Digitaal ondertekend", 20, y + 8);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(6, 78, 59);
    pdf.text(`Ondertekend op: ${signature.signedAt}`, 20, y + 16);
    pdf.text(`Ondertekend door: ${signature.signerName}`, 20, y + 22);
    if (signature.method === "draw" && signature.drawnSignatureDataUrl) {
      try {
        pdf.addImage(
          signature.drawnSignatureDataUrl,
          "PNG",
          120,
          y + 8,
          65,
          20,
        );
      } catch (err) {
        console.warn("Kon getekende handtekening niet toevoegen aan PDF:", err);
      }
    }
    pdf.setTextColor(30, 41, 59);
    y += 42;
  } else {
    pdf.setDrawColor(203, 213, 225);
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(15, y, 180, 30, 2, 2, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Handtekening voor akkoord", 20, y + 8);
    pdf.setFont("helvetica", "normal");
    pdf.line(20, y + 24, 100, y + 24);
    pdf.line(110, y + 24, 190, y + 24);
    pdf.setFontSize(9);
    pdf.setTextColor(100);
    pdf.text("Klant", 20, y + 29);
    pdf.text("Social Drive", 110, y + 29);
    pdf.setTextColor(30, 41, 59);
    y += 36;
  }
  pdf.setFontSize(9);
  pdf.setTextColor(148, 163, 184);
  pdf.text(
    `Social Drive · info@socialdrive.be · +32 (0) 470 12 34 56 · Offerte #${String(quote.id).padStart(5, "0")}`,
    15,
    285,
  );
  pdf.save(
    `social-drive-offerte-${String(quote.id).padStart(5, "0")}${signature ? "-ondertekend" : ""}.pdf`,
  );
}

export function ucfirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
