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
  await generateContractPdf(user);
}

export async function downloadSignedCustomerContract(
  user: User,
  signature: {
    method: "name" | "draw";
    signerName: string;
    signerDate: string;
    drawnSignatureDataUrl?: string;
  },
) {
  await generateContractPdf(user, {
    method: signature.method,
    signerName: signature.signerName,
    signerDate: signature.signerDate,
    drawnSignatureDataUrl: signature.drawnSignatureDataUrl,
    signedAt: `${formatDateForDisplay(signature.signerDate)} ${new Date().toLocaleTimeString(
      "nl-BE",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    )}`,
  });
}

type SignatureData = {
  method: "name" | "draw";
  signerName: string;
  signerDate: string;
  signedAt: string;
  drawnSignatureDataUrl?: string;
};

function formatDateForDisplay(dateString: string) {
  const parsed = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleDateString("nl-BE");
}

async function generateContractPdf(user: User, signature?: SignatureData) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });

  try {
    const logoDataUrl = await imageUrlToDataUrl("/image/logo.png");
    pdf.addImage(logoDataUrl, "PNG", 15, 12, 34, 20);
  } catch (error) {
    void error;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Social Drive - PVB Klantencontract", 15, 42);

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
    "Dit PVB-contract dient als basisdocument voor vervoer via Social Drive.",
    "Ritdetails en prijs worden per aanvraag bevestigd.",
    "",
    "Voorwaarden:",
    "- De klant verstrekt correcte gegevens bij elke reservatie.",
    "- Annulatievoorwaarden worden gecommuniceerd bij boeking.",
    "- Social Drive levert de ritten volgens beschikbaarheid en planning.",
    "",
    `Datum: ${signature ? formatDateForDisplay(signature.signerDate) : "......................................................."}`,
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

  if (signature) {
    pdf.setDrawColor(16, 185, 129);
    pdf.roundedRect(15, y + 4, 180, 32, 2, 2);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Digitaal ondertekend", 20, y + 12);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`Ondertekend op: ${signature.signedAt}`, 20, y + 18);

    if (signature.method === "name") {
      pdf.text(`Ondertekend door (naam): ${signature.signerName}`, 20, y + 24);
    } else {
      pdf.text(
        `Ondertekend door (tekening): ${signature.signerName}`,
        20,
        y + 24,
      );

      if (signature.drawnSignatureDataUrl) {
        try {
          pdf.addImage(
            signature.drawnSignatureDataUrl,
            "PNG",
            120,
            y + 9,
            65,
            20,
          );
        } catch (error) {
          void error;
        }
      }
    }
  }

  const safeName =
    customerName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") || "klant";

  pdf.save(
    `${signature ? "social-drive-pvb-contract-ondertekend" : "social-drive-pvb-contract"}-${safeName}.pdf`,
  );
}
