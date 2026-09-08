import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'icon-only' | 'horizontal';
  onClick?: () => void;
}

export const AlgoLearnIcon: React.FC<{ className?: string; size?: number | string }> = ({
  className = 'w-9 h-9',
  size,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 100 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={style}
      aria-label="AlgoLearn Cap Logo"
    >
      <defs>
        {/* Top diamond gradient - deep dark navy to vibrant royal blue */}
        <linearGradient id="capTopGrad" x1="12" y1="10" x2="88" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#081433" />
          <stop offset="35%" stopColor="#0d2459" />
          <stop offset="70%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Lower base gradient - rich purple-violet to electric cyan-blue matching Image 1 */}
        <linearGradient id="capBaseGrad" x1="18" y1="42" x2="78" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="25%" stopColor="#4f46e5" />
          <stop offset="65%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#00d2ff" />
        </linearGradient>

        {/* Cap rim/depth gradient */}
        <linearGradient id="capRimGrad" x1="8" y1="30" x2="88" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#081433" />
          <stop offset="50%" stopColor="#0d2459" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Tassel gradient */}
        <linearGradient id="tasselGrad" x1="72" y1="28" x2="82" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Soft shadow filter for depth */}
        <filter id="capShadow" x="0" y="0" width="100" height="90" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0284c7" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* 1. Base / Skull Box (Curved 3D lower structure with vibrant purple-to-cyan gradient) */}
      <g filter="url(#capShadow)">
        <path
          d="M 22 41 
             L 22 55 
             C 22 64 33 71 50 71 
             C 67 71 78 64 78 55 
             L 78 41 
             C 71 45 61 48 50 48 
             C 39 48 29 45 22 41 Z"
          fill="url(#capBaseGrad)"
        />
      </g>

      {/* 2. Mortarboard Diamond Cap 3D Thickness Rim */}
      <path
        d="M 10 32 
           L 50 53 
           L 90 32 
           L 90 35 
           L 50 56 
           L 10 35 Z"
        fill="url(#capRimGrad)"
      />

      {/* 3. Top Mortarboard Diamond Surface */}
      <path
        d="M 50 10 
           L 90 32 
           L 50 53 
           L 10 32 Z"
        fill="url(#capTopGrad)"
      />

      {/* Crisp white accent outline on front rim as in Image 1 */}
      <path
        d="M 10 32 L 50 53 L 90 32"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 4. Tassel String, Bead & Drop Bulb on the Right */}
      {/* Tassel cord drape */}
      <path
        d="M 75 25 
           C 78 29 81 35 81 44 
           L 81 48"
        stroke="url(#tasselGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Tassel small ring/bead */}
      <circle cx="81" cy="49" r="2.2" fill="#1d4ed8" />
      {/* Tassel droplet bulb */}
      <path
        d="M 81 50 
           C 78.5 53 77 56 77 59 
           C 77 63 78.8 65 81 65 
           C 83.2 65 85 63 85 59 
           C 85 56 83.5 53 81 50 Z"
        fill="url(#tasselGrad)"
      />
    </svg>
  );
};

export const AlgoLearnLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'full',
  onClick,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', sub: 'text-[8px] tracking-[0.25em]' },
    md: { icon: 'w-9 h-9', text: 'text-xl sm:text-2xl', sub: 'text-[9px] sm:text-[10px] tracking-[0.28em]' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl sm:text-3xl', sub: 'text-[10px] sm:text-[11px] tracking-[0.3em]' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl sm:text-4xl', sub: 'text-xs tracking-[0.32em]' },
  };

  const currentSize = sizeMap[size];

  if (variant === 'icon-only') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <AlgoLearnIcon className={currentSize.icon} />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      <div className="transition-transform group-hover:scale-105 duration-200">
        <AlgoLearnIcon className={currentSize.icon} />
      </div>

      <div className="flex flex-col justify-center">
        <div className={`font-black tracking-tight leading-none ${currentSize.text} flex items-baseline`}>
          <span className="text-slate-900 dark:text-white font-extrabold">Algo</span>
          <span className="text-blue-600 dark:text-blue-500 font-black">L</span>
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-black">
            earn
          </span>
        </div>

        {showSubtitle && (
          <div
            className={`font-extrabold uppercase text-slate-500 dark:text-slate-400 font-sans mt-0.5 sm:mt-1 leading-tight ${currentSize.sub}`}
          >
            YOUR DSA JOURNEY
          </div>
        )}
      </div>
    </div>
  );
};
