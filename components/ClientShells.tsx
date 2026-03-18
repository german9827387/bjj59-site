"use client";
import dynamic from "next/dynamic";

// ExitPopup и MobileCTA — тяжёлые, не нужны при SSR
// ssr: false здесь валиден т.к. это "use client" компонент
const MobileCTA = dynamic(() => import("@/components/MobileCTA"), { ssr: false });
const ExitPopup = dynamic(() => import("@/components/ExitPopup"), { ssr: false });

export function ClientShells() {
  return (
    <>
      <MobileCTA />
      <ExitPopup />
    </>
  );
}
