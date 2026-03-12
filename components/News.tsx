import NewsGrid, { VkPost } from './NewsGrid';

async function getPosts(): Promise<VkPost[]> {
  const token = process.env.VK_TOKEN;
  const groupId = process.env.VK_GROUP_ID;
  if (!token || !groupId) return [];

  try {
    const res = await fetch(
      `https://api.vk.com/method/wall.get?owner_id=${groupId}&count=3&filter=owner&v=5.131&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (data.error) return [];

    return (data.response?.items ?? [])
      .filter((p: any) => p.text?.trim())
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
        const videoAtt = attachments.find((a) => a.type === 'video');
        let video: VkPost['video'] = null;
        if (videoAtt?.video) {
          const thumbs: any[] = videoAtt.video.image ?? [];
          const thumb = thumbs[thumbs.length - 1];
          video = { ownerId: videoAtt.video.owner_id, id: videoAtt.video.id, thumb: thumb?.url ?? null, player: videoAtt.video.player ?? null };
        }
        return { id: p.id, text: p.text, date: p.date, photos, video };
      });
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
          <span className="text-blue-500 text-xs font-medium uppercase tracking-widest">ВКонтакте</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
            Наши{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">новости</span>
          </h2>
        </div>
        <NewsGrid posts={posts} />
        <div className="text-center mt-10">
          <a href="https://vk.com/bjjperm59" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-sm font-semibold px-6 py-3 rounded-full transition-all">
            Все новости ВКонтакте →
          </a>
        </div>
      </div>
    </section>
  );
}