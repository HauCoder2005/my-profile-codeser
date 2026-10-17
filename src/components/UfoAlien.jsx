import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ALIEN_QUOTES = [
  "Greetings, Earthling! 🛸",
  "Scanning for clean code... 100% found! ✨",
  "Nice portfolio! Mind if I abduct your CV? 📄",
  "64-bit TempleOS kernel detected! 👾",
  "Travelling at lightspeed across cyberspace! ⚡",
  "Take me to your leader (or your recruiter)! 👽",
];

const UfoAlien = ({ className = '', initialBeam = true }) => {
  const [isWaving, setIsWaving] = useState(false);
  const [beamActive, setBeamActive] = useState(initialBeam);
  const [speech, setSpeech] = useState(null);
  const [spinCount, setSpinCount] = useState(0);

  const handleClick = () => {
    // Increment spin to trigger barrel roll
    setSpinCount((prev) => prev + 1);
    setIsWaving(true);
    const randomQuote = ALIEN_QUOTES[Math.floor(Math.random() * ALIEN_QUOTES.length)];
    setSpeech(randomQuote);

    setTimeout(() => setIsWaving(false), 2500);
    setTimeout(() => setSpeech(null), 4000);
  };

  return (
    <div className={`relative select-none ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {speech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap px-3.5 py-1.5 rounded-full border border-accent/60 bg-black/90 dark:bg-white/95 text-white dark:text-black font-mono text-xs font-bold shadow-lg shadow-accent/20 flex items-center gap-1.5 pointer-events-none"
          >
            <span>{speech}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black/90 dark:bg-white/95 border-r border-b border-accent/60 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive UFO Container with Floating Physics & Barrel Roll on Click */}
      <motion.div
        animate={{
          y: [0, -12, 0, -8, 0],
          rotate: spinCount > 0 ? [0, -15, 360 * spinCount] : [-2, 3, -1, 3, -2],
        }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          rotate: spinCount > 0
            ? { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }
            : { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="cursor-pointer group flex flex-col items-center"
        title="Bấm vào UFO để chào phi hành gia ngoài hành tinh!"
      >
        <svg
          viewBox="0 0 280 230"
          className="w-48 sm:w-56 md:w-64 h-auto drop-shadow-[0_10px_25px_rgba(255,106,43,0.3)] transition-all duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Glass Dome Translucent Gradient */}
            <linearGradient id="ufoGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#80deea" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#26c6da" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00acc1" stopOpacity="0.75" />
            </linearGradient>

            {/* Glass Curved Specular Highlight */}
            <linearGradient id="ufoGlassSpecular" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Saucer Upper Hull (Titanium / Chrome) */}
            <linearGradient id="ufoHullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#546e7a" />
              <stop offset="40%" stopColor="#37474f" />
              <stop offset="70%" stopColor="#263238" />
              <stop offset="100%" stopColor="#1e272c" />
            </linearGradient>

            {/* Saucer Rim Metallic Sheen */}
            <linearGradient id="ufoRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#263238" />
              <stop offset="25%" stopColor="#78909c" />
              <stop offset="50%" stopColor="#cfd8dc" />
              <stop offset="75%" stopColor="#78909c" />
              <stop offset="100%" stopColor="#263238" />
            </linearGradient>

            {/* Alien Skin (Cyber Mint Green) */}
            <linearGradient id="alienSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7ffeb" />
              <stop offset="50%" stopColor="#64ffda" />
              <stop offset="100%" stopColor="#1de9b6" />
            </linearGradient>

            {/* Alien Eye Glossy Obsidian */}
            <linearGradient id="alienEyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a237e" />
              <stop offset="50%" stopColor="#0a0e27" />
              <stop offset="100%" stopColor="#00020a" />
            </linearGradient>

            {/* Plasma Thruster Core Glow */}
            <radialGradient id="plasmaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffeb3b" stopOpacity="1" />
              <stop offset="40%" stopColor="#ff6a2b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ff3d00" stopOpacity="0" />
            </radialGradient>

            {/* Tractor Beam Gradient */}
            <linearGradient id="tractorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff7a2f" stopOpacity="0.6" />
              <stop offset="35%" stopColor="#ff6a2b" stopOpacity="0.3" />
              <stop offset="80%" stopColor="#ff9e80" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ff6a2b" stopOpacity="0" />
            </linearGradient>

            {/* Neon Filter Glow */}
            <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* 1. TRACTOR BEAM (Tia sáng hút bắt cóc / Anti-gravity Beam) */}
          {/* ======================================================== */}
          {beamActive && (
            <g className="transition-opacity duration-500">
              {/* Conical Light Beam */}
              <polygon
                points="112,136 30,225 250,225 168,136"
                fill="url(#tractorGrad)"
                className="animate-pulse"
                style={{ animationDuration: '3s' }}
              />

              {/* Scanning Energy Rings within the Beam */}
              <ellipse cx="140" cy="165" rx="36" ry="7" fill="none" stroke="#ffab91" strokeWidth="1" opacity="0.45" strokeDasharray="3 3" />
              <ellipse cx="140" cy="195" rx="64" ry="11" fill="none" stroke="#ffab91" strokeWidth="1.2" opacity="0.35" strokeDasharray="4 4" />
              <ellipse cx="140" cy="222" rx="95" ry="15" fill="none" stroke="#ff6a2b" strokeWidth="1.5" opacity="0.5" />

              {/* Floating Dust / Energy Sparkles in the Beam */}
              <circle cx="120" cy="175" r="1.5" fill="#ffffff" opacity="0.8" />
              <circle cx="155" cy="188" r="2" fill="#ffe0b2" opacity="0.75" />
              <circle cx="132" cy="205" r="1.8" fill="#ffccbc" opacity="0.9" />
              <circle cx="168" cy="160" r="1.2" fill="#ffffff" opacity="0.7" />
              <circle cx="98" cy="198" r="1.4" fill="#ffffff" opacity="0.6" />
            </g>
          )}

          {/* ======================================================== */}
          {/* 2. THRUSTER CORE (Động cơ đẩy phản lực / Plasma Core)     */}
          {/* ======================================================== */}
          <g>
            <ellipse cx="140" cy="136" rx="34" ry="11" fill="#1a1a24" stroke="#37474f" strokeWidth="1.5" />
            <ellipse cx="140" cy="138" rx="22" ry="7" fill="url(#plasmaGlow)" filter="url(#neonFilter)" />
          </g>

          {/* ======================================================== */}
          {/* 3. LOWER HULL & METALLIC SAUCER RIM                      */}
          {/* ======================================================== */}
          {/* Main Lower Saucer Body */}
          <ellipse cx="140" cy="120" rx="118" ry="28" fill="url(#ufoHullGrad)" stroke="#1c252a" strokeWidth="1.5" />

          {/* Center Outer Rim Edge Strip with Metallic Reflection */}
          <path
            d="M 22,120 C 22,136 258,136 258,120 C 258,114 22,114 22,120 Z"
            fill="url(#ufoRimGrad)"
            stroke="#263238"
            strokeWidth="1"
          />

          {/* Upper Saucer Deck Flange */}
          <ellipse cx="140" cy="114" rx="98" ry="20" fill="#37474f" stroke="#546e7a" strokeWidth="1" />
          <ellipse cx="140" cy="112" rx="86" ry="16" fill="#212121" />

          {/* ======================================================== */}
          {/* 4. RUNNING LED LIGHTS (Đèn LED chạy quanh vành đĩa bay)   */}
          {/* ======================================================== */}
          <g filter="url(#neonFilter)">
            {/* LED 1 */}
            <circle cx="38" cy="122" r="3.2" fill="#ff6a2b" className="animate-ping" style={{ animationDuration: '2s' }} />
            <circle cx="38" cy="122" r="3.2" fill="#ff6a2b" />

            {/* LED 2 */}
            <circle cx="68" cy="128" r="3.8" fill="#00e5ff" />

            {/* LED 3 */}
            <circle cx="102" cy="133" r="4.2" fill="#ff6a2b" />

            {/* LED 4 (Center Front LED) */}
            <circle cx="140" cy="135" r="4.8" fill="#00e5ff" className="animate-pulse" style={{ animationDuration: '1.2s' }} />
            <circle cx="140" cy="135" r="2.2" fill="#ffffff" />

            {/* LED 5 */}
            <circle cx="178" cy="133" r="4.2" fill="#ff6a2b" />

            {/* LED 6 */}
            <circle cx="212" cy="128" r="3.8" fill="#00e5ff" />

            {/* LED 7 */}
            <circle cx="242" cy="122" r="3.2" fill="#ff6a2b" className="animate-ping" style={{ animationDuration: '2.4s' }} />
            <circle cx="242" cy="122" r="3.2" fill="#ff6a2b" />
          </g>

          {/* ======================================================== */}
          {/* 5. COCKPIT INTERIOR & THE ALIEN PILOT (Người ngoài hành tinh) */}
          {/* ======================================================== */}
          <g>
            {/* Cockpit Backseat / Interior Shadow */}
            <path d="M 82,108 C 80,48 200,48 198,108 Z" fill="#0a101d" />

            {/* Alien Spacesuit Shoulders & Collar */}
            <path
              d="M 112,108 C 112,96 168,96 168,108 Z"
              fill="#37474f"
              stroke="#78909c"
              strokeWidth="1.2"
            />
            {/* Spacesuit Chest Badge / Emblem */}
            <circle cx="140" cy="103" r="3" fill="#ff6a2b" />

            {/* Alien Head (Classic Smooth Bulbous Shape) */}
            <path
              d="M 122,68 C 116,42 164,42 158,68 C 154,84 126,84 122,68 Z"
              fill="url(#alienSkinGrad)"
              stroke="#00b4d8"
              strokeWidth="1.2"
            />

            {/* Alien Antenna on top of head */}
            <path
              d="M 140,46 Q 143,30 148,24"
              stroke="#64ffda"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Glowing Antenna Orb */}
            <circle
              cx="148"
              cy="24"
              r="4.2"
              fill="#ffeb3b"
              filter="url(#neonFilter)"
              className="animate-pulse"
              style={{ animationDuration: '0.9s' }}
            />
            <circle cx="148" cy="24" r="2" fill="#ffffff" />

            {/* Big Glossy Obsidian Alien Eyes */}
            {/* Left Eye */}
            <g transform="rotate(-10 130 66)">
              <ellipse cx="130" cy="66" rx="7.5" ry="10.5" fill="url(#alienEyeGrad)" />
              {/* Dual White Star/Specular Reflections */}
              <circle cx="128" cy="62" r="2.8" fill="#ffffff" />
              <circle cx="133" cy="70" r="1.3" fill="#ffffff" opacity="0.85" />
            </g>

            {/* Right Eye */}
            <g transform="rotate(10 150 66)">
              <ellipse cx="150" cy="66" rx="7.5" ry="10.5" fill="url(#alienEyeGrad)" />
              {/* Dual White Star/Specular Reflections */}
              <circle cx="148" cy="62" r="2.8" fill="#ffffff" />
              <circle cx="153" cy="70" r="1.3" fill="#ffffff" opacity="0.85" />
            </g>

            {/* Cute Alien Smile */}
            <path
              d="M 136,78 Q 140,82 144,78"
              stroke="#004d40"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />

            {/* Left Hand on Steering Wheel */}
            <ellipse cx="120" cy="102" rx="4.5" ry="3.5" fill="#64ffda" stroke="#00b4d8" strokeWidth="0.8" />

            {/* Right Hand: Waving or on Dashboard */}
            {isWaving ? (
              <g className="animate-bounce" style={{ animationDuration: '0.5s' }}>
                <path d="M 160,98 Q 168,88 170,80" stroke="#64ffda" strokeWidth="3" strokeLinecap="round" />
                <circle cx="170" cy="78" r="4" fill="#a7ffeb" />
                {/* 3 Little Alien Fingers */}
                <circle cx="168" cy="74" r="1.2" fill="#64ffda" />
                <circle cx="171" cy="73" r="1.2" fill="#64ffda" />
                <circle cx="174" cy="75" r="1.2" fill="#64ffda" />
              </g>
            ) : (
              <ellipse cx="160" cy="102" rx="4.5" ry="3.5" fill="#64ffda" stroke="#00b4d8" strokeWidth="0.8" />
            )}

            {/* Cockpit Instrument Dashboard Controls */}
            <path
              d="M 94,106 Q 140,114 186,106 L 190,112 Q 140,122 90,112 Z"
              fill="#101826"
              stroke="#1e293b"
              strokeWidth="1"
            />
            {/* Dashboard LED Indicators */}
            <circle cx="106" cy="110" r="1.8" fill="#00e676" />
            <circle cx="114" cy="111" r="1.8" fill="#ff1744" />
            <circle cx="122" cy="111.5" r="1.8" fill="#ffea00" />
            <rect x="133" y="108.5" width="14" height="4.5" rx="1.5" fill="#00b0ff" opacity="0.85" />
            <circle cx="158" cy="111.5" r="1.8" fill="#ff9100" />
            <circle cx="166" cy="111" r="1.8" fill="#00e5ff" />
            <circle cx="174" cy="110" r="1.8" fill="#d500f9" />
          </g>

          {/* ======================================================== */}
          {/* 6. TRANSLUCENT COCKPIT GLASS BUBBLE / DOME DOME          */}
          {/* ======================================================== */}
          {/* Translucent Cockpit Dome */}
          <path
            d="M 78,110 C 76,38 204,38 202,110 Z"
            fill="url(#ufoGlassGrad)"
            stroke="#b2ebf2"
            strokeWidth="1.5"
          />

          {/* Curved Specular Reflection on Glass (Volume Illusion) */}
          <path
            d="M 92,96 C 90,52 178,50 188,72 C 176,58 102,60 92,96 Z"
            fill="url(#ufoGlassSpecular)"
          />
          {/* Secondary Soft Rim Reflection */}
          <path
            d="M 188,96 C 192,80 196,68 190,56 C 194,66 194,82 188,96 Z"
            fill="#ffffff"
            opacity="0.45"
          />

          {/* Top Saucer Fin / Communication Beacon */}
          <polygon points="138,40 142,40 140,32" fill="#78909c" />
          <circle cx="140" cy="32" r="2.5" fill="#ff6a2b" filter="url(#neonFilter)" />
        </svg>

        {/* Action Pills & Controls on Hover */}
        <div className="flex items-center gap-2 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setBeamActive((prev) => !prev);
            }}
            className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-accent/40 bg-black/60 dark:bg-white/60 text-accent font-bold rounded hover:bg-accent hover:text-white transition-colors"
          >
            {beamActive ? 'TẮT TIA HÚT' : 'BẬT TIA HÚT'}
          </button>
          <span className="font-mono text-[10px] text-accent/80 tracking-wider">
            [ Bấm UFO! ]
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default UfoAlien;
