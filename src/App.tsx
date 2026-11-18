import React, {useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {ArrowDown, Heart, LockOpen, Shuffle} from 'lucide-react';
import {
  CATEGORY_LABELS,
  DEFAULT_GIFT_CONFIG,
  GiftConfig,
  LOVE_REASONS,
} from './data/reasons';
import {Navbar} from './components/Navbar';
import {SecretBoxSection} from './components/SecretBoxSection';
import {SecretBoxModal} from './components/SecretBoxModal';
import {ReasonsGallery} from './components/ReasonsGallery';
import {
  decodeGiftFromHash,
  PersonalizeModal,
} from './components/PersonalizeModal';

const STORAGE_KEYS = {
  favorites: 'zuun_shaltgaan_favorites_v1',
  read: 'zuun_shaltgaan_read_v1',
  openedBox: 'zuun_shaltgaan_opened_box_v1',
  config: 'zuun_shaltgaan_gift_config_v1',
};

function loadJsonStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const shouldReduceMotion = useReducedMotion();

  const [giftConfig, setGiftConfig] = useState<GiftConfig>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#gift=')) {
      const fromHash = decodeGiftFromHash(window.location.hash);
      if (fromHash) return fromHash;
    }
    return loadJsonStorage<GiftConfig>(STORAGE_KEYS.config, DEFAULT_GIFT_CONFIG);
  });

  const [favoriteIds, setFavoriteIds] = useState<number[]>(() =>
    loadJsonStorage<number[]>(STORAGE_KEYS.favorites, [1, 10, 100]),
  );
  const [readIds, setReadIds] = useState<number[]>(() =>
    loadJsonStorage<number[]>(STORAGE_KEYS.read, []),
  );
  const [hasOpenedBox, setHasOpenedBox] = useState<boolean>(() =>
    loadJsonStorage<boolean>(STORAGE_KEYS.openedBox, false),
  );

  const [isSecretBoxOpen, setIsSecretBoxOpen] = useState(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.favorites,
        JSON.stringify(favoriteIds),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [favoriteIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.read, JSON.stringify(readIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [readIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.openedBox,
        JSON.stringify(hasOpenedBox),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [hasOpenedBox]);

  const handleSaveConfig = (nextConfig: GiftConfig) => {
    setGiftConfig(nextConfig);
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.config,
        JSON.stringify(nextConfig),
      );
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleToggleFavorite = (id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleMarkRead = (id: number) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleOpenSecretBox = () => {
    setIsSecretBoxOpen(true);
    setHasOpenedBox(true);
  };

  const handleDrawRandomReason = () => {
    let nextIdx = Math.floor(Math.random() * LOVE_REASONS.length);
    if (nextIdx === spotlightIndex) {
      nextIdx = (nextIdx + 1) % LOVE_REASONS.length;
    }
    setSpotlightIndex(nextIdx);
    handleMarkRead(LOVE_REASONS[nextIdx].id);
  };

  const spotlightReason = useMemo(
    () => LOVE_REASONS[spotlightIndex] ?? LOVE_REASONS[0],
    [spotlightIndex],
  );
  const isSpotlightFavorite = favoriteIds.includes(spotlightReason.id);

  return (
    <div id="top" className="min-h-screen bg-[#0A080B] text-[#F4EFE8]">
      <Navbar
        onOpenSecretBox={handleOpenSecretBox}
        onOpenPersonalize={() => setIsPersonalizeOpen(true)}
      />

      <main>
        {/* Hero Split Section */}
        <section className="pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Editorial Typography */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <p className="text-xs font-medium tracking-widest text-[#E2B49A]">
                  Зөвхөн {giftConfig.girlfriendName}-д · Хайрын зуун тэмдэглэл
                </p>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#FBF7F0] leading-[1.08] [text-wrap:balance]">
                  Чамайг хайрлах 100 шалтгаан
                </h1>

                <p className="text-base sm:text-lg leading-relaxed text-[#C9BEB2] max-w-xl">
                  Зарим хүмүүс хайрыг ганцхан өгүүлбэрээр хэлдэг бол, би чамайг
                  яагаад ийм ихээр хайрладгаа өдөр бүрийн жижигхэн агшин бүртэй
                  нь хамт зуун мөр болгон хадгаллаа.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleOpenSecretBox}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[#D63353] hover:bg-[#BE2745] text-sm font-medium text-[#FBF7F0] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B49A]"
                  >
                    <LockOpen className="w-4 h-4" />
                    <span>Нууц хайрцаг 🖤 нээх</span>
                  </button>

                  <a
                    href="#reasons"
                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#DFD5CA] hover:text-[#FBF7F0] transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    <span>100 шалтгаан унших</span>
                    <ArrowDown className="w-4 h-4 text-[#E2B49A]" />
                  </a>
                </div>
              </div>

              {/* Right Matched-Height Visual Container */}
              <div className="lg:col-span-6">
                <div className="relative h-full min-h-[320px] sm:min-h-[400px] lg:min-h-[440px] rounded-2xl overflow-hidden border border-[#F4EFE8]/12 bg-[#141016]">
                  {!heroImgFailed ? (
                    <img
                      src="/src/assets/images/hero_keepsake_box_1794999483195.jpg"
                      alt="Лааны гэрэлд гэрэлтэх хар хилэн нууц хайрцаг, улаан сарнай ба хайрын захидал"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="w-full h-full lg:h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#23141B] via-[#120D14] to-[#0A080B] p-8 text-center">
                      <p className="font-display text-2xl italic text-[#E2B49A]">
                        Зөвхөн чамд зориулсан зуун шалтгаан
                      </p>
                    </div>
                  )}

                  {/* Measured Contrast Scrim */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0A080B]/85 via-[#0A080B]/20 to-transparent pointer-events-none"
                  />

                  <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#E2B49A]">
                        Хайрцгийн эзэн · {giftConfig.girlfriendName}
                      </p>
                      <p className="font-display text-xl sm:text-2xl text-[#FBF7F0] mt-0.5">
                        Дотроо захидал ба цохилох зүрхтэй
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Quiet Metadata Strip below Hero Split */}
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-b border-[#F4EFE8]/10 py-6">
              <div>
                <p className="text-xs text-[#9E9388]">Нийт шалтгаан</p>
                <p className="font-display text-3xl font-semibold text-[#FBF7F0] tabular-nums mt-1">
                  100
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9E9388]">Уншиж нээсэн</p>
                <p className="font-display text-3xl font-semibold text-[#FBF7F0] tabular-nums mt-1">
                  {readIds.length} / 100
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9E9388]">Зүрхэлж хадгалсан</p>
                <p className="font-display text-3xl font-semibold text-[#FBF7F0] tabular-nums mt-1">
                  {favoriteIds.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#9E9388]">Нууц хайрцаг 🖤</p>
                <button
                  type="button"
                  onClick={handleOpenSecretBox}
                  className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-[#E2B49A] hover:text-[#FBF7F0] transition-colors cursor-pointer"
                >
                  <span>
                    {hasOpenedBox ? 'Нээгдсэн · Дахин харах' : 'Нээхийг хүлээж байна'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured / Random Reason Spotlight */}
        <section id="featured" className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-2xl border border-[#F4EFE8]/12 bg-[#120E14] p-7 sm:p-12 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#9E9388]">
                  <span className="font-mono tabular-nums text-[#E2B49A] font-medium">
                    Шалтгаан {String(spotlightReason.id).padStart(3, '0')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{CATEGORY_LABELS[spotlightReason.category]}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(spotlightReason.id)}
                    aria-label="Онцлох шалтгааныг зүрхлэх"
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      isSpotlightFavorite
                        ? 'border-[#D63353]/60 bg-[#D63353]/15 text-[#FFB3C1]'
                        : 'border-[#F4EFE8]/12 text-[#C9BEB2] hover:text-[#FBF7F0]'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isSpotlightFavorite ? 'fill-[#D63353] text-[#D63353]' : ''
                      }`}
                    />
                    <span>{isSpotlightFavorite ? 'Хадгалсан' : 'Зүрхлэх'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDrawRandomReason}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C1620] hover:bg-[#261D2B] border border-[#E2B49A]/30 text-xs font-medium text-[#FBF7F0] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-[#E2B49A]" />
                    <span>Өөр шалтгаан сугалах</span>
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={spotlightReason.id}
                  initial={
                    shouldReduceMotion ? {opacity: 0} : {opacity: 0, y: 10}
                  }
                  animate={
                    shouldReduceMotion ? {opacity: 1} : {opacity: 1, y: 0}
                  }
                  exit={
                    shouldReduceMotion ? {opacity: 0} : {opacity: 0, y: -8}
                  }
                  transition={{duration: 0.22}}
                  className="space-y-4"
                >
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#FBF7F0] leading-tight [text-wrap:balance]">
                    {spotlightReason.title}
                  </h2>
                  <p className="text-base sm:text-xl leading-relaxed text-[#DFD5CA]">
                    {spotlightReason.text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Glowing Secret Box Section */}
        <SecretBoxSection
          girlfriendName={giftConfig.girlfriendName}
          hasOpenedOnce={hasOpenedBox}
          onOpenBox={handleOpenSecretBox}
          onOpenPersonalize={() => setIsPersonalizeOpen(true)}
        />

        {/* Complete 100 Reasons Archive */}
        <ReasonsGallery
          favoriteIds={favoriteIds}
          readIds={readIds}
          onToggleFavorite={handleToggleFavorite}
          onMarkRead={handleMarkRead}
        />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#F4EFE8]/10 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C8278]">
          <p>
            Зөвхөн {giftConfig.girlfriendName}-д зориулав · {giftConfig.senderName}
          </p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setIsPersonalizeOpen(true)}
              className="hover:text-[#FBF7F0] transition-colors cursor-pointer"
            >
              Захидал болон нэр засах
            </button>
            <button
              type="button"
              onClick={handleOpenSecretBox}
              className="hover:text-[#FBF7F0] transition-colors cursor-pointer"
            >
              Нууц хайрцаг 🖤
            </button>
            <a href="#top" className="hover:text-[#FBF7F0] transition-colors">
              Дээш буцах
            </a>
          </div>
        </div>
      </footer>

      {/* Secret Box Opening Modal (Animated Heart + Written Words + Letter) */}
      <SecretBoxModal
        isOpen={isSecretBoxOpen}
        onClose={() => setIsSecretBoxOpen(false)}
        giftConfig={giftConfig}
        onOpenPersonalize={() => setIsPersonalizeOpen(true)}
      />

      {/* Personalize Names & Letter Modal */}
      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        config={giftConfig}
        onSave={handleSaveConfig}
      />
    </div>
  );
}
