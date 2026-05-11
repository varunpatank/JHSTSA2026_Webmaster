import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await context.params;
  const id = decodeURIComponent(String(rawId || "")).trim().toLowerCase();

  // Restrict IDs to expected filename-safe characters.
  if (!/^[a-z0-9-]+$/.test(id)) {
    return new Response("Invalid resource id", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "resources-pdfs", `${id}.pdf`);

  if (!fs.existsSync(filePath)) {
    const staticUrl = new URL(`/resources-pdfs/${id}.pdf`, _request.url);
    return Response.redirect(staticUrl, 302);
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${id}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
