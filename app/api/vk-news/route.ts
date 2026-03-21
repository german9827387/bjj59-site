import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.VK_TOKEN;
  const groupId = process.env.VK_GROUP_ID;

  if (!token || !groupId) {
    return NextResponse.json({ posts: [] });
  }

  try {
    const res = await fetch(
      `https://api.vk.com/method/wall.get?owner_id=${encodeURIComponent(groupId)}&count=3&filter=owner&v=5.131&access_token=${encodeURIComponent(token)}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ posts: [] });
    }

    const posts = (data.response?.items ?? [])
      .filter((p: any) => p.text?.trim())
      .map((p: any) => {
        const photo = p.attachments?.find((a: any) => a.type === "photo");
        const sizes: any[] = photo?.photo?.sizes ?? [];
        const img =
          sizes.find((s) => s.type === "x") ??
          sizes.find((s) => s.type === "r") ??
          sizes[sizes.length - 1];
        return {
          id: p.id,
          text: p.text,
          date: p.date,
          photo: img?.url ?? null,
        };
      });

    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}
