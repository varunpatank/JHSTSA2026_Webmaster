import { NextRequest } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { RESOURCES } from "@/lib/resourcesData";
import { PDF_CONTENT } from "@/lib/pdfContent";

// ── Text wrapping helper ─────────────────────────────────────────────
function wrapText(text: string, maxWidth: number, fontSize: number, font: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
      cur = test;
    } else {
      if (cur) lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const resource = RESOURCES.find((r) => r.id === id);
  if (!resource) {
    return new Response("Resource not found", { status: 404 });
  }

  // ── Colors ──────────────────────────────────────────────────────────
  const NAVY   = rgb(0.11,  0.208, 0.341); // #1C3557
  const GOLD   = rgb(0.949, 0.780, 0.361); // #F2C75C
  const CREAM  = rgb(0.961, 0.941, 0.910); // #f5f0e8
  const WHITE  = rgb(1,     1,     1);
  const DARK   = rgb(0.15,  0.15,  0.15);
  const MID    = rgb(0.45,  0.45,  0.45);
  const NAVY_LT = rgb(0.88, 0.91,  0.95); // light navy tint for row alt

  // ── Document setup ──────────────────────────────────────────────────
  const pdfDoc = await PDFDocument.create();
  const font     = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const W = 595; // A4 width (pts)
  const H = 842; // A4 height (pts)
  const M = 50;  // margin
  const CW = W - 2 * M; // content width

  const content = PDF_CONTENT[resource.id];

  // ── Helper: add a new content page ──────────────────────────────────
  function addContentPage() {
    const pg = pdfDoc.addPage([W, H]);
    // Top bar
    pg.drawRectangle({ x: 0, y: H - 38, width: W, height: 38, color: NAVY });
    pg.drawRectangle({ x: 0, y: H - 41, width: W, height: 3, color: GOLD });
    const titleTrunc = resource!.title.length > 60 ? resource!.title.slice(0, 57) + "…" : resource!.title;
    pg.drawText(titleTrunc, { x: M, y: H - 26, size: 10, font: boldFont, color: WHITE });
    return pg;
  }

  // ── Helper: draw footer on a page ───────────────────────────────────
  function drawFooter(pg: ReturnType<typeof pdfDoc.getPage>, pageNum: number, total: number) {
    pg.drawRectangle({ x: 0, y: 0, width: W, height: 28, color: CREAM });
    pg.drawLine({ start: { x: 0, y: 28 }, end: { x: W, y: 28 }, thickness: 0.5, color: GOLD });
    pg.drawText("ClubConnect Resource Library", { x: M, y: 9, size: 7, font, color: MID });
    pg.drawText(resource!.title, { x: W / 2 - font.widthOfTextAtSize(resource!.title, 7) / 2, y: 9, size: 7, font, color: MID });
    const pLabel = `Page ${pageNum} of ${total}`;
    pg.drawText(pLabel, { x: W - M - font.widthOfTextAtSize(pLabel, 7), y: 9, size: 7, font, color: MID });
  }

  // ────────────────────────────────────────────────────────────────────
  // PAGE 1 — Cover
  // ────────────────────────────────────────────────────────────────────
  const cover = pdfDoc.addPage([W, H]);

  // Navy header band
  cover.drawRectangle({ x: 0, y: H - 160, width: W, height: 160, color: NAVY });
  cover.drawRectangle({ x: 0, y: H - 163, width: W, height: 3, color: GOLD });

  // ClubConnect label
  cover.drawText("ClubConnect  ·  Resource Library", {
    x: M, y: H - 30, size: 9, font, color: rgb(0.6, 0.75, 0.9),
  });

  // Type pill
  const typeLabel = resource.type.charAt(0).toUpperCase() + resource.type.slice(1);
  const typeW = boldFont.widthOfTextAtSize(typeLabel.toUpperCase(), 8) + 16;
  cover.drawRectangle({ x: M, y: H - 54, width: typeW, height: 16, color: GOLD });
  cover.drawText(typeLabel.toUpperCase(), { x: M + 8, y: H - 50, size: 8, font: boldFont, color: NAVY });

  // Stage pill
  const stageLabel = resource.stage;
  const stageW = font.widthOfTextAtSize(stageLabel, 8) + 16;
  cover.drawRectangle({ x: M + typeW + 6, y: H - 54, width: stageW, height: 16, color: rgb(0.3, 0.5, 0.7) });
  cover.drawText(stageLabel, { x: M + typeW + 14, y: H - 50, size: 8, font, color: WHITE });

  // Title
  const titleFontSize = 24;
  const titleLines = wrapText(resource.title, CW, titleFontSize, boldFont);
  let ty = H - 85;
  for (const line of titleLines) {
    cover.drawText(line, { x: M, y: ty, size: titleFontSize, font: boldFont, color: WHITE });
    ty -= titleFontSize + 8;
  }

  // Details under header
  let dy = H - 185;
  const detailLines = wrapText(resource.details, CW, 11, font);
  for (const line of detailLines) {
    cover.drawText(line, { x: M, y: dy, size: 11, font, color: DARK });
    dy -= 16;
  }

  // Metadata row
  dy -= 10;
  cover.drawLine({ start: { x: M, y: dy }, end: { x: W - M, y: dy }, thickness: 0.5, color: GOLD });
  dy -= 18;
  const meta = [
    { label: "Category", value: resource.category },
    { label: "Stage",    value: resource.stage },
    { label: "Format",   value: resource.format },
    { label: "Downloads", value: resource.downloads.toLocaleString() },
  ];
  let mx = M;
  for (const m of meta) {
    cover.drawText(m.label.toUpperCase(), { x: mx, y: dy + 10, size: 7, font: boldFont, color: MID });
    cover.drawText(m.value, { x: mx, y: dy - 2, size: 10, font: boldFont, color: NAVY });
    mx += CW / meta.length;
  }

  // Tags
  dy -= 30;
  cover.drawText("TAGS", { x: M, y: dy, size: 7, font: boldFont, color: MID });
  dy -= 14;
  let tagX = M;
  for (const tag of resource.tags) {
    const tw = font.widthOfTextAtSize(tag, 8) + 14;
    cover.drawRectangle({ x: tagX, y: dy - 2, width: tw, height: 15, color: NAVY_LT });
    cover.drawText(tag, { x: tagX + 7, y: dy + 2, size: 8, font, color: NAVY });
    tagX += tw + 6;
    if (tagX > W - M - 80) { tagX = M; dy -= 20; }
  }

  // ── Content sections (start on cover page below the fold) ────────────
  let currentPage = cover;
  let currentY = dy - 30;

  if (content) {
    for (let si = 0; si < content.sections.length; si++) {
      const section = content.sections[si];

      // Need new page?
      if (currentY < 120) {
        currentPage = addContentPage();
        currentY = H - 60;
      }

      // Section header bar
      currentPage.drawRectangle({ x: M - 5, y: currentY - 5, width: CW + 10, height: 22, color: NAVY });
      currentPage.drawRectangle({ x: M - 5, y: currentY - 5, width: 4, height: 22, color: GOLD });
      currentPage.drawText(section.title, {
        x: M + 6, y: currentY + 3, size: 11, font: boldFont, color: WHITE,
      });
      currentY -= 30;

      for (let ii = 0; ii < section.items.length; ii++) {
        if (currentY < 80) {
          currentPage = addContentPage();
          currentY = H - 60;
        }

        const item = section.items[ii];
        const isChecklist = resource.type === "checklist";
        const indentX = M + 20;
        const textMaxW = CW - 20;

        if (isChecklist) {
          // Checkbox
          currentPage.drawRectangle({
            x: M + 2, y: currentY - 1, width: 11, height: 11,
            color: WHITE,
            borderColor: NAVY, borderWidth: 1,
          });
        } else {
          // Bullet
          currentPage.drawRectangle({
            x: M + 4, y: currentY + 4, width: 5, height: 5, color: GOLD,
          });
        }

        const wrappedItem = wrapText(item, textMaxW, 10, font);
        for (let wi = 0; wi < wrappedItem.length; wi++) {
          if (currentY < 80) {
            currentPage = addContentPage();
            currentY = H - 60;
          }
          // Alternating row tint
          if (wi === 0 && ii % 2 === 1) {
            currentPage.drawRectangle({
              x: M - 5, y: currentY - 3, width: CW + 10, height: 15,
              color: CREAM,
            });
          }
          currentPage.drawText(wrappedItem[wi], {
            x: wi === 0 ? indentX : indentX + 8,
            y: currentY,
            size: 10, font, color: DARK,
          });
          currentY -= 15;
        }
        currentY -= 3;
      }
      currentY -= 18;
    }
  }

  // ── Footers ──────────────────────────────────────────────────────────
  const pageCount = pdfDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    drawFooter(pdfDoc.getPage(i), i + 1, pageCount);
  }

  const pdfBytes = await pdfDoc.save();
  const filename = resource.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  return new Response(pdfBytes.buffer as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
