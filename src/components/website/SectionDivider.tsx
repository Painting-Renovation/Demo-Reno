'use client';

import { motion } from 'framer-motion';

interface SectionDividerProps {
  variant: 'dark' | 'light';
}

export function SectionDivider({ variant }: SectionDividerProps) {
  const isDark = variant === 'dark';

  return (
    <div className={`relative w-full overflow-hidden ${isDark ? 'bg-white' : 'bg-cream'}`}>
      <motion.svg
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full h-[50px] md:h-[60px] block"
        preserveAspectRatio="none"
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isDark ? (
          /* Dark variant: navy wave on white background */
          <>
            {/* Main wave */}
            <path
              d="M0 30C120 10 240 45 360 35C480 25 600 8 720 20C840 32 960 48 1080 38C1200 28 1320 12 1440 25V60H0V30Z"
              fill="#0B1D3A"
              fillOpacity="0.08"
            />
            {/* Accent wave */}
            <path
              d="M0 38C160 22 320 48 480 38C640 28 800 14 960 26C1120 38 1280 50 1440 36V60H0V38Z"
              fill="#0B1D3A"
              fillOpacity="0.04"
            />
            {/* Gold paint drip accent */}
            <circle cx="240" cy="52" r="3" fill="#C8973E" fillOpacity="0.15" />
            <circle cx="480" cy="48" r="2" fill="#C8973E" fillOpacity="0.12" />
            <circle cx="720" cy="54" r="3.5" fill="#C8973E" fillOpacity="0.18" />
            <circle cx="960" cy="50" r="2.5" fill="#C8973E" fillOpacity="0.14" />
            <circle cx="1200" cy="52" r="2" fill="#C8973E" fillOpacity="0.16" />
            {/* Gold line accent */}
            <line x1="0" y1="58" x2="1440" y2="58" stroke="url(#gold-gradient-dark)" strokeWidth="1.5" strokeOpacity="0.2" />
            <defs>
              <linearGradient id="gold-gradient-dark" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C8973E" stopOpacity="0" />
                <stop offset="20%" stopColor="#C8973E" />
                <stop offset="50%" stopColor="#E8B94E" />
                <stop offset="80%" stopColor="#C8973E" />
                <stop offset="100%" stopColor="#C8973E" stopOpacity="0" />
              </linearGradient>
            </defs>
          </>
        ) : (
          /* Light variant: cream wave on navy/dark background */
          <>
            {/* Main wave */}
            <path
              d="M0 25C180 42 360 12 540 28C720 44 900 15 1080 30C1260 45 1350 20 1440 28V60H0V25Z"
              fill="#FDF8F0"
              fillOpacity="0.12"
            />
            {/* Accent wave */}
            <path
              d="M0 35C200 20 400 45 600 32C800 19 1000 42 1200 30C1350 22 1400 35 1440 32V60H0V35Z"
              fill="#FDF8F0"
              fillOpacity="0.06"
            />
            {/* Gold paint drip accent */}
            <circle cx="180" cy="46" r="2.5" fill="#C8973E" fillOpacity="0.2" />
            <circle cx="540" cy="50" r="3" fill="#C8973E" fillOpacity="0.18" />
            <circle cx="900" cy="48" r="2" fill="#C8973E" fillOpacity="0.22" />
            <circle cx="1260" cy="46" r="3.5" fill="#C8973E" fillOpacity="0.16" />
            {/* Gold line accent */}
            <line x1="0" y1="56" x2="1440" y2="56" stroke="url(#gold-gradient-light)" strokeWidth="1.5" strokeOpacity="0.25" />
            <defs>
              <linearGradient id="gold-gradient-light" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C8973E" stopOpacity="0" />
                <stop offset="20%" stopColor="#C8973E" />
                <stop offset="50%" stopColor="#E8B94E" />
                <stop offset="80%" stopColor="#C8973E" />
                <stop offset="100%" stopColor="#C8973E" stopOpacity="0" />
              </linearGradient>
            </defs>
          </>
        )}
      </motion.svg>
    </div>
  );
}
