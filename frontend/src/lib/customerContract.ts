import { jsPDF } from "jspdf";
import type { User } from "../auth/auth.api";

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

export async function downloadCustomerContract(user: User) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });

  try {
    const logoDataUrl = await imageUrlToDataUrl("/image/logo.png");
    pdf.addImage(logoDataUrl, "PNG", 15, 12, 34, 20);
  } catch (error) {
    void error;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Social Drive - Klantencontract", 15, 42);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  const customerName = user.name || "-";
  const customerEmail = user.email || "-";
  const customerPhone = user.phone || "-";
  const customerAddress = user.address || "-";
  const customerVaphNumber = user.vaph_number || "-";

  let y = 54;
  const lineHeight = 7;
  const lines = [
    `Naam klant: ${customerName}`,
    `E-mail: ${customerEmail}`,
    `Telefoon: ${customerPhone}`,
    `Adres: ${customerAddress}`,
    `VAPH-nummer: ${customerVaphNumber}`,
    "",
    "Voorwerp:",
    "Dit contract dient als basisdocument voor vervoer via Social Drive.",
    "Ritdetails en prijs worden per aanvraag bevestigd.",
    "",
    "Voorwaarden:",
    "- De klant verstrekt correcte gegevens bij elke reservatie.",
    "- Annulatievoorwaarden worden gecommuniceerd bij boeking.",
    "- Social Drive levert de ritten volgens beschikbaarheid en planning.",
    "",
    "Datum: .......................................................",
    "Handtekening klant: ..........................................",
    "Handtekening Social Drive: ...................................",
  ];

  for (const line of lines) {
    const wrapped = pdf.splitTextToSize(line, 180) as string[];
    for (const wrappedLine of wrapped) {
      pdf.text(wrappedLine, 15, y);
      y += lineHeight;
    }
  }

  const fileName = `social-drive-contract-${
    customerName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") || "klant"
  }.pdf`;

  pdf.save(fileName);
}
