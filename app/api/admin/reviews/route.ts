import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, readData, writeData } from "@/lib/admin-data";

const FILE = "reviews.json";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await readData(FILE));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }
  try {
    await writeData(FILE, body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    // Ошибка должна дойти до экрана: раньше кнопка показывала «Сохранено ✓»,
    // что бы ни случилось.
    console.error("[admin] save failed:", FILE, (e as Error).message);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
