"use client";

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  /** Уникальный id — на странице бывает несколько форм одновременно. */
  id: string;
}

/**
 * Согласие на обработку персональных данных (152-ФЗ).
 * Согласие должно быть активным действием, поэтому именно галочка,
 * а не строчка «нажимая кнопку, вы соглашаетесь».
 */
export default function ConsentCheckbox({ checked, onChange, id }: ConsentCheckboxProps) {
  return (
    <label htmlFor={id} className="flex items-start gap-2.5 cursor-pointer select-none">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-blue-500 [color-scheme:dark]"
      />
      <span className="text-gray-500 text-xs leading-relaxed">
        Даю{" "}
        {/* stopPropagation — иначе клик по ссылке заодно переключал бы галочку */}
        <a
          href="/consent"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-gray-300 underline underline-offset-2"
        >
          согласие на обработку персональных данных
        </a>{" "}
        и принимаю{" "}
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-gray-300 underline underline-offset-2"
        >
          политику конфиденциальности
        </a>
      </span>
    </label>
  );
}
