import Image from "next/image";
import Link from "next/link";

interface VkPost {
  id: number;
  text: string;
  date: number;
  photo: string | null;
}

async function getPosts(): Promise<VkPost[]> {
  try {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/vk-news`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.posts ?? [];
  } catch {
    return [];
  }
}

function formatDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-blue-500 text-xs font-medium uppercase tracking-widest">
            ВКонтакте
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
            Наши{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              новости
            </span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`https://vk.com/bjjperm59?w=wall-49474271_${post.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col rounded-2xl overflow-hidden border border-white/[0.06] bg-[#111827] hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-950/30 transition-all duration-300${
                i === 4 ? " sm:col-start-2 lg:col-start-auto" : ""
              }`}
            >
              {post.photo && (
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={post.photo}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="flex flex-col flex-1 p-5">
                <span className="text-blue-500 text-xs font-medium mb-2">
                  {formatDate(post.date)}
                </span>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 flex-1">
                  {post.text}
                </p>
                <span className="mt-4 text-blue-400 text-xs font-semibold group-hover:text-blue-300 transition-colors">
                  Читать в ВКонтакте →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Link to full group */}
        <div className="text-center mt-10">
          <Link
            href="https://vk.com/bjjperm59"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-sm font-semibold px-6 py-3 rounded-full transition-all"
          >
            Все новости ВКонтакте →
          </Link>
        </div>
      </div>
    </section>
  );
}
