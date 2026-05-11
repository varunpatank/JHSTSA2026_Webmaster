import fs from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const repoRoot = process.cwd();
const dataPath = path.join(repoRoot, "lib", "resourcesData.ts");
const outputDir = path.join(repoRoot, "public", "resources-pdfs");

const source = fs.readFileSync(dataPath, "utf8");
const resourceRegex = /\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g;
const resources = [];

for (const match of source.matchAll(resourceRegex)) {
  resources.push({ id: match[1], title: match[2] });
}

if (!resources.length) {
  throw new Error("No resources found in resourcesData.ts");
}

fs.mkdirSync(outputDir, { recursive: true });

for (const resource of resources) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({ x: 0, y: 732, width: 612, height: 60, color: rgb(0.11, 0.21, 0.34) });
  page.drawText("ClubConnect Resource", {
    x: 40,
    y: 754,
    size: 18,
    font: bold,
    color: rgb(0.95, 0.78, 0.36),
  });

  page.drawText(resource.title, {
    x: 40,
    y: 680,
    size: 24,
    font: bold,
    color: rgb(0.11, 0.21, 0.34),
    maxWidth: 532,
  });

  page.drawText(`Resource ID: ${resource.id}`, {
    x: 40,
    y: 650,
    size: 12,
    font,
    color: rgb(0.25, 0.31, 0.39),
  });

  page.drawText("This file is part of ClubConnect's downloadable resource library.", {
    x: 40,
    y: 616,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText("Use this resource to support planning, recruiting, and leadership goals.", {
    x: 40,
    y: 596,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText("Generated automatically for web download access.", {
    x: 40,
    y: 576,
    size: 11,
    font,
    color: rgb(0.45, 0.45, 0.45),
  });

  const bytes = await pdfDoc.save();
  fs.writeFileSync(path.join(outputDir, `${resource.id}.pdf`), bytes);
}

console.log(`Generated ${resources.length} PDFs in ${outputDir}`);
