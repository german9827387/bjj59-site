import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, readData, writeData } from "@/lib/admin-data";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(readData("settings.json"));
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  writeData("settings.json", body);
  return NextResponse.json({ ok: true });
}
