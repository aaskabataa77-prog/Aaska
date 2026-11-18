import React, {useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {Check, ChevronLeft, ChevronRight, Heart, Search, X} from 'lucide-react';
import {
  CATEGORY_LABELS,
  LOVE_REASONS,
  LoveReason,
  ReasonCategory,
} from '../data/reasons';

type FilterTab = 'all' | ReasonCategory | 'favorites';

interface ReasonsGalleryProps {
  favoriteIds: number[];
  readIds: number[];
  onToggleFavorite: (id: number) => void;
  onMarkRead: (id: number) => void;
}

const formatIndex = (id: number): string => String(id).padStart(3, '0');

export const ReasonsGallery: React.FC<ReasonsGalleryProps> = ({
  favoriteIds,
  readIds,
  onToggleFavorite,
  onMarkRead,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReason, setSelectedReason] = useState<LoveReason | null>(null);
  const [showAllInAllTab, setShowAllInAllTab] = useState(false);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const readSet = useMemo(() => new Set(readIds), [readIds]);

  const filteredReasons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return LOVE_REASONS.filter((reason) => {
      if (activeTab === 'favorites' && !favoriteSet.has(reason.id)) {
        return false;
      }
      if (
        activeTab !== 'all' &&
        activeTab !== 'favorites' &&
        reason.category !== activeTab
      ) {
        return false;
      }
      if (!q) return true;
      return (
        reason.title.toLowerCase().includes(q) ||
        reason.text.toLowerCase().includes(q) ||
        String(reason.id).includes(q)
      );
    });
  }, [activeTab, searchQuery, favoriteSet]);

  const displayedReasons = useMemo(() => {
    if (
      activeTab === 'all' &&
      !searchQuery.trim() &&
      !showAllInAllTab &&
      filteredReasons.length > 24
    ) {
      return filteredReasons.slice(0, 24);
    }
    return filteredReasons;
  }, [activeTab, searchQuery, showAllInAllTab, filteredReasons]);

  const handleOpenReason = (reason: LoveReason) => {
    setSelectedReason(reason);
    onMarkRead(reason.id);
  };

  const handleNavigateModal = (direction: -1 | 1) => {
    if (!selectedReason || filteredReasons.length === 0) return;
    const currentIdx = filteredReasons.findIndex(
      (r) => r.id === selectedReason.id,
    );
    const nextIdx =
      currentIdx === -1
        ? 0
        : (currentIdx + direction + filteredReasons.length) %
          filteredReasons.length;
    const nextReason = filteredReasons[nextIdx];
    setSelectedReason(nextReason);
    onMarkRead(nextReason.id);
  };

  useEffect(() => {
    if (!selectedReason) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedReason(null);
      if (e.key === 'ArrowLeft') handleNavigateModal(-1);
      if (e.key === 'ArrowRight') handleNavigateModal(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const tabs: {id: FilterTab; label: string; count: number}[] = [
    {id: 'all', label: 'Бүгд', count: 100},
    {id: 'appearance', label: 'Төрх ба инээд', count: 25},
    {id: 'moments', label: 'Хамтдаа мөчүүд', count: 25},
    {id: 'habits', label: 'Жижиг зуршлууд', count: 25},
    {id: 'soul', label: 'Зүрх ба ирээдүй', count: 25},
    {id: 'favorites', label: 'Хадгалсан', count: favoriteIds.length},
  ];

  return (
    <section
      id="reasons"
      className="py-20 sm:py-28 border-t border-[#F4EFE8]/10"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-medium tracking-widest text-[#E2B49A]">
              01 – 100 · Хайрын бүртгэл
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#FBF7F0] [text-wrap:balance]">
              Чамайг хайрлах зуун шалтгаан
            </h2>
            <p className="text-sm sm:text-base text-[#B8ADA1] leading-relaxed">
              Карт бүр дээр дарж дэлгэрэнгүй унших эсвэл өөрийн хамгийн дуртай
              мөрүүдийг зүрхлэн хадгалж аваарай.
            </p>
          </div>

          <div className="text-sm text-[#BFB5AA] tabular-nums shrink-0">
            Уншсан: <span className="text-[#FBF7F0] font-medium">{readIds.length}</span> / 100
          </div>
        </div>

        {/* Filter Tabs & Search Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
          <div
            role="tablist"
            aria-label="Шалтгааны ангилал"
            className="flex items-center gap-1 p-1 bg-[#141016] border border-[#F4EFE8]/10 rounded-xl overflow-x-auto"
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#D63353] text-[#FBF7F0]'
                      : 'text-[#B8ADA1] hover:text-[#FBF7F0]'
                  }`}
                >
                  {tab.label}{' '}
                  <span className="opacity-75 tabular-nums">({tab.count})</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search
              className="w-4 h-4 text-[#9E9388] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Шалтгаан эсвэл дугаар хайх..."
              aria-label="Шалтгаан хайх"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#141016] border border-[#F4EFE8]/12 text-[#FBF7F0] placeholder:text-[#7E746A] focus:outline-none focus:border-[#E2B49A]/60 transition-colors"
            />
          </div>
        </div>

        {/* Empty State */}
        {displayedReasons.length === 0 ? (
          <div className="rounded-2xl border border-[#F4EFE8]/10 bg-[#120E14] px-6 py-16 text-center space-y-3">
            <p className="font-display text-2xl text-[#FBF7F0]">
              {activeTab === 'favorites'
                ? 'Одоогоор хадгалсан шалтгаан алга байна'
                : 'Тохирох шалтгаан олдсонгүй'}
            </p>
            <p className="text-sm text-[#A59A8F]">
              {activeTab === 'favorites'
                ? 'Аль ч шалтгааны баруун дээд буланд байрлах зүрхэн дээр дарж дуртай мөрөө хадгалаарай.'
                : 'Хайлтын үгээ өөрчилж дахин оролдоно уу.'}
            </p>
            {activeTab === 'favorites' || searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
                className="mt-2 inline-flex items-center px-4 py-2 rounded-lg border border-[#F4EFE8]/15 text-xs font-medium text-[#FBF7F0] hover:border-[#E2B49A]/50 transition-colors cursor-pointer"
              >
                Бүх 100 шалтгааныг харах
              </button>
            ) : null}
          </div>
        ) : (
          <>
            {/* 3-column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedReasons.map((reason) => {
                const isFavorite = favoriteSet.has(reason.id);
                const isRead = readSet.has(reason.id);

                return (
                  <article
                    key={reason.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-[#F4EFE8]/10 bg-[#120E14] hover:border-[#E2B49A]/35 hover:bg-[#161119] transition-colors duration-150 p-6"
                  >
                    <div className="space-y-3">
                      {/* Unboxed Metadata Row (Zero-Pill Discipline) */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-[#9E9388] min-w-0">
                          <span className="font-mono tabular-nums text-[#E2B49A] font-medium">
                            {formatIndex(reason.id)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">
                            {CATEGORY_LABELS[reason.category]}
                          </span>
                          {isRead && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span
                                className="inline-flex items-center gap-1 text-[#C9BEB2]"
                                title="Уншсан"
                              >
                                <Check className="w-3 h-3 text-[#E2B49A]" />
                              </span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(reason.id);
                          }}
                          aria-label={
                            isFavorite
                              ? `${reason.id}-р шалтгааныг хадгалснаас хасах`
                              : `${reason.id}-р шалтгааныг зүрхлэх`
                          }
                          className="inline-flex items-center justify-center w-9 h-9 -mr-2 -mt-2 rounded-lg text-[#9E9388] hover:text-[#D63353] hover:bg-[#F4EFE8]/5 transition-colors cursor-pointer shrink-0"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isFavorite
                                ? 'fill-[#D63353] text-[#D63353]'
                                : 'text-[#8C8278] group-hover:text-[#BFB5AA]'
                            }`}
                          />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenReason(reason)}
                        className="text-left w-full space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B49A] rounded-lg cursor-pointer"
                      >
                        <h3 className="font-display text-2xl font-semibold text-[#FBF7F0] leading-snug group-hover:text-[#FFE7D6] transition-colors">
                          {reason.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#C2B7AB]">
                          {reason.text}
                        </p>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Expand remaining reasons if in default collapsed view */}
            {activeTab === 'all' &&
              !searchQuery.trim() &&
              !showAllInAllTab &&
              filteredReasons.length > 24 && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllInAllTab(true)}
                    className="px-6 py-3 rounded-lg border border-[#E2B49A]/35 bg-[#161119] hover:bg-[#1E1722] text-sm font-medium text-[#FBF7F0] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Үлдсэн 76 шалтгааныг бүгдийг нь дэлгэх (100 хүртэл)
                  </button>
                </div>
              )}
          </>
        )}
      </div>

      {/* Focused Single Reason Reader Modal */}
      <AnimatePresence>
        {selectedReason && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reason-reader-title"
          >
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={() => setSelectedReason(null)}
              className="fixed inset-0 bg-[#050406]/85 backdrop-blur-sm"
            />
            <motion.div
              initial={
                shouldReduceMotion
                  ? {opacity: 0}
                  : {opacity: 0, scale: 0.96, y: 12}
              }
              animate={
                shouldReduceMotion ? {opacity: 1} : {opacity: 1, scale: 1, y: 0}
              }
              exit={
                shouldReduceMotion
                  ? {opacity: 0}
                  : {opacity: 0, scale: 0.97, y: 8}
              }
              transition={{duration: 0.22, ease: [0.16, 1, 0.3, 1]}}
              className="relative z-10 w-full max-w-xl rounded-2xl border border-[#E2B49A]/25 bg-[#130E16] p-7 sm:p-10 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#A59A8F]">
                  <span className="font-mono tabular-nums text-[#E2B49A] font-medium">
                    Шалтгаан {formatIndex(selectedReason.id)} / 100
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{CATEGORY_LABELS[selectedReason.category]}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReason(null)}
                  aria-label="Хаах"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#BFB5AA] hover:text-[#FBF7F0] hover:bg-[#F4EFE8]/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 py-2">
                <h3
                  id="reason-reader-title"
                  className="font-display text-3xl sm:text-4xl font-semibold text-[#FBF7F0] leading-tight"
                >
                  {selectedReason.title}
                </h3>
                <p className="text-base sm:text-lg leading-relaxed text-[#DFD5CA]">
                  {selectedReason.text}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F4EFE8]/10 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(selectedReason.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    favoriteSet.has(selectedReason.id)
                      ? 'border-[#D63353]/60 bg-[#D63353]/15 text-[#FFB3C1]'
                      : 'border-[#F4EFE8]/15 text-[#D1C7BC] hover:text-[#FBF7F0]'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      favoriteSet.has(selectedReason.id)
                        ? 'fill-[#D63353] text-[#D63353]'
                        : ''
                    }`}
                  />
                  <span>
                    {favoriteSet.has(selectedReason.id)
                      ? 'Хадгалсан'
                      : 'Зүрхэлж хадгалах'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavigateModal(-1)}
                    aria-label="Өмнөх шалтгаан"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#F4EFE8]/12 text-xs font-medium text-[#D1C7BC] hover:text-[#FBF7F0] hover:border-[#F4EFE8]/30 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Өмнөх</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigateModal(1)}
                    aria-label="Дараагийн шалтгаан"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#F4EFE8]/12 text-xs font-medium text-[#D1C7BC] hover:text-[#FBF7F0] hover:border-[#F4EFE8]/30 transition-colors cursor-pointer"
                  >
                    <span>Дараах</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
