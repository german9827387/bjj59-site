import Image from "next/image";
import Reveal from "./Reveal";

const photos = [
  { src: "/gym1.jpg", alt: "Зал BGS Academy — вид 1",  objPos: "center center" },
  { src: "/gym2.jpg", alt: "Зал BGS Academy — вид 2",  objPos: "center bottom" },
  { src: "/gym3.jpg", alt: "Зал BGS Academy — вид 3",  objPos: "center center" },
  { src: "/gym4.jpg", alt: "Зал BGS Academy — вид 4",  objPos: "center center" },
  { src: "/gym5.jpg", alt: "Зал BGS Academy — вид 5",  objPos: "center center" },
  { src: "/gym6.jpg", alt: "Зал BGS Academy — вид 6",  objPos: "center center" },
  { src: "/gym7.jpg", alt: "Зал BGS Academy — вид 7",  objPos: "center center" },
];

function GymPhoto({ photo, className = "", delay = 0 }: { photo: { src: string; alt: string; objPos?: string }; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={`h-full ${className}`}>
      <div className="relative w-full h-full rounded-2xl overflow-hidden group">
        {/* Само фото */}
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ filter: "brightness(0.82) saturate(0.75)", objectPosition: photo.objPos ?? "center center" }}
          sizes="(max-width: 768px) 288px, (max-width: 1280px) 50vw, 33vw"
          loading="lazy"
        />
        {/* Синий цветовой overlay — даёт сайтовую гамму */}
        <div className="absolute inset-0 bg-blue-950/25 mix-blend-multiply pointer-events-none" />
        {/* Нижний fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>
    </Reveal>
  );
}

export default function GymGallery() {
  return (
    <section className="relative py-12 lg:py-16 bg-[#0a0a0a] overflow-hidden">
      {/* Фоновые градиенты — в стиле остальных секций */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0d1525] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0a0a0a] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(59,130,246,0.06),transparent)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <Reveal>
          <div className="text-center mb-10">
            <span className="text-blue-500 text-xs font-medium uppercase tracking-widest">
              Инфраструктура
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Наш{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                зал
              </span>
            </h2>
            <p className="text-gray-400 mt-3 text-base max-w-xl mx-auto">
              Современное оборудование, татами и ринг — всё для качественных тренировок
            </p>
          </div>
        </Reveal>

        {/* Мобилка — горизонтальный snap-скролл */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none">
            {photos.map((photo, i) => (
              <div key={i} className="flex-none w-72 h-52 snap-center">
                <GymPhoto photo={photo} delay={i * 60} />
              </div>
            ))}
          </div>
        </div>

        {/* Десктоп — асимметричная сетка */}
        {/* Левое фото шире (col-span-2), правые два — в стопку */}
        <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-3 h-[520px]">
          {/* Фото 1 — широкое и высокое, 2/3 ширины и 2 строки */}
          <div className="col-span-2 row-span-2">
            <GymPhoto photo={photos[0]} delay={0} className="h-full" />
          </div>
          {/* Фото 2 — верхнее правое, objectPosition: bottom чтобы был виден ресепшн */}
          <div className="col-span-1 row-span-1">
            <GymPhoto photo={photos[1]} delay={80} className="h-full" />
          </div>
          {/* Фото 3 — нижнее правое */}
          <div className="col-span-1 row-span-1">
            <GymPhoto photo={photos[2]} delay={140} className="h-full" />
          </div>
        </div>

        {/* Десктоп — нижняя строка (фото 4–7), 4 равных блока */}
        <div className="hidden md:grid grid-cols-4 gap-3 mt-3 h-[210px]">
          {photos.slice(3).map((photo, i) => (
            <div key={i} className="col-span-1">
              <GymPhoto photo={photo} delay={200 + i * 60} className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
