import React from "react";
import { useCurrentFrame, interpolate, staticFile, Img } from "remotion";
import { C, F, useSpr } from "./theme";

// 1. DUSK CREMATORIUM ENVIRONMENT (Scene 1)
export const CrematoriumDuskBackground: React.FC = () => {
  const f = useCurrentFrame();
  const mistShift = Math.sin(f / 25) * 20;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="cremDusk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#05050D" />
            <stop offset="40%" stopColor="#120D22" />
            <stop offset="75%" stopColor="#3B1824" />
            <stop offset="100%" stopColor="#6E231C" />
          </linearGradient>
          <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#DC2626" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1920" height="1080" fill="url(#cremDusk)" />
        <path d="M0 640 Q450 590 960 630 T1920 600 L1920 1080 L0 1080 Z" fill="#0A0812" />
        <path d="M0 720 Q600 680 1200 730 T1920 710 L1920 1080 L0 1080 Z" fill="#050308" />

        {/* Barren Silhouetted Trees */}
        <path d="M320 720 L330 520 L300 460 M330 520 L360 480" stroke="#000" strokeWidth="6" strokeLinecap="round" />
        <path d="M1580 710 L1570 490 L1540 440 M1570 490 L1610 450" stroke="#000" strokeWidth="6" strokeLinecap="round" />

        {/* Distant Pyre Embers & Smoke */}
        <circle cx="960" cy="690" r="140" fill="url(#emberGlow)" style={{ filter: "blur(20px)" }} />
        
        {/* Floating Smoke & Ash Particles */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const py = interpolate((f * 2 + i * 45) % 180, [0, 180], [720, 480]);
          const px = 960 + Math.sin(f / 15 + i) * 35 + (i - 2.5) * 25;
          const op = interpolate(py, [480, 600, 720], [0, 0.6, 0]);
          return (
            <circle key={i} cx={px} cy={py} r={3 + (i % 3)} fill="#FDBA74" opacity={op} style={{ filter: "blur(1px)" }} />
          );
        })}

        <ellipse cx={960 + mistShift} cy="760" rx="900" ry="80" fill="rgba(255,255,255,0.04)" style={{ filter: "blur(25px)" }} />
      </svg>
    </div>
  );
};

// 2. STUDIO BANYAN TREE ENVIRONMENT (Using Illustrated Background Asset)
export const BanyanTreeEnvironment: React.FC<{
  showCar?: boolean;
  carFrame?: number;
}> = ({ showCar = false, carFrame = 40 }) => {
  const f = useCurrentFrame();
  const rootSway = Math.sin(f / 20) * 5;

  const carX = interpolate(f, [carFrame, carFrame + 50], [1980, 1420], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* 2D Illustrated Banyan Tree at Dusk Background */}
      <Img
        src={staticFile("images/bg_banyan_tree_dusk.jpg")}
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          objectFit: "cover",
          transform: "scale(1.02)",
        }}
      />

      {/* Swaying Aerial Roots Dynamic Overlay */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <g transform={`rotate(${rootSway} 420 280)`}>
          <path d="M420 280 Q390 520 370 780" stroke="#1A120B" strokeWidth="8" fill="none" opacity="0.85" />
          <path d="M420 280 Q435 550 410 820" stroke="#2B1A10" strokeWidth="5" fill="none" opacity="0.85" />
        </g>
        <g transform={`rotate(${rootSway * -0.7} 580 320)`}>
          <path d="M580 320 Q610 540 590 800" stroke="#1A120B" strokeWidth="7" fill="none" opacity="0.85" />
        </g>

        {/* Vintage Ambassador Car (Drives in from right on dirt road) */}
        {showCar && f >= carFrame && (
          <g transform={`translate(${carX - 1420}, 0)`}>
            {/* Volumetric Headlight Beams */}
            <polygon points="1400,735 650,680 650,830" fill="rgba(254, 240, 138, 0.45)" style={{ filter: "blur(12px)" }} />
            <polygon points="1420,750 750,730 750,860" fill="rgba(254, 240, 138, 0.35)" style={{ filter: "blur(8px)" }} />

            {/* Vintage Black Ambassador Car Silhouette & Details */}
            <path d="M1400 710 Q1430 670 1500 660 Q1600 660 1660 700 L1730 710 Q1750 730 1730 755 L1380 755 Q1370 725 1400 710 Z" fill="#020617" stroke="#334155" strokeWidth="2.5" />
            <path d="M1445 700 L1495 675 L1555 675 L1545 700 Z" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
            <path d="M1560 675 L1630 675 L1645 700 L1555 700 Z" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
            {/* Glowing Golden Headlight Lamps */}
            <circle cx="1382" cy="725" r="9" fill="#FEF08A" style={{ filter: "drop-shadow(0 0 18px #FEF08A)" }} />
            {/* Wheels */}
            <circle cx="1425" cy="745" r="22" fill="#020617" stroke="#64748B" strokeWidth="5" />
            <circle cx="1665" cy="745" r="22" fill="#020617" stroke="#64748B" strokeWidth="5" />
          </g>
        )}
      </svg>
    </div>
  );
};

