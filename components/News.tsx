import NewsGrid, { VkPost } from './NewsGrid';
import { pickPhotoUrl, type VkWallResponse } from '@/lib/vk';

async function getPosts(): Promise<VkPost[]> {
  const token = process.env.VK_TOKEN;
  const groupId = process.env.VK_GROUP_ID;
  if (!token || !groupId) return [];

  try {
    const res = await fetch(
      `https://api.vk.com/method/wall.get?owner_id=${groupId}&count=6&filter=owner&v=5.131&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );
    const data: VkWallResponse = await res.json();
    if (data.error) {
      console.error('[News] VK API error:', data.error);
      return [];
    }

    return (data.response?.items ?? [])
      .filter((p) => p.text?.trim())
      .filter((p) => (p.attachments ?? []).some((a) => a.type === 'photo'))
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        text: p.text ?? '',
        date: p.date,
        photos: (p.attachments ?? [])
          .filter((a) => a.type === 'photo')
          .map(pickPhotoUrl)
          .filter((u): u is string => Boolean(u)),
      }));
  } catch (e) {
    console.error('[News] fetch error:', e);
    return [];
  }
}

export default async function News() {
  const posts = await getPosts();
  if (!posts.length) return null;
  return (
    <section className="relative py-20 lg:py-28 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(59,130,246,0.07),transparent)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-[#3B82F6] text-xs font-semibold uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 rounded-md px-4 py-1.5 mb-4">
            Жизнь академии
          </span>
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