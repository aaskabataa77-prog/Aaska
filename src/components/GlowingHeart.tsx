import React from 'react';
import {motion, useReducedMotion} from 'motion/react';

interface GlowingHeartProps {
  size?: 'sm' | 'md' | 'lg';
}

export const GlowingHeart: React.FC<GlowingHeartProps> = ({size = 'lg'}) => {
  const shouldReduceMotion = useReducedMotion();

  const dimensions =
    size === 'sm'
      ? 'w-14 h-14'
      : size === 'md'
        ? 'w-24 h-24'
        : 'w-32 h-32 sm:w-36 sm:h-36';

  return (
    <div className="relative inline-flex items-center justify-center select-none">
      {/* Warm ambient crimson-gold aura behind the heart */}
      <motion.div
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [0.92, 1.18, 0.96, 1.1, 0.92],
                opacity: [0.35, 0.72, 0.42, 0.62, 0.35],
              }
        }
        transition={{
          duration: 1.65,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-radial from-[#D63353]/55 via-[#E2B49A]/20 to-transparent blur-2xl pointer-events-none"
      />

      {/* Secondary soft halo ring */}
      <motion.div
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [0.85, 1.45],
                opacity: [0.55, 0],
              }
        }
        transition={{
          duration: 1.65,
          repeat: Infinity,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute w-24 h-24 rounded-full border border-[#D63353]/40 pointer-events-none"
      />

      {/* Beating heart SVG (lub-dub cadence) */}
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.13, 1.02, 1.09, 1],
              }
        }
        transition={{
          duration: 1.65,
          repeat: Infinity,
          times: [0, 0.16, 0.3, 0.45, 1],
          ease: 'easeInOut',
        }}
        className={`relative z-10 ${dimensions} drop-shadow-[0_12px_30px_rgba(214,51,83,0.48)]`}
      >
        <svg
          viewBox="0 0 120 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-label="Хөдөлгөөнт зүрх"
        >
          <defs>
            <radialGradient
              id="velvetHeartGrad"
              cx="38%"
              cy="32%"
              r="70%"
              fx="34%"
              fy="28%"
            >
              <stop offset="0%" stopColor="#FF758F" />
              <stop offset="38%" stopColor="#D63353" />
              <stop offset="82%" stopColor="#88132B" />
              <stop offset="100%" stopColor="#4A0817" />
            </radialGradient>
            <linearGradient
              id="heartRimHighlight"
              x1="20"
              y1="14"
              x2="96"
              y2="98"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#F8D8C4" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#D63353" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#E2B49A" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path
            d="M60 103.5C58.2 103.5 56.5 102.8 55.2 101.6C35.8 84.3 10 61.8 10 35.4C10 17.6 24.1 4 41.2 4C50.3 4 56.2 8.2 60 13.7C63.8 8.2 69.7 4 78.8 4C95.9 4 110 17.6 110 35.4C110 61.8 84.2 84.3 64.8 101.6C63.5 102.8 61.8 103.5 60 103.5Z"
            fill="url(#velvetHeartGrad)"
            stroke="url(#heartRimHighlight)"
            strokeWidth="1.75"
          />
          {/* Subtle inner specular curve */}
          <path
            d="M27 29C27 21.5 33.2 16 40.5 16"
            stroke="#FFE6EC"
            strokeOpacity="0.55"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
};