// 3. OLDER KATHIR SITTING CHARACTER (High-Res 2D Cel-Shaded Asset)
export const OlderKathirSitting: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
}> = ({ x = 450, y = 620, scale = 1.0 }) => {
  const f = useCurrentFrame();
  const breathe = Math.sin(f / 16) * 3;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + breathe,
        transform: `translate(-50%, -50%) scale(${scale})`,
        filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.85))",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <Img
        src={staticFile("images/char_older_kathir.png")}
        style={{
          width: 580,
          height: "auto",
        }}
      />
    </div>
  );
};

// 4. ANJALI'S HANDS GIVING DIARY CLOSE-UP (Scene 3)
export const AnjaliHandsGivingDiary: React.FC = () => {
  const f = useCurrentFrame();
  const pushIn = interpolate(f, [0, 96], [1, 1.1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${pushIn})`,
      }}
    >
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none">
        <defs>
          <radialGradient id="vignetteHands" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2A1B14" />
            <stop offset="100%" stopColor="#0B080A" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#vignetteHands)" />

        {/* Anjali's Hand (From Right: Henna, gold & red glass bangles) */}
        <path d="M1920 520 L1320 520 L1150 560" stroke="#FDE68A" strokeWidth="60" strokeLinecap="round" />
        <rect x="1400" y="480" width="50" height="80" fill="#991B1B" rx="4" />
        <rect x="1450" y="480" width="15" height="80" fill="#F59E0B" />
        <circle cx="1280" cy="520" r="35" stroke="#DC2626" strokeWidth="5" fill="none" />
        <circle cx="1295" cy="520" r="35" stroke="#F59E0B" strokeWidth="5" fill="none" />
        <circle cx="1310" cy="520" r="35" stroke="#DC2626" strokeWidth="5" fill="none" />

        {/* Kathir's Rugged Muscular Hand (From Left) */}
        <path d="M0 640 L650 640 L820 600" stroke="#C26A20" strokeWidth="75" strokeLinecap="round" />

        {/* THE PRECIOUS LEATHER DIARY */}
        <g transform="translate(850, 420)">
          <rect x="0" y="0" width="240" height="320" rx="12" fill="#78350F" stroke="#451A03" strokeWidth="8" style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.9))" }} />
          <line x1="30" y1="0" x2="30" y2="320" stroke="#451A03" strokeWidth="8" />
          <rect x="45" y="20" width="170" height="280" rx="8" fill="none" stroke="#F59E0B" strokeWidth="3" opacity="0.85" />
          <circle cx="130" cy="160" r="35" fill="none" stroke="#F59E0B" strokeWidth="4" />
          <path d="M115 200 L145 200 L130 220 Z" fill="#F59E0B" />
          <path d="M120 320 L120 370 L130 360 L140 370 L140 320" fill="#F59E0B" />
        </g>
      </svg>
    </div>
  );
};

// 5. UNOPENED LAST PAGE MACRO (Scene 5 & 10)
export const DiaryMacroLastPage: React.FC<{ hesitating?: boolean }> = ({ hesitating = false }) => {
  const f = useCurrentFrame();
  const handTremble = hesitating ? Math.sin(f / 2) * 2 : 0;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none">
        <rect x="0" y="0" width="1920" height="1080" fill="#0C0A09" />

        <g transform="translate(480, 180)">
          <rect x="0" y="0" width="460" height="680" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" style={{ filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.8))" }} />
          {[60, 100, 140, 180, 220, 260, 300, 340, 380].map((ly, i) => (
            <line key={i} x1="40" y1={ly} x2={400 - (i % 3) * 30} y2={ly} stroke="#92400E" strokeWidth="2.5" opacity="0.45" strokeDasharray="8 6" />
          ))}

          <line x1="460" y1="0" x2="460" y2="680" stroke="#78350F" strokeWidth="6" />

          {/* Final Unopened Page */}
          <rect x="460" y="0" width="460" height="680" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
          <path d="M680 0 L680 680" stroke="#F59E0B" strokeWidth="12" />

          {/* Dried Purple Flower */}
          <g transform="translate(620, 280)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M 60 60 Q 90 20 100 60 Q 90 100 60 60"
                fill="#9333EA"
                opacity="0.88"
                transform={`rotate(${angle} 60 60)`}
                stroke="#6B21A8"
                strokeWidth="1.5"
              />
            ))}
            <circle cx="60" cy="60" r="14" fill="#EAB308" />
            <path d="M 60 74 Q 55 130 50 180" stroke="#15803D" strokeWidth="4" fill="none" />
          </g>

          {/* Kathir's Rugged Finger */}
          <g transform={`translate(${860 + handTremble}, 420)`}>
            <rect x="0" y="0" width="140" height="50" rx="25" fill="#C26A20" stroke="#8A420A" strokeWidth="2" style={{ filter: "drop-shadow(0 8px 15px rgba(0,0,0,0.6))" }} />
            <line x1="40" y1="15" x2="75" y2="35" stroke="#7C2D12" strokeWidth="2.5" />
          </g>
        </g>
      </svg>
    </div>
  );
};

// 6. PETRICHOR RAIN & WILD PURPLE FLOWERS (Scene 7)
export const PetrichorMistEnvironment: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="rainSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B1320" />
            <stop offset="60%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#3F2212" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#rainSky)" />

        {/* Wet Red Clay Soil */}
        <path d="M0 720 Q480 690 960 710 T1920 690 L1920 1080 L0 1080 Z" fill="#7F1D1D" />
        <rect x="0" y="760" width="1920" height="320" fill="#450A0A" />

        {/* Wild Shrubs with Purple Flowers */}
        {[200, 500, 800, 1100, 1400, 1700].map((x, i) => {
          const sway = Math.sin(f / 12 + i) * 8;
          return (
            <g key={i} transform={`translate(${x + sway}, 700)`}>
              <path d="M0 60 Q-20 20 -40 10 Q-10 30 0 60" fill="#15803D" />
              <path d="M0 60 Q20 20 40 10 Q10 30 0 60" fill="#166534" />
              <circle cx="0" cy="5" r="14" fill={C.purpleFlower} style={{ filter: `drop-shadow(0 0 10px ${C.purpleFlowerGlow})` }} />
              <circle cx="0" cy="5" r="5" fill="#FDE047" />
              <circle cx="10" cy="18" r="3" fill="#BAE6FD" opacity="0.9" />
            </g>
          );
        })}

        {/* Rain Lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const rx = (i * 240 + f * 18) % 1920;
          const ry = (f * 24 + i * 120) % 1080;
          return (
            <line
              key={i}
              x1={rx}
              y1={ry}
              x2={rx - 30}
              y2={ry + 80}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    </div>
  );
};

// 7. SUNNY VILLAGE POND FLASHBACK (Using Illustrated Background Asset)
export const VillageLandscapeFlashback: React.FC = () => {
  const f = useCurrentFrame();
  const panX = interpolate(f, [0, 189], [0, -60]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Img
        src={staticFile("images/bg_village_pond_sunny.jpg")}
        style={{
          position: "absolute",
          width: 2040,
          height: 1080,
          objectFit: "cover",
          transform: `translateX(${panX}px) scale(1.05)`,
        }}
      />
    </div>
  );
};

// 8. YOUNG KATHIR COMPONENT (High-Res 2D Cel-Shaded Asset)
export const YoungKathirRugged: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  pose?: "stand" | "mustache" | "shy";
}> = ({ x = 960, y = 620, scale = 1.0, pose = "mustache" }) => {
  const f = useCurrentFrame();
  const breathe = Math.sin(f / 16) * 3;

  const imgSrc =
    pose === "mustache"
      ? staticFile("images/char_young_kathir_mustache.png")
      : pose === "shy"
      ? staticFile("images/char_young_kathir_shy.png")
      : staticFile("images/char_young_kathir_stand.png");

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + breathe,
        transform: `translate(-50%, -50%) scale(${scale})`,
        filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.85))",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <Img
        src={imgSrc}
        style={{
          width: 480,
          height: "auto",
        }}
      />
    </div>
  );
};

// 9. ANJALI COMPONENT (High-Res 2D Cel-Shaded Asset)
export const AnjaliCharacterDetailed: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  pose?: "stand" | "walk" | "gesture";
}> = ({ x = 960, y = 620, scale = 1.0, pose = "walk" }) => {
  const f = useCurrentFrame();
  const breathe = Math.sin(f / 14) * 3;

  const imgSrc =
    pose === "walk"
      ? staticFile("images/char_anjali_walk.png")
      : pose === "stand"
      ? staticFile("images/char_anjali_stand.png")
      : staticFile("images/char_anjali_gesture.png");

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + breathe,
        transform: `translate(-50%, -50%) scale(${scale})`,
        filter: "drop-shadow(0 15px 35px rgba(245, 158, 11, 0.4))",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <Img
        src={imgSrc}
        style={{
          width: 440,
          height: "auto",
        }}
      />
    </div>
  );
};

// 10. TAMIL STORY SUBTITLE COMPONENT
export const TamilStorySubtitle: React.FC<{
  text: string;
  keyword?: string;
}> = ({ text, keyword }) => {
  const enterSpr = useSpr(0, { damping: 14, stiffness: 140 });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 55,
        left: "50%",
        transform: `translateX(-50%) translateY(${(1 - enterSpr) * 25}px)`,
        width: "auto",
        maxWidth: 1600,
        background: "rgba(11, 17, 30, 0.90)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(245, 158, 11, 0.45)",
        borderRadius: 16,
        padding: "16px 36px",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <span
        style={{
          fontFamily: F.tamil,
          fontSize: 32,
          fontWeight: 700,
          color: C.white,
          letterSpacing: "0.5px",
          textAlign: "center",
          lineHeight: 1.4,
          textShadow: "0 2px 8px rgba(0,0,0,0.9)",
        }}
      >
        {keyword && text.includes(keyword) ? (
          <>
            {text.split(keyword)[0]}
            <span
              style={{
                color: C.gold,
                textShadow: "0 0 16px rgba(245, 158, 11, 0.9)",
                fontWeight: 900,
              }}
            >
              {keyword}
            </span>
            {text.split(keyword)[1]}
          </>
        ) : (
          text
        )}
      </span>
    </div>
  );
};
