import NewsGrid, { VkPost } from './NewsGrid';

async function getPosts(): Promise<VkPost[]> {
  const token = process.env.VK_TOKEN;
  const groupId = process.env.VK_GROUP_ID;
  if (!token || !groupId) return [];

  try {
    const res = await fetch(
      `https://api.vk.com/method/wall.get?owner_id=${groupId}&count=10&filter=owner&v=5.131&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (data.error) return [];

    return (data.response?.items ?? [])
      .filter((p: any) => p.text?.trim())
      .filter((p: any) => (p.attachments ?? []).some((a: any) => a.type === 'photo'))
      .slice(0, 3)
      .map((p: any) => {
        const attachments: any[] = p.attachments ?? [];
        const photos = attachments
          .filter((a) => a.type === 'photo')
          .map((a) => {
            const sizes: any[] = a.photo?.sizes ?? [];
            const img = sizes.find((s: any) => s.type === 'x') ?? sizes.find((s: any) => s.type === 'r') ?? sizes[sizes.length - 1];
            return img?.url ?? null;
          })
          .filter(Boolean) as string[];
        return { id: p.id, text: p.text, date: p.date, photos };      });
  } catch {
    return [];
  }
}

export default async function News() {
  const posts = await getPosts();
  if (!posts.length) return null;
  return (
    <section className="relative py-20 lg:py-28 bg-[#080808] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(59,130,246,0.07),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
            Наши{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">новости</span>
          </h2>
        </div>
        <NewsGrid posts={posts} />
      </div>
    </section>
  );
}