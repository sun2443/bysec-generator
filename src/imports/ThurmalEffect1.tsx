import svgPaths from "./svg-4hmrhvewkc";

export default function ThurmalEffect() {
  return (
    <div className="relative size-full">
      <style>{`
        @keyframes thermalPulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        @keyframes colorShift {
          0% {
            filter: hue-rotate(0deg) brightness(1);
          }
          50% {
            filter: hue-rotate(20deg) brightness(1.2);
          }
          100% {
            filter: hue-rotate(0deg) brightness(1);
          }
        }
      `}</style>
      <svg 
        className="block size-full" 
        fill="none" 
        preserveAspectRatio="xMidYMid meet" 
        viewBox="0 0 99 100"
        style={{
          animation: "thermalPulse 2s ease-in-out infinite",
          filter: "drop-shadow(0 0 8px rgba(255, 107, 107, 0.6))"
        }}
      >
        <defs>
          <radialGradient id="thermalGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: "#ff6b6b", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#e63946", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#8b1a1a", stopOpacity: 1 }} />
          </radialGradient>
          <clipPath id="clip0_29_1019">
            <rect fill="white" height="99.9999" width="98.4184" />
          </clipPath>
        </defs>
        <g clipPath="url(#clip0_29_1019)" id="Group 5998">
          <path d={svgPaths.p12e0fe00} fill="url(#thermalGradient)" id="Vector" />
          <path d={svgPaths.p25fb0140} fill="url(#thermalGradient)" id="Vector_2" />
          <path d={svgPaths.p34421380} fill="url(#thermalGradient)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}