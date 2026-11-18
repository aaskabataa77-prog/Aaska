import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {PenLine, RotateCcw, X} from 'lucide-react';
import {GiftConfig} from '../data/reasons';
import {GlowingHeart} from './GlowingHeart';

interface SecretBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftConfig: GiftConfig;
  onOpenPersonalize: () => void;
}

export const SecretBoxModal: React.FC<SecretBoxModalProps> = ({
  isOpen,
  onClose,
  giftConfig,
  onOpenPersonalize,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [revealKey, setRevealKey] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleReplay = () => {
    setRevealKey((prev) => prev + 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="secret-box-dialog-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.25}}
            onClick={onClose}
            className="fixed inset-0 bg-[#050406]/90 backdrop-blur-md"
          />

          {/* Modal Frame */}
          <motion.div
            key={revealKey}
            initial={
              shouldReduceMotion
                ? {opacity: 0}
                : {opacity: 0, scale: 0.94, y: 18}
            }
            animate={
              shouldReduceMotion
                ? {opacity: 1}
                : {opacity: 1, scale: 1, y: 0}
            }
            exit={
              shouldReduceMotion
                ? {opacity: 0}
                : {opacity: 0, scale: 0.96, y: 12}
            }
            transition={{duration: 0.35, ease: [0.16, 1, 0.3, 1]}}
            className="relative z-10 my-auto w-full max-w-3xl rounded-2xl border border-[#E2B49A]/25 bg-[#110D13] shadow-[0_32px_90px_rgba(0,0,0,0.9),0_0_70px_rgba(214,51,83,0.22)] overflow-hidden"
          >
            {/* Top Modal Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-[#F4EFE8]/10 px-6 py-4 bg-[#161119]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-display text-xl font-semibold text-[#E2B49A] truncate">
                  Нууц хайрцаг 🖤
                </span>
                <span className="hidden sm:inline text-xs text-[#9E9388]">
                  · Зүрхний үг ба захидал
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleReplay}
                  title="Хөдөлгөөнт нээлтийг дахин тоглуулах"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#D1C7BC] hover:text-[#FBF7F0] hover:bg-[#F4EFE8]/10 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Дахин нээх</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPersonalize();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#E2B49A] hover:text-[#FBF7F0] hover:bg-[#F4EFE8]/10 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  <span>Засах</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Хаах"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#BFB5AA] hover:text-[#FBF7F0] hover:bg-[#F4EFE8]/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="max-h-[82vh] overflow-y-auto px-6 sm:px-10 py-8 sm:py-10 space-y-10">
              {/* Part 1: Animated Heart & Written Whispered Words */}
              <div className="flex flex-col items-center text-center space-y-6">
                <motion.div
                  initial={
                    shouldReduceMotion ? {opacity: 0} : {opacity: 0, scale: 0.7}
                  }
                  animate={
                    shouldReduceMotion ? {opacity: 1} : {opacity: 1, scale: 1}
                  }
                  transition={{
                    delay: 0.12,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="pt-2"
                >
                  <GlowingHeart size="lg" />
                </motion.div>

                <motion.div
                  initial={shouldReduceMotion ? {opacity: 0} : {opacity: 0, y: 12}}
                  animate={shouldReduceMotion ? {opacity: 1} : {opacity: 1, y: 0}}
                  transition={{delay: 0.3, duration: 0.5}}
                  className="space-y-3 max-w-xl"
                >
                  <p className="text-xs font-medium tracking-widest text-[#E2B49A]">
                    Зөвхөн {giftConfig.girlfriendName}-д зориулж бичсэн үг
                  </p>
                  <blockquote
                    id="secret-box-dialog-title"
                    className="font-display text-2xl sm:text-3xl italic font-medium leading-snug text-[#FBF7F0] [text-wrap:balance]"
                  >
                    «{giftConfig.secretWhisper}»
                  </blockquote>
                </motion.div>
              </div>

              {/* Subtle Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E2B49A]/30 to-transparent" />

              {/* Part 2: Unfolding Love Letter on Warm Ivory Parchment */}
              <motion.article
                initial={
                  shouldReduceMotion
                    ? {opacity: 0}
                    : {opacity: 0, y: 24}
                }
                animate={
                  shouldReduceMotion
                    ? {opacity: 1}
                    : {opacity: 1, y: 0}
                }
                transition={{
                  delay: 0.45,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-xl bg-[#FBF7F0] text-[#24191E] shadow-[0_18px_50px_rgba(0,0,0,0.55)] overflow-hidden border border-[#E6DACB]"
              >
                {/* Letter Header Artwork Banner */}
                <div className="relative h-40 sm:h-48 w-full bg-[#1C1418] overflow-hidden">
                  {!imgFailed ? (
                    <img
                      src="/src/assets/images/letter_wax_seal_1794999482763.jpg"
                      alt="Лаан тамгатай хайрын захидал"
                      referrerPolicy="no-referrer"
                      onError={() => setImgFailed(true)}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2B171E] via-[#1B1115] to-[#120C0F]" />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#181014]/85 via-[#181014]/35 to-transparent"
                  />
                  <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="text-xs tracking-wider text-[#E8C1A0]">
                        {giftConfig.letterDate}
                      </p>
                      <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#FBF7F0] mt-0.5">
                        {giftConfig.letterTitle}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Parchment Letter Prose */}
                <div className="p-6 sm:p-10 space-y-6">
                  <div className="space-y-4 text-[15px] sm:text-base leading-[1.8] text-[#2D2026] whitespace-pre-line font-normal">
                    {giftConfig.letterBody}
                  </div>

                  <div className="pt-4 border-t border-[#24191E]/10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#705D63]">Хэзээ ч хувирахгүй сэтгэлээр,</p>
                      <p className="font-display text-2xl font-semibold italic text-[#88132B] mt-0.5">
                        {giftConfig.senderName}
                      </p>
                    </div>
                    <div className="text-xs text-[#705D63] tabular-nums">
                      100 шалтгааны цомог · ♥
                    </div>
                  </div>
                </div>
              </motion.article>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
