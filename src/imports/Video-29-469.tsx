import svgPaths from "./svg-05omusybel";

function Video({ className }: { className?: string }) {
  return (
    <div className={className} data-name="Video">
      <div className="absolute h-[300px] left-[calc(50%-535.5px)] mix-blend-difference top-0 translate-x-[-50%] w-[320px]" data-name="Thurmal Effect 1">
        <div className="absolute inset-0 overflow-hidden">
          <video autoPlay className="absolute h-[164.19%] left-[-87.03%] max-w-none top-[-32.1%] w-[274.06%]" controlsList="nodownload" loop playsInline muted>
            <source src="/_videos/v1/56b57bb9b686fcf49f2896da36c1dc29f4a571e3" />
          </video>
        </div>
      </div>
      <div className="absolute inset-[32.65%_4.05%_32.49%_25.03%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 987 105">
          <g id="Group 5972">
            <path d={svgPaths.p25173500} fill="var(--fill-0, #FF0000)" id="Vector" />
            <path d={svgPaths.p1c71a900} fill="var(--fill-0, #FF0000)" id="Vector_2" />
            <path d={svgPaths.p18850600} fill="var(--fill-0, #FF0000)" id="Vector_3" />
            <path d={svgPaths.p3e9bf580} fill="var(--fill-0, #FF0000)" id="Vector_4" />
            <path d={svgPaths.pb2a5000} fill="var(--fill-0, #FF0000)" id="Vector_5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function Video1() {
  return <Video className="bg-black relative size-full" />;
}
