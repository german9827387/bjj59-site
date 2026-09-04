import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OPERATOR, LEGAL_REVISION } from "@/lib/legal";

/** Общая обёртка юридических страниц: шапка, «На главную», блок реквизитов, дата редакции. */
export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> На главную
        </Link>
        <h1 className="text-3xl font-black text-white mb-2">{title}</h1>
        <p className="text-gray-600 text-xs mb-8">Редакция от {LEGAL_REVISION}</p>
        <div className="text-gray-400 space-y-4 text-sm leading-relaxed [&_h2]:text-white [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:text-base [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Реквизиты — одинаковый блок в конце каждого документа. */
export function OperatorRequisites({ heading }: { heading: string }) {
  return (
    <>
      <h2>{heading}</h2>
      <p>
        {OPERATOR.fullName}
        <br />
        ИНН {OPERATOR.inn}
        {OPERATOR.ogrnip && (
          <>
            <br />
            ОГРНИП {OPERATOR.ogrnip}
          </>
        )}
        <br />
        Адрес: {OPERATOR.address}
        <br />
        Телефон: <a href={OPERATOR.phoneLink}>{OPERATOR.phone}</a>
        <br />
        Электронная почта: <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
        <br />
        Сайт: https://www.{OPERATOR.site}
      </p>
    </>
  );
}
