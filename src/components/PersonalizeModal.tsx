import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Check, Copy, RotateCcw, X} from 'lucide-react';
import {DEFAULT_GIFT_CONFIG, GiftConfig} from '../data/reasons';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GiftConfig;
  onSave: (nextConfig: GiftConfig) => void;
}

export function encodeGiftToHash(config: GiftConfig): string {
  const json = JSON.stringify(config);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decodeGiftFromHash(hashValue: string): GiftConfig | null {
  try {
    const clean = hashValue.replace(/^#?gift=/, '');
    if (!clean) return null;
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (
      parsed &&
      typeof parsed.girlfriendName === 'string' &&
      typeof parsed.letterBody === 'string'
    ) {
      return {
        ...DEFAULT_GIFT_CONFIG,
        ...parsed,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [draft, setDraft] = useState<GiftConfig>(config);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraft(config);
      setCopiedLink(false);
    }
  }, [isOpen, config]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
    onClose();
  };

  const handleCopyShareLink = async () => {
    onSave(draft);
    const encoded = encodeGiftToHash(draft);
    const url = `${window.location.origin}${window.location.pathname}#gift=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      window.location.hash = `gift=${encoded}`;
    }
  };

  const handleReset = () => {
    setDraft(DEFAULT_GIFT_CONFIG);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="personalize-modal-title"
        >
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
            className="fixed inset-0 bg-[#050406]/85 backdrop-blur-sm"
          />

          <motion.div
            initial={{opacity: 0, scale: 0.96, y: 12}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.97, y: 8}}
            transition={{duration: 0.22}}
            className="relative z-10 my-auto w-full max-w-2xl rounded-2xl border border-[#E2B49A]/25 bg-[#120E15] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#F4EFE8]/10 px-6 py-4 bg-[#17121B]">
              <div>
                <h2
                  id="personalize-modal-title"
                  className="font-display text-2xl font-semibold text-[#FBF7F0]"
                >
                  Нууц хайрцаг ба захидлаа тохируулах
                </h2>
                <p className="text-xs text-[#9E9388] mt-0.5">
                  Өөрийнх нь нэр, өөрийнхөө бичсэн зүрхний үг болон захидлыг эндээс
                  өөрчилж болно.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Хаах"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#BFB5AA] hover:text-[#FBF7F0] hover:bg-[#F4EFE8]/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[78vh] overflow-y-auto p-6 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#D1C7BC]">
                    Найз охины чинь нэр
                  </span>
                  <input
                    type="text"
                    required
                    value={draft.girlfriendName}
                    onChange={(e) =>
                      setDraft({...draft, girlfriendName: e.target.value})
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A080C] border border-[#F4EFE8]/15 text-sm text-[#FBF7F0] focus:outline-none focus:border-[#E2B49A]"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#D1C7BC]">
                    Чиний нэр (Гарын үсэг)
                  </span>
                  <input
                    type="text"
                    required
                    value={draft.senderName}
                    onChange={(e) =>
                      setDraft({...draft, senderName: e.target.value})
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A080C] border border-[#F4EFE8]/15 text-sm text-[#FBF7F0] focus:outline-none focus:border-[#E2B49A]"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#D1C7BC]">
                  Хөдөлгөөнт зүрхний доор гарах чиний үг (Шивнээ)
                </span>
                <textarea
                  rows={2}
                  required
                  value={draft.secretWhisper}
                  onChange={(e) =>
                    setDraft({...draft, secretWhisper: e.target.value})
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A080C] border border-[#F4EFE8]/15 text-sm text-[#FBF7F0] focus:outline-none focus:border-[#E2B49A]"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#D1C7BC]">
                    Захидлын гарчиг
                  </span>
                  <input
                    type="text"
                    required
                    value={draft.letterTitle}
                    onChange={(e) =>
                      setDraft({...draft, letterTitle: e.target.value})
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A080C] border border-[#F4EFE8]/15 text-sm text-[#FBF7F0] focus:outline-none focus:border-[#E2B49A]"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#D1C7BC]">
                    Огноо / Мөч
                  </span>
                  <input
                    type="text"
                    required
                    value={draft.letterDate}
                    onChange={(e) =>
                      setDraft({...draft, letterDate: e.target.value})
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A080C] border border-[#F4EFE8]/15 text-sm text-[#FBF7F0] focus:outline-none focus:border-[#E2B49A]"
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#D1C7BC]">
                  Захидал (Нууц хайрцгаас гарч ирэх)
                </span>
                <textarea
                  rows={7}
                  required
                  value={draft.letterBody}
                  onChange={(e) =>
                    setDraft({...draft, letterBody: e.target.value})
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A080C] border border-[#F4EFE8]/15 text-sm leading-relaxed text-[#FBF7F0] focus:outline-none focus:border-[#E2B49A]"
                />
              </label>

              <div className="pt-4 border-t border-[#F4EFE8]/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#A59A8F] hover:text-[#FBF7F0] hover:bg-[#F4EFE8]/10 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Анхны эх рүү буцаах</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E2B49A]/35 text-xs font-medium text-[#E2B49A] hover:text-[#FBF7F0] hover:border-[#E2B49A]/70 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Холбоос хуулагдлаа</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Найз охинд илгээх холбоос хуулах</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-[#BFB5AA] hover:text-[#FBF7F0] transition-colors cursor-pointer"
                  >
                    Болих
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-[#D63353] hover:bg-[#BE2745] text-xs font-medium text-[#FBF7F0] transition-colors cursor-pointer"
                  >
                    Хадгалах
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
