import React from 'react';

interface NavbarProps {
  onOpenSecretBox: () => void;
  onOpenPersonalize: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSecretBox,
  onOpenPersonalize,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#F4EFE8]/10 bg-[#0A080B]/88 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        <a
          href="#top"
          className="font-display text-2xl font-semibold tracking-tight text-[#FBF7F0] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B49A] rounded"
        >
          Зуун Шалтгаан
        </a>

        <nav
          aria-label="Үндсэн цэс"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#BFB5AA]"
        >
          <a
            href="#featured"
            className="hover:text-[#FBF7F0] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            Онцлох мөр
          </a>
          <a
            href="#reasons"
            className="hover:text-[#FBF7F0] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            100 Шалтгаан
          </a>
          <a
            href="#secret-box"
            className="hover:text-[#FBF7F0] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            Нууц Хайрцаг
          </a>
          <button
            type="button"
            onClick={onOpenPersonalize}
            className="hover:text-[#FBF7F0] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Үг засах
          </button>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenSecretBox}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-[#FBF7F0] bg-[#D63353] hover:bg-[#BE2745] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B49A]"
          >
            Хайрцаг нээх
          </button>
        </div>
      </div>
    </header>
  );
};
