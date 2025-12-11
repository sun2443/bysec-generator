import svgPaths from "../imports/svg-xcp6c4ugks";

export default function VideoHeader() {
  return (
    <div className="bg-black relative w-full h-full" data-name="Video">
      {/* Thermal video effect - left side */}
      <div className="absolute h-full left-0 mix-blend-difference top-0 w-1/3">
        <div className="absolute inset-0 overflow-hidden">
          <video 
            autoPlay 
            className="absolute h-full left-0 max-w-none top-0 w-full object-cover" 
            controlsList="nodownload" 
            loop 
            playsInline
            muted
          >
            <source src="/_videos/v1/56b57bb9b686fcf49f2896da36c1dc29f4a571e3" />
          </video>
        </div>
      </div>
      
      {/* BYSEC logo SVG - matching original positioning */}
      <div className="absolute" style={{
        top: "32.65%",
        right: "4.05%",
        bottom: "32.49%",
        left: "25.03%"
      }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2075 220">
          <g>
            <path d={svgPaths.p301d78f0} fill="#FF0000" />
            <path d={svgPaths.p3e848f00} fill="#FF0000" />
            <path d={svgPaths.p3496c800} fill="#FF0000" />
            <path d={svgPaths.p19e5ed00} fill="#FF0000" />
            <path d={svgPaths.p37585900} fill="#FF0000" />
          </g>
        </svg>
      </div>
    </div>
  );
}