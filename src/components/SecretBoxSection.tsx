import React from 'react';
import {motion, useReducedMotion} from 'motion/react';
import {LockOpen, PenLine} from 'lucide-react';

interface SecretBoxSectionProps {
  girlfriendName: string;
  hasOpenedOnce: boolean;
  onOpenBox: () => void;
  onOpenPersonalize: () => void;
}

export const SecretBoxSection: React.FC<SecretBoxSectionProps> = ({
  girlfriendName,
  hasOpenedOnce,
  onOpenBox,
  onOpenPersonalize,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="secret-box"
      className="relative py-24 sm:py-32 border-t border-[#F4EFE8]/10 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left editorial copy */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs font-medium tracking-widest text-[#E2B49A]">
              Нууц хайрцаг 🖤 · Зөвхөн чамд хадгалсан үгс
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[#FBF7F0] leading-[1.12] [text-wrap:balance]">
              Гэрэлтэх хар хайрцаг дотор юу нуугдаж байгаа бол?
            </h2>
            <p className="text-base leading-relaxed text-[#C9BEB2] max-w-xl">
              {girlfriendName}, зуун шалтгаанаас гадна яг одоо зөвхөн чиний л унших
              ёстой зүрхний үгс, цохилох зүрх, бас чамд зориулж бичсэн захидал
              энэ гэрэлтэх нууц хайрцагт хадгалагдаж байгаа. Хайрцаг дээр дарж
              нээгээрэй.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenBox}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[#D63353] hover:bg-[#BE2745] text-sm font-medium text-[#FBF7F0] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B49A]"
              >
                <LockOpen className="w-4 h-4" />
                <span>
                  {hasOpenedOnce
                    ? 'Нууц хайрцгийг дахин нээх'
                    : 'Нууц хайрцгийг нээх'}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenPersonalize}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-[#F4EFE8]/15 hover:border-[#E2B49A]/50 text-sm font-medium text-[#E8DFD5] hover:text-[#FBF7F0] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B49A]"
              >
                <PenLine className="w-4 h-4 text-[#E2B49A]" />
                <span>Захидлаа бичих / засах</span>
              </button>
            </div>
          </div>

          {/* Right glowing interactive black velvet box */}
          <div className="lg:col-span-6 flex items-center justify-center py-6">
            <motion.button
              type="button"
              onClick={onOpenBox}
              aria-label="Гэрэлтэх Нууц хайрцгийг нээх"
              whileHover={shouldReduceMotion ? undefined : {scale: 1.03, y: -4}}
              whileTap={shouldReduceMotion ? undefined : {scale: 0.98}}
              transition={{duration: 0.25, ease: [0.16, 1, 0.3, 1]}}
              className="group relative w-full max-w-[380px] aspect-[4/3] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B49A] rounded-2xl"
            >
              {/* Multi-layered luminous warm golden-crimson glow */}
              <div
                aria-hidden="true"
                className="animate-secret-glow absolute -inset-6 rounded-full bg-radial from-[#E2B49A]/35 via-[#D63353]/22 to-transparent blur-3xl pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="animate-secret-glow absolute inset-4 rounded-3xl bg-radial from-[#FFD5A5]/25 via-[#D63353]/18 to-transparent blur-xl pointer-events-none"
              />

              {/* Sculpted Obsidian Velvet Box */}
              <div className="relative w-72 sm:w-80 h-56 sm:h-60 rounded-2xl border border-[#E2B49A]/35 bg-gradient-to-b from-[#1B141D] via-[#100C12] to-[#080609] shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_45px_rgba(214,51,83,0.28)] overflow-hidden transition-shadow duration-300 group-hover:shadow-[0_28px_70px_rgba(0,0,0,0.9),0_0_65px_rgba(226,180,154,0.42)]">
                {/* Top velvet lid */}
                <div className="relative h-[44%] w-full bg-gradient-to-b from-[#231926] to-[#130E15] border-b border-[#E2B49A]/40 flex flex-col items-center justify-center px-6">
                  {/* Subtle velvet sheen */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#FBF7F0]/[0.04] to-[#E2B49A]/[0.09] pointer-events-none"
                  />
                  <span className="relative font-display text-lg sm:text-xl italic tracking-wide text-[#E2B49A] group-hover:text-[#FBF7F0] transition-colors">
                    Нууц хайрцаг 🖤
                  </span>
                </div>

                {/* Glowing light seam between lid and base */}
                <div
                  aria-hidden="true"
                  className="animate-seam-pulse relative h-[3px] w-full bg-gradient-to-r from-transparent via-[#FFE1BA] to-transparent shadow-[0_0_18px_3px_rgba(255,213,165,0.7)]"
                />

                {/* Brass & Crimson Heart Clasp */}
                <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-b from-[#2B2026] to-[#120D11] border border-[#E2B49A]/70 shadow-[0_0_20px_rgba(226,180,154,0.5)] group-hover:scale-110 transition-transform duration-200">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-[#D63353] drop-shadow-[0_0_8px_rgba(214,51,83,0.8)]"
                    aria-hidden="true"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>

                {/* Lower velvet body */}
                <div className="relative h-[56%] w-full flex flex-col items-center justify-center px-6 pt-4 text-center">
                  {/* Light spilling downward from seam */}
                  <div
                    aria-hidden="true"
                    className="absolute top-0 inset-x-6 h-12 bg-gradient-to-b from-[#E2B49A]/15 to-transparent pointer-events-none"
                  />
                  <p className="relative text-xs tracking-wider text-[#E2B49A]/90 font-medium">
                    Дараад доторхыг нь нээгээрэй
                  </p>
                  <p className="relative mt-1.5 text-[13px] text-[#B8ADA1]">
                    Хөдөлгөөнт зүрх · Зүрхний үг · Захидал
                  </p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
