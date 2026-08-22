import { NextResponse } from "next/server";
import { pickPhotoUrl, type VkWallResponse } from "@/lib/vk";

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
    const data: VkWallResponse = await res.json();

    if (data.error) {
      return NextResponse.json({ posts: [] });
    }

    const posts = (data.response?.items ?? [])
      .filter((p) => p.text?.trim())
      .map((p) => {
        const photo = p.attachments?.find((a) => a.type === "photo");
        return {
          id: p.id,
          text: p.text ?? "",
          date: p.date,
          photo: photo ? pickPhotoUrl(photo) : null,
        };
      });

    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}
