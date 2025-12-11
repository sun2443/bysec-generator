import { useState, useRef, useEffect } from "react";
import {
  Download,
  RefreshCw,
  Play,
  Pause,
  Palette,
  Home,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import bysecLogo from "figma:asset/16fdeb090f8f0d286cc17e06680cdf02c8c5e557.png";
import { BackgroundGradientControls } from "./components/BackgroundGradientControls";
import { Tooltip } from "./components/Tooltip";

export type LayerType = "background" | "pattern";

export interface GradientColor {
  color: string;
  position: number;
}

export interface Layer {
  visible: boolean;
  opacity: number;
  image: string | null;
  hasPattern: boolean;
  imageScale: number;
  imageOffsetX: number;
  imageOffsetY: number;
  backgroundColor?: string;
  useGradient?: boolean;
  gradientColors?: GradientColor[];
  gradientAngle?: number;
}

export default function App() {
  // Basic state - BASIC PATTERN preset
  const basicState = {
    colors: [
      "#CBCCCD",
      "#7A7B7D",
      "#292B2C",
    ],
    minThickness: 0.2,
    maxThickness: 20,
    thicknessVariation: 0,
    bulge: 0.1,
    twist: 0.3,
    twistRotation: 0,
    density: 20,
    graphicScale: 1,
    colorRepeats: 1,
    opacity: 1,
    offsetY: 0,
    backgroundColor: "#000000",
    aspectRatio: "1:1",
    exportFormat: "png",
    transparentBg: false,
    animationSpeed: 0.5,
    animationType: "pulse",
    isAnimating: false,
    seed: 0.123456,
    shapeVariant: 0,
  };

  const [colors, setColors] = useState(basicState.colors);
  const [hoveredColorIndex, setHoveredColorIndex] = useState<number | null>(
    null,
  );
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [minThickness, setMinThickness] = useState(basicState.minThickness);
  const [maxThickness, setMaxThickness] = useState(basicState.maxThickness);
  const [thicknessVariation, setThicknessVariation] =
    useState(basicState.thicknessVariation);
  const [bulge, setBulge] = useState(basicState.bulge);
  const [twist, setTwist] = useState(basicState.twist);
  const [twistRotation, setTwistRotation] = useState(basicState.twistRotation);
  const [density, setDensity] = useState(basicState.density);
  const [graphicScale, setGraphicScale] = useState(basicState.graphicScale);
  const [colorRepeats, setColorRepeats] = useState(basicState.colorRepeats);
  const [opacity, setOpacity] = useState(basicState.opacity);
  const [offsetY, setOffsetY] = useState(basicState.offsetY);
  const [offsetX, setOffsetX] = useState(0);
  const [patternBlur, setPatternBlur] = useState(0);
  const [patternScale, setPatternScale] = useState(1);
  const [patternRotate, setPatternRotate] = useState(0);
  const [axisX, setAxisX] = useState(0);
  const [axisY, setAxisY] = useState(0);
  const [backgroundColor, setBackgroundColor] =
    useState(basicState.backgroundColor);
  const [aspectRatio, setAspectRatio] = useState(basicState.aspectRatio);
  const [exportFormat, setExportFormat] = useState(basicState.exportFormat);
  const [transparentBg, setTransparentBg] = useState(basicState.transparentBg);
  const [editingColorIndex, setEditingColorIndex] = useState<
    number | null
  >(null);
  const [seed, setSeed] = useState(basicState.seed);
  const [shapeVariant, setShapeVariant] = useState(basicState.shapeVariant);

  // Saved basic pattern preset - user can save current settings
  const [basicPatternSeed, setBasicPatternSeed] = useState(basicState.seed);
  const [basicShapeVariant, setBasicShapeVariant] = useState(basicState.shapeVariant);
  const [basicDensity, setBasicDensity] = useState(basicState.density);
  const [basicTwist, setBasicTwist] = useState(basicState.twist);
  const [basicBulge, setBasicBulge] = useState(basicState.bulge);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(basicState.isAnimating);
  const [animationSpeed, setAnimationSpeed] = useState(basicState.animationSpeed);
  const [animationType, setAnimationType] = useState(basicState.animationType);
  const [animationTime, setAnimationTime] = useState(0);

  // Layer system state
  const [layers, setLayers] = useState<Record<LayerType, Layer>>({
    background: { 
      visible: true, 
      opacity: 1, 
      image: null, 
      hasPattern: false, 
      imageScale: 1, 
      imageOffsetX: 0, 
      imageOffsetY: 0,
      backgroundColor: "#000000",
      useGradient: false,
      gradientColors: [
        { color: "#000000", position: 0 },
        { color: "#FFFFFF", position: 100 },
      ],
      gradientAngle: 0,
    },
    pattern: { 
      visible: true, 
      opacity: 1, 
      image: null, 
      hasPattern: true, 
      imageScale: 1, 
      imageOffsetX: 0, 
      imageOffsetY: 0 
    },
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const patternCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRefs = useRef<Record<LayerType, HTMLInputElement | null>>({
    background: null,
    pattern: null,
  });

  // Accordion state for each section
  const [accordionState, setAccordionState] = useState({
    colorPalette: true,
    patternControls: true,
    patternTransform: true,
    background: true,
    layers: true,
  });

  const toggleAccordion = (section: keyof typeof accordionState) => {
    setAccordionState(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Anatomical muscle fiber color palettes - natural, organic tones
  const colorPalettes = [
    // Deep Red Muscle
    [
      "#1a0000",
      "#4a0404",
      "#8B0000",
      "#A52A2A",
      "#DC143C",
      "#FF6B6B",
      "#FF9999",
      "#FFE5E5",
    ],
    // Pink & Burgundy
    [
      "#1C0010",
      "#5C0A2C",
      "#800020",
      "#C41E3A",
      "#FF69B4",
      "#FFB6C1",
      "#FFD1DC",
      "#FFF0F5",
    ],
    // Warm Tissue
    [
      "#2B0000",
      "#6B1515",
      "#A52A2A",
      "#CD5C5C",
      "#FFA07A",
      "#FFE4E1",
      "#FFF0ED",
      "#FFFAFA",
    ],
    // Oxygenated
    [
      "#1B0042",
      "#4B0082",
      "#6A0DAD",
      "#8B008B",
      "#DA70D6",
      "#FF99D8",
      "#FFB3E6",
      "#FFF0FF",
    ],
    // Natural Red
    [
      "#0D0000",
      "#3D0000",
      "#8B0000",
      "#B22222",
      "#CD5C5C",
      "#FFC0CB",
      "#FFD7D7",
      "#FFF5F5",
    ],
    // Magenta Tissue
    [
      "#1A0517",
      "#4A0E4E",
      "#6A0572",
      "#AB2567",
      "#FF6B9D",
      "#FFB3D9",
      "#FFD1E8",
      "#FFF5FA",
    ],
  ];

  const generateRandomPalette = () => {
    // Fixed color pool
    const colorPool = [
      "#D12115", "#FFFFFF", "#CBCCCD", "#7A7B7D", "#292B2C",
      "#000000", "#F8BDB9", "#F3918B", "#74120C", "#260604"
    ];
    
    // Randomly select 3-6 colors
    const numColors = Math.floor(Math.random() * 4) + 3; // 3, 4, 5, or 6 colors
    
    // Shuffle the color pool
    const shuffled = [...colorPool].sort(() => Math.random() - 0.5);
    
    // Take the first numColors
    const randomPalette = shuffled.slice(0, numColors);
    
    console.log("Generated random palette:", randomPalette);
    
    setColors(randomPalette);
    setSeed(Math.random());
  };

  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const parseColor = (
    colorStr: string,
  ): [number, number, number] => {
    if (colorStr.startsWith("rgb")) {
      const matches = colorStr.match(/\d+/g);
      return matches
        ? [
            Number(matches[0]),
            Number(matches[1]),
            Number(matches[2]),
          ]
        : [0, 0, 0];
    } else if (colorStr.startsWith("#")) {
      const hex = colorStr.slice(1);
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
    return [0, 0, 0];
  };

  const rgbToHsl = (
    r: number,
    g: number,
    b: number,
  ): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToRgb = (
    h: number,
    s: number,
    l: number,
  ): [number, number, number] => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
    ];
  };

  const interpolateColorHSL = (
    color1: string,
    color2: string,
    t: number,
  ) => {
    const c1 = parseColor(color1);
    const c2 = parseColor(color2);

    const hsl1 = rgbToHsl(c1[0], c1[1], c1[2]);
    const hsl2 = rgbToHsl(c2[0], c2[1], c2[2]);

    // Interpolate in HSL space for smoother gradients
    let h1 = hsl1[0];
    let h2 = hsl2[0];

    // Take shortest path around color wheel
    if (Math.abs(h2 - h1) > 180) {
      if (h2 > h1) {
        h1 += 360;
      } else {
        h2 += 360;
      }
    }

    const h = (h1 + (h2 - h1) * t) % 360;
    const s = hsl1[1] + (hsl2[1] - hsl1[1]) * t;
    const l = hsl1[2] + (hsl2[2] - hsl1[2]) * t;

    const rgb = hslToRgb(h, s, l);
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  };

  const interpolateColorRGB = (
    color1: string,
    color2: string,
    t: number,
  ) => {
    const c1 = parseColor(color1);
    const c2 = parseColor(color2);

    // Direct RGB interpolation to avoid unexpected hue shifts
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);

    return `rgb(${r},${g},${b})`;
  };

  const interpolateColor = (
    color1: string,
    color2: string,
    t: number,
  ) => {
    return interpolateColorRGB(color1, color2, t);
  };

  const drawMainPattern = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number = 0,
    layerOpacity: number = 1,
    perspectiveX: number = 0,
    perspectiveY: number = 0,
  ) => {
    const numLines = density;
    const twistPhase = seed * Math.PI * 2;

    // 패턴을 6배 크기로 생성
    const patternWidth = width * 6;

    let timeOffset = 0;
    if (isAnimating) {
      if (animationType === "wave") {
        timeOffset = time * 2;
      } else if (animationType === "rotation") {
        timeOffset = time * Math.PI * 2;
      } else if (animationType === "pulse") {
        timeOffset = Math.sin(time * 3) * 0.5;
      } else if (animationType === "flow") {
        timeOffset = time * 3;
      }
    }

    for (let i = 0; i < numLines; i++) {
      const progress = i / numLines;

      // Color gradient
      const colorProgress =
        (progress * colorRepeats * colors.length) %
        colors.length;
      const colorIndex = Math.floor(colorProgress);
      const colorT = colorProgress - colorIndex;
      const nextIndex = (colorIndex + 1) % colors.length;

      const baseColor = interpolateColor(
        colors[colorIndex],
        colors[nextIndex],
        colorT,
      );

      const normalizedY = progress - 0.5;
      const baseY = height * 0.5;

      const variation = thicknessVariation;
      
      // Thickness Variation 규칙성/불규칙성 제어
      const randomness = variation;
      const clusterSize = Math.max(1, Math.floor(50 * (1 - randomness)));
      const clusterSeed = Math.floor(i / clusterSize);
      
      const lineRandomSeed = seed + clusterSeed + i * randomness * 100;
      const baseRandom = seededRandom(lineRandomSeed);
      
      const avgThickness = (minThickness + maxThickness) / 2;
      const range = (maxThickness - minThickness) * variation;
      
      const lineThickness = avgThickness - range / 2 + baseRandom * range;

      let animatedThickness = lineThickness;
      if (isAnimating && animationType === "pulse") {
        animatedThickness *= 1 + timeOffset * 0.2;
      }

      // 패턴 너비에 비례하여 segments 계산 (부드러운 곡선 유지)
      // 기준: width * 2 -> 400 segments, width * 6 -> 1200 segments
      const segments = Math.floor((patternWidth / width) * 200);

      ctx.beginPath();
      ctx.lineWidth = animatedThickness;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        // 패턴을 중앙 정렬: 0%일 때 중앙이 보이도록 -width*2.5에서 시작 (6배 크기이므로)
        const x = t * patternWidth - width * 2.5;

        let animatedRotation = twistRotation;
        let animatedTwist = twist;

        if (isAnimating) {
          if (animationType === "wave") {
            animatedTwist =
              twist +
              Math.sin(t * Math.PI * 4 + timeOffset) * 0.3;
          } else if (animationType === "rotation") {
            animatedRotation = twistRotation + timeOffset;
          } else if (animationType === "flow") {
            animatedRotation =
              twistRotation + t * timeOffset * 0.3;
          }
        }

        // 패턴 너비에 비례하여 rotation 효과 적용 (6배 크기 = 더 많은 회전)
        const rotationMultiplier = patternWidth / width / 2; // 기준 2배 대비 배율
        const rotationAngle =
          t * Math.PI * 2 * animatedRotation * rotationMultiplier + twistPhase;
        const rotatedOffset =
          normalizedY * Math.cos(rotationAngle);
        const depthOffset =
          normalizedY * Math.sin(rotationAngle);

        const bulgeCurve =
          Math.sin(t * Math.PI) * bulge * height * graphicScale;
        
        // 패턴 너비에 비례하여 twist 효과 적용 (6배 크기 = 6배 웨이브)
        const twistMultiplier = patternWidth / width / 2; // 기준 2배 대비 배율
        const twistCurve =
          Math.sin(
            t * Math.PI * animatedTwist * twistMultiplier +
              twistPhase +
              progress * Math.PI +
              (isAnimating ? timeOffset : 0),
          ) *
          height *
          0.15 *
          graphicScale;

        const perspectiveScale =
          1 + Math.sin(t * Math.PI) * 0.3;
        const depthScale = 1 - depthOffset * 0.3;
        const lineOffset =
          rotatedOffset * height * 0.4 * depthScale * graphicScale;
        let finalY =
          baseY +
          lineOffset * perspectiveScale +
          bulgeCurve +
          twistCurve;

        // Apply perspective transformation
        let finalX = x;
        
        // Axis X: Y 위치에 따라 X에 원근 적용 (상하로 갈수록 좌우가 좁아지거나 넓어짐)
        // normalizedY: -0.5 (top) ~ 0.5 (bottom)
        const normalizedYForPerspective = (finalY - height / 2) / height;
        const xPerspectiveFactor = 1 + normalizedYForPerspective * perspectiveX * 0.01;
        finalX = (finalX - width / 2) * xPerspectiveFactor + width / 2;
        
        // Axis Y: X 위치에 따라 Y에 원근 적용 (좌우로 갈수록 상하가 좁아지거나 넓어짐)
        const normalizedXForPerspective = (finalX - width / 2) / width;
        const yPerspectiveFactor = 1 + normalizedXForPerspective * perspectiveY * 0.01;
        finalY = (finalY - height / 2) * yPerspectiveFactor + height / 2;

        if (j === 0) {
          ctx.moveTo(finalX, finalY);
        } else {
          ctx.lineTo(finalX, finalY);
        }
      }

      const c = parseColor(baseColor);
      const hsl = rgbToHsl(c[0], c[1], c[2]);
      const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
      ctx.strokeStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      ctx.globalAlpha = opacity * layerOpacity;
      ctx.stroke();
      ctx.globalAlpha = layerOpacity;
    }
  };

  const drawPattern = async (time: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate canvas dimensions based on aspect ratio
    let canvasWidth = 1600;
    let canvasHeight = 1600;

    switch (aspectRatio) {
      case "1:1":
        canvasWidth = 1600;
        canvasHeight = 1600;
        break;
      case "3:4":
        canvasWidth = 1200;
        canvasHeight = 1600;
        break;
      case "9:16":
        canvasWidth = 900;
        canvasHeight = 1600;
        break;
      case "16:9":
        canvasWidth = 1600;
        canvasHeight = 900;
        break;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (!transparentBg) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    const drawLayer = async (layerType: LayerType) => {
      const layer = layers[layerType];
      if (!layer.visible) return;

      ctx.save();
      ctx.globalAlpha = layer.opacity;

      if (layerType === "background") {
        if (layer.useGradient && layer.gradientColors && layer.gradientColors.length >= 2) {
          const angle = layer.gradientAngle || 0;
          const angleRad = (angle * Math.PI) / 180;
          const x1 = width / 2 - (Math.cos(angleRad) * width) / 2;
          const y1 = height / 2 - (Math.sin(angleRad) * height) / 2;
          const x2 = width / 2 + (Math.cos(angleRad) * width) / 2;
          const y2 = height / 2 + (Math.sin(angleRad) * height) / 2;
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          
          const sortedColors = [...layer.gradientColors].sort((a, b) => a.position - b.position);
          sortedColors.forEach(({ color, position }) => {
            const validColor = color && /^#[0-9A-F]{6}$/i.test(color) ? color : '#000000';
            const validPosition = Math.max(0, Math.min(100, position || 0));
            gradient.addColorStop(validPosition / 100, validColor);
          });
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = layer.backgroundColor || backgroundColor;
        }
        ctx.fillRect(0, 0, width, height);
      }

      if (layer.image) {
        try {
          const img = await loadImage(layer.image);
          
          const imgAspect = img.width / img.height;
          const canvasAspect = width / height;
          
          let drawWidth = width * layer.imageScale;
          let drawHeight = height * layer.imageScale;
          
          if (imgAspect > canvasAspect) {
            drawHeight = drawWidth / imgAspect;
          } else {
            drawWidth = drawHeight * imgAspect;
          }
          
          const x = (width - drawWidth) / 2 + layer.imageOffsetX * width;
          const y = (height - drawHeight) / 2 + layer.imageOffsetY * height;
          
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
        } catch (error) {
          console.error(`Failed to load image for ${layerType} layer:`, error);
        }
      }

      if (layer.hasPattern) {
        // 캔버스 영역으로 클리핑
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.clip();
        
        if (patternBlur > 0) {
          ctx.filter = `blur(${patternBlur}px)`;
        }
        
        // Pattern Transform 적용 (중앙 기준으로 회전, 확대/축소)
        ctx.translate(width / 2, height / 2);
        
        // Rotate 적용
        ctx.rotate((patternRotate * Math.PI) / 180);
        
        // Scale 적용 (UI 값 1.0 = 실제 스케일 0.3, 패턴이 x6배 크기이므로 0.3배 적용)
        ctx.scale(patternScale * 0.3, patternScale * 0.3);
        
        ctx.translate(-width / 2, -height / 2);
        
        // X Position: -1 (오른쪽 끝 보임) ~ 0 (중앙 보임) ~ 1 (왼쪽 끝 보임)
        // 패턴은 width * 6 크기, -width*2.5 ~ width*3.5 범위로 생성됨
        const xOffsetPixels = offsetX * width * 2.5;
        const yOffsetPixels = offsetY * height;
        ctx.translate(xOffsetPixels, yOffsetPixels);
        drawMainPattern(ctx, width, height, time, layer.opacity, axisX, axisY);
        
        ctx.restore();
      }

      ctx.restore();
    };

    await drawLayer("background");
    await drawLayer("pattern");
  };

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setAnimationTime(
          (prev) => prev + 0.016 * animationSpeed,
        );
        animationFrameRef.current =
          requestAnimationFrame(animate);
      };
      animationFrameRef.current =
        requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, animationSpeed]);

  useEffect(() => {
    drawPattern(animationTime);
  }, [
    colors,
    minThickness,
    maxThickness,
    thicknessVariation,
    backgroundColor,
    bulge,
    twist,
    twistRotation,
    density,
    graphicScale,
    colorRepeats,
    opacity,
    offsetY,
    offsetX,
    patternBlur,
    patternScale,
    patternRotate,
    axisX,
    axisY,
    aspectRatio,
    transparentBg,
    seed,
    animationTime,
    animationType,
    isAnimating,
    layers,
  ]);

  useEffect(() => {
    if (!isAnimating) {
      const canvas = canvasRef.current;
      if (canvas) {
        try {
          const dataUrl = canvas.toDataURL('image/png');
          setBackgroundImage(dataUrl);
        } catch (e) {
          console.error('Failed to generate background image:', e);
        }
      }
    }
  }, [
    colors,
    minThickness,
    maxThickness,
    thicknessVariation,
    backgroundColor,
    bulge,
    twist,
    twistRotation,
    density,
    graphicScale,
    colorRepeats,
    opacity,
    offsetY,
    offsetX,
    patternBlur,
    patternScale,
    patternRotate,
    axisX,
    axisY,
    aspectRatio,
    transparentBg,
    seed,
    isAnimating,
  ]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");

    if (exportFormat === "svg") {
      alert(
        "SVG export is not supported yet. Using PNG instead.",
      );
      link.download = "fiber-twist-pattern.png";
      link.href = canvas.toDataURL("image/png");
    } else if (exportFormat === "jpg") {
      link.download = "fiber-twist-pattern.jpg";
      link.href = canvas.toDataURL("image/jpeg", 0.95);
    } else {
      link.download = "fiber-twist-pattern.png";
      link.href = canvas.toDataURL("image/png");
    }

    link.click();
  };

  const handleColorChange = (
    index: number,
    newColor: string,
  ) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  const addColor = () => {
    if (colors.length < 8) {
      setColors([...colors, "#ffffff"]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
      if (editingColorIndex === index) {
        setEditingColorIndex(null);
      }
    }
  };

  const rgbToHex = (rgb: string) => {
    const values = parseColor(rgb);
    return (
      "#" +
      values
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const regenerate = () => {
    setSeed(Math.random());
    setShapeVariant(Math.floor(Math.random() * 10)); // 0-9로 확장하여 더 다양한 기본 패턴 생성
  };

  const handleTransparentBgToggle = (checked: boolean) => {
    setTransparentBg(checked);
    if (checked) {
      // Transparent 체크 시 백그라운드 레이어 숨기기
      setLayers((prev) => ({
        ...prev,
        background: { ...prev.background, visible: false },
      }));
    } else {
      // Transparent 체크 해제 시 백그라운드 레이어 자동으로 켜기
      setLayers((prev) => ({
        ...prev,
        background: { ...prev.background, visible: true },
      }));
    }
  };

  const saveAsBasic = () => {
    setBasicPatternSeed(seed);
    setBasicShapeVariant(shapeVariant);
    setBasicDensity(density);
    setBasicTwist(twist);
    setBasicBulge(bulge);
  };

  const resetToDefault = () => {
    setColors(basicState.colors);
    setMinThickness(basicState.minThickness);
    setMaxThickness(basicState.maxThickness);
    setThicknessVariation(basicState.thicknessVariation);
    setTwistRotation(basicState.twistRotation);
    setGraphicScale(basicState.graphicScale);
    setColorRepeats(basicState.colorRepeats);
    setOpacity(basicState.opacity);
    setOffsetY(basicState.offsetY);
    setOffsetX(0);
    setPatternBlur(0);
    setPatternScale(1);
    setPatternRotate(0);
    setAxisX(0);
    setAxisY(0);
    setBackgroundColor(basicState.backgroundColor);
    setTransparentBg(basicState.transparentBg);
    setAspectRatio(basicState.aspectRatio);
    setExportFormat(basicState.exportFormat);
    setAnimationSpeed(basicState.animationSpeed);
    setAnimationType(basicState.animationType);
    setIsAnimating(basicState.isAnimating);
    
    setSeed(basicPatternSeed);
    setShapeVariant(basicShapeVariant);
    setDensity(basicDensity);
    setTwist(basicTwist);
    setBulge(basicBulge);
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const toggleLayerVisibility = (layerType: LayerType) => {
    setLayers((prev) => ({
      ...prev,
      [layerType]: {
        ...prev[layerType],
        visible: !prev[layerType].visible,
      },
    }));
  };

  const updateLayerOpacity = (layerType: LayerType, opacity: number) => {
    setLayers((prev) => ({
      ...prev,
      [layerType]: {
        ...prev[layerType],
        opacity,
      },
    }));
  };

  const handleImageUpload = (layerType: LayerType, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setLayers((prev) => ({
        ...prev,
        [layerType]: {
          ...prev[layerType],
          image: imageData,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeLayerImage = (layerType: LayerType) => {
    setLayers((prev) => ({
      ...prev,
      [layerType]: {
        ...prev[layerType],
        image: null,
      },
    }));
  };

  const movePatternToLayer = (layerType: LayerType) => {
    setLayers((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as LayerType[]).forEach((key) => {
        updated[key] = { ...updated[key], hasPattern: false };
      });
      updated[layerType] = { ...updated[layerType], hasPattern: true };
      return updated;
    });
  };

  const updateLayerImageScale = (layerType: LayerType, scale: number) => {
    setLayers((prev) => ({
      ...prev,
      [layerType]: {
        ...prev[layerType],
        imageScale: scale,
      },
    }));
  };

  const updateLayerImageOffsetX = (layerType: LayerType, offsetX: number) => {
    setLayers((prev) => ({
      ...prev,
      [layerType]: {
        ...prev[layerType],
        imageOffsetX: offsetX,
      },
    }));
  };

  const updateLayerImageOffsetY = (layerType: LayerType, offsetY: number) => {
    setLayers((prev) => ({
      ...prev,
      [layerType]: {
        ...prev[layerType],
        imageOffsetY: offsetY,
      },
    }));
  };

  const toggleBackgroundGradient = () => {
    setLayers((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        useGradient: !prev.background.useGradient,
      },
    }));
  };

  const updateGradientAngle = (angle: number) => {
    setLayers((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        gradientAngle: angle,
      },
    }));
  };

  const addGradientColor = () => {
    setLayers((prev) => {
      const colors = prev.background.gradientColors || [];
      const newColor: GradientColor = {
        color: "#FFFFFF",
        position: 50,
      };
      return {
        ...prev,
        background: {
          ...prev.background,
          gradientColors: [...colors, newColor],
        },
      };
    });
  };

  const removeGradientColor = (index: number) => {
    setLayers((prev) => {
      const colors = prev.background.gradientColors || [];
      if (colors.length <= 2) return prev;
      return {
        ...prev,
        background: {
          ...prev.background,
          gradientColors: colors.filter((_, i) => i !== index),
        },
      };
    });
  };

  const updateGradientColor = (index: number, color: string) => {
    setLayers((prev) => {
      const colors = [...(prev.background.gradientColors || [])];
      colors[index] = { ...colors[index], color };
      return {
        ...prev,
        background: {
          ...prev.background,
          gradientColors: colors,
        },
      };
    });
  };

  const updateGradientPosition = (index: number, position: number) => {
    setLayers((prev) => {
      const colors = [...(prev.background.gradientColors || [])];
      colors[index] = { ...colors[index], position };
      return {
        ...prev,
        background: {
          ...prev.background,
          gradientColors: colors,
        },
      };
    });
  };

  const updateBackgroundColor = (color: string) => {
    setLayers((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        backgroundColor: color,
      },
    }));
  };

  // Tooltip translations
  const tooltips: Record<string, string> = {
    "Min Thickness": "선의 최소 두께",
    "Max Thickness": "선의 최대 두께",
    "Thickness Variation": "두께 변화 정도 (0=규칙적, 100=불규칙적)",
    "Bulge": "패턴의 부풀림 정도",
    "Twist": "비틀림 강도",
    "Overall Rotation": "전체 회전",
    "Wave Intensity": "웨이브 강도",
    "Pattern Scale": "패턴 전체 크기",
    "Rotate": "패턴 회전 각도 (-180° ~ 180°)",
    "Line Density": "선 밀도",
    "Color Repeats": "색상 반복 횟수",
    "Opacity": "불투명도",
    "Gaussian Blur": "가우시안 블러",
    "Y Position": "패턴의 세로 위치",
    "X Position": "패턴의 가로 위치",
    "Axis X": "좌우 원근감 (-10 ~ 10, 3D 효과)",
    "Axis Y": "상하 원근감 (-50 ~ 50, 3D 효과)",
    "Aspect Ratio": "캔버스 비율",
  };

  const styles = {
    container: {
      height: "100vh",
      background: "#0A0A0A",
      display: "flex",
      flexDirection: "column" as const,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: "hidden",
    } as React.CSSProperties,
    
    mainContent: {
      flex: 1,
      display: "flex",
      overflow: "hidden",
    } as React.CSSProperties,
    
    canvasSection: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem",
      background: "#000000",
      position: "relative" as const,
    } as React.CSSProperties,
    
    rightPanel: {
      width: "360px",
      minWidth: "360px",
      flexShrink: 0,
      backgroundColor: "#F5F5F5",
      overflowY: "auto" as const,
      display: "flex",
      flexDirection: "column" as const,
    } as React.CSSProperties,
    
    panelHeader: {
      padding: "1.5rem 1.5rem 1rem",
      borderBottom: "1px solid #E0E0E0",
      position: "sticky" as const,
      top: 0,
      backgroundColor: "#F5F5F5",
      zIndex: 10,
    } as React.CSSProperties,
    
    panelContent: {
      padding: "1.5rem",
      flex: 1,
    } as React.CSSProperties,
    
    buttonGroup: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "0",
    } as React.CSSProperties,
    
    primaryButton: {
      flex: 1,
      padding: "0.75rem 1rem",
      backgroundColor: "#000000",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.875rem",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      transition: "all 0.2s",
    } as React.CSSProperties,
    
    section: {
      marginBottom: "1.5rem",
      padding: "1.25rem",
      backgroundColor: "#FFFFFF",
      borderRadius: "8px",
      border: "1px solid #E0E0E0",
    } as React.CSSProperties,
    
    sectionTitle: {
      fontSize: "0.813rem",
      fontWeight: "700",
      color: "#000000",
      textTransform: "uppercase" as const,
      letterSpacing: "0.08em",
      marginBottom: "1.25rem",
      paddingBottom: "0.75rem",
      borderBottom: "2px solid #000000",
    } as React.CSSProperties,
    
    controlGroup: {
      marginBottom: "1.25rem",
    } as React.CSSProperties,
    
    controlLabel: {
      fontSize: "0.813rem",
      color: "#000000",
      marginBottom: "0.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "500",
    } as React.CSSProperties,
    
    slider: {
      width: "100%",
      height: "4px",
      borderRadius: "2px",
      background: "#E0E0E0",
      outline: "none",
      WebkitAppearance: "none" as const,
      cursor: "pointer",
    } as React.CSSProperties,
    
    select: {
      width: "100%",
      padding: "0.625rem 0.75rem",
      backgroundColor: "#FFFFFF",
      border: "1px solid #E0E0E0",
      borderRadius: "6px",
      fontSize: "0.875rem",
      color: "#000000",
      outline: "none",
      cursor: "pointer",
    } as React.CSSProperties,
    
    checkbox: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.75rem",
      backgroundColor: "#FFFFFF",
      border: "1px solid #E0E0E0",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.875rem",
      transition: "all 0.2s",
    } as React.CSSProperties,
    
    colorGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "0.5rem",
    } as React.CSSProperties,
    
    colorBox: {
      width: "100%",
      aspectRatio: "1",
      borderRadius: "6px",
      border: "2px solid #E0E0E0",
      cursor: "pointer",
      transition: "all 0.2s",
    } as React.CSSProperties,
    
    bottomBar: {
      height: "80px",
      backgroundColor: "#1A1A1A",
      borderTop: "1px solid #2A2A2A",
      display: "flex",
      alignItems: "center",
      padding: "0 1.5rem",
      gap: "1rem",
      flexShrink: 0,
      overflow: "hidden",
    } as React.CSSProperties,
    
    playButton: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      backgroundColor: "#FFFFFF",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s",
    } as React.CSSProperties,
    
    exportButton: {
      padding: "0.75rem 1.5rem",
      backgroundColor: "#FFFFFF",
      color: "#000000",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.875rem",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginLeft: "auto",
      transition: "all 0.2s",
    } as React.CSSProperties,
    
    layerItem: {
      padding: "0.75rem",
      backgroundColor: "#FFFFFF",
      border: "1px solid #E0E0E0",
      borderRadius: "8px",
      marginBottom: "0.5rem",
    } as React.CSSProperties,
    
    layerHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "0.5rem",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      {/* Main Content Area */}
      <div style={styles.mainContent}>
        
        {/* Left: Canvas Section */}
        <div style={styles.canvasSection}>
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "4px",
              boxShadow: "0 8px 32px rgba(255, 255, 255, 0.1)",
            }}
          />
        </div>

        {/* Right: Control Panel */}
        <div style={styles.rightPanel}>
          {/* Logo */}
          <div style={{
            padding: "1.5rem 1.5rem 1rem",
            borderBottom: "1px solid #E0E0E0",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#F5F5F5",
          }}>
            <img 
              src={bysecLogo} 
              alt="BYSEC Logo" 
              style={{
                height: "40px",
                width: "auto",
                objectFit: "contain"
              }}
            />
          </div>

          {/* Panel Header */}
          <div style={styles.panelHeader}>
            <div style={styles.buttonGroup}>
              <button
                onClick={resetToDefault}
                style={styles.primaryButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#333333";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#000000";
                }}
              >
                <Home size={16} />
                Reset
              </button>
              <button
                onClick={regenerate}
                style={styles.primaryButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#333333";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#000000";
                }}
              >
                <RefreshCw size={16} />
                Regenerate
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div style={styles.panelContent}>
            
            {/* Color Palette Section */}
            <div style={styles.section}>
              <h3 
                style={{...styles.sectionTitle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
                onClick={() => toggleAccordion('colorPalette')}
              >
                <span>Color Palette</span>
                {accordionState.colorPalette ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </h3>
              
              {accordionState.colorPalette && (
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <span>Color Palette</span>
                  <button
                    onClick={generateRandomPalette}
                    style={{
                      padding: "0.25rem 0.5rem",
                      backgroundColor: "#000000",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Palette size={12} />
                    Random
                  </button>
                </label>
                <div style={styles.colorGrid}>
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        ...styles.colorBox,
                        backgroundColor: color,
                        borderColor: editingColorIndex === index ? "#000000" : "#E0E0E0",
                        borderWidth: editingColorIndex === index ? "3px" : "2px",
                      }}
                      onClick={() => setEditingColorIndex(editingColorIndex === index ? null : index)}
                      title={color}
                    />
                  ))}
                </div>
                {editingColorIndex !== null && (
                  <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="color"
                      value={colors[editingColorIndex]}
                      onChange={(e) => handleColorChange(editingColorIndex, e.target.value)}
                      style={{
                        width: "48px",
                        height: "48px",
                        border: "2px solid #E0E0E0",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    />
                    <input
                      type="text"
                      value={colors[editingColorIndex]}
                      onChange={(e) => handleColorChange(editingColorIndex, e.target.value)}
                      style={{
                        flex: 1,
                        padding: "0.625rem",
                        border: "1px solid #E0E0E0",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        fontFamily: "monospace",
                      }}
                    />
                    {colors.length > 2 && (
                      <button
                        onClick={() => removeColor(editingColorIndex)}
                        style={{
                          padding: "0.625rem",
                          backgroundColor: "#FF4444",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
                {colors.length < 8 && (
                  <button
                    onClick={addColor}
                    style={{
                      width: "100%",
                      padding: "0.625rem",
                      marginTop: "0.5rem",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E0E0E0",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      color: "#666666",
                    }}
                  >
                    + Add Color
                  </button>
                )}
              </div>
              )}
            </div>

            {/* Pattern Controls Section */}
            <div style={styles.section}>
              <h3 
                style={{...styles.sectionTitle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
                onClick={() => toggleAccordion('patternControls')}
              >
                <span>Pattern Controls</span>
                {accordionState.patternControls ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </h3>

              {accordionState.patternControls && (
              <>
              {/* Min Thickness */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Min Thickness" 
                    tooltip={tooltips["Min Thickness"]}
                    value={minThickness.toFixed(1)}
                  />
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="50"
                  step="0.1"
                  value={minThickness}
                  onChange={(e) => setMinThickness(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Max Thickness */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Max Thickness" 
                    tooltip={tooltips["Max Thickness"]}
                    value={maxThickness.toFixed(1)}
                  />
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="100"
                  step="0.1"
                  value={maxThickness}
                  onChange={(e) => setMaxThickness(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Thickness Variation */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Thickness Variation" 
                    tooltip={tooltips["Thickness Variation"]}
                    value={`${Math.round(thicknessVariation * 100)}%`}
                  />
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={thicknessVariation}
                  onChange={(e) => setThicknessVariation(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Bulge */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Bulge" 
                    tooltip={tooltips["Bulge"]}
                    value={bulge.toFixed(2)}
                  />
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={bulge}
                  onChange={(e) => setBulge(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Twist */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Twist" 
                    tooltip={tooltips["Twist"]}
                    value={twist.toFixed(2)}
                  />
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.01"
                  value={twist}
                  onChange={(e) => setTwist(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Overall Rotation */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Overall Rotation" 
                    tooltip={tooltips["Overall Rotation"]}
                    value={twistRotation.toFixed(2)}
                  />
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={twistRotation}
                  onChange={(e) => setTwistRotation(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Wave Intensity */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Wave Intensity" 
                    tooltip={tooltips["Wave Intensity"]}
                    value={graphicScale.toFixed(2)}
                  />
                </label>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.01"
                  value={graphicScale}
                  onChange={(e) => setGraphicScale(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Line Density */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Line Density" 
                    tooltip={tooltips["Line Density"]}
                    value={density}
                  />
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={density}
                  onChange={(e) => setDensity(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Color Repeats */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Color Repeats" 
                    tooltip={tooltips["Color Repeats"]}
                    value={colorRepeats}
                  />
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={colorRepeats}
                  onChange={(e) => setColorRepeats(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Opacity */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Opacity" 
                    tooltip={tooltips["Opacity"]}
                    value={`${Math.round(opacity * 100)}%`}
                  />
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Gaussian Blur */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Gaussian Blur" 
                    tooltip={tooltips["Gaussian Blur"]}
                    value={`${patternBlur.toFixed(1)}px`}
                  />
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.1"
                  value={patternBlur}
                  onChange={(e) => setPatternBlur(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>
              </>
              )}
            </div>

            {/* Pattern Transform Section */}
            <div style={styles.section}>
              <h3 
                style={{...styles.sectionTitle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
                onClick={() => toggleAccordion('patternTransform')}
              >
                <span>Pattern Transform</span>
                {accordionState.patternTransform ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </h3>
              
              {accordionState.patternTransform && (
              <>
              {/* Pattern Scale */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Pattern Scale" 
                    tooltip={tooltips["Pattern Scale"]}
                    value={patternScale.toFixed(2)}
                  />
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={patternScale}
                  onChange={(e) => setPatternScale(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Pattern Rotate */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Rotate" 
                    tooltip={tooltips["Rotate"]}
                    value={`${patternRotate.toFixed(0)}°`}
                  />
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={patternRotate}
                  onChange={(e) => setPatternRotate(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* X Position */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="X Position" 
                    tooltip={tooltips["X Position"]}
                    value={`${(offsetX * 100).toFixed(0)}%`}
                  />
                </label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Y Position */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Y Position" 
                    tooltip={tooltips["Y Position"]}
                    value={`${(offsetY * 100).toFixed(0)}%`}
                  />
                </label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Axis X */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Axis X" 
                    tooltip={tooltips["Axis X"]}
                    value={axisX.toFixed(0)}
                  />
                </label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="1"
                  value={axisX}
                  onChange={(e) => setAxisX(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>

              {/* Axis Y */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Axis Y" 
                    tooltip={tooltips["Axis Y"]}
                    value={axisY.toFixed(0)}
                  />
                </label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={axisY}
                  onChange={(e) => setAxisY(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>
              </>
              )}
            </div>

            {/* Background Section */}
            <div style={styles.section}>
              <h3 
                style={{...styles.sectionTitle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
                onClick={() => toggleAccordion('background')}
              >
                <span>Background</span>
                {accordionState.background ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </h3>
              
              {accordionState.background && (
              <>
              {/* Aspect Ratio */}
              <div style={styles.controlGroup}>
                <label style={styles.controlLabel}>
                  <Tooltip 
                    text="Aspect Ratio" 
                    tooltip={tooltips["Aspect Ratio"]}
                  />
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  style={styles.select}
                >
                  <option value="1:1">1:1 (Square)</option>
                  <option value="3:4">3:4 (Portrait)</option>
                  <option value="9:16">9:16 (Mobile)</option>
                  <option value="16:9">16:9 (Landscape)</option>
                </select>
              </div>

              {/* Transparent Background */}
              <div style={styles.controlGroup}>
                <label
                  style={{
                    ...styles.checkbox,
                    backgroundColor: transparentBg ? "#000000" : "#FFFFFF",
                    color: transparentBg ? "#FFFFFF" : "#000000",
                  }}
                  onClick={() => handleTransparentBgToggle(!transparentBg)}
                >
                  <input
                    type="checkbox"
                    checked={transparentBg}
                    onChange={(e) => handleTransparentBgToggle(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  Transparent Background
                </label>
              </div>
              </>
              )}
            </div>

            {/* Layers Section */}
            <div style={styles.section}>
              <h3 
                style={{...styles.sectionTitle, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
                onClick={() => toggleAccordion('layers')}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Layers size={14} style={{ marginRight: "0.5rem" }} />
                  Layers
                </span>
                {accordionState.layers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </h3>
              
              {accordionState.layers && (
              <>
              {(["pattern", "background"] as LayerType[]).map((layerType) => {
                const layer = layers[layerType];
                const displayName = layerType === "background" ? "Background Layer" : "Pattern Layer";
                
                return (
                  <div key={layerType} style={styles.layerItem}>
                    <div style={styles.layerHeader}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                          onClick={() => toggleLayerVisibility(layerType)}
                          style={{
                            padding: "0.25rem",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                          {displayName}
                        </span>
                      </div>
                    </div>

                    {/* Layer Opacity */}
                    <div style={{ marginTop: "0.75rem" }}>
                      <label style={{ ...styles.controlLabel, fontSize: "0.75rem" }}>
                        <span>Opacity</span>
                        <span style={{ color: "#666666" }}>{Math.round(layer.opacity * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={layer.opacity}
                        onChange={(e) => updateLayerOpacity(layerType, Number(e.target.value))}
                        style={styles.slider}
                      />
                    </div>

                    {/* Image Upload */}
                    {layer.image ? (
                      <div style={{ marginTop: "0.75rem" }}>
                        <img
                          src={layer.image}
                          alt={`${layerType} layer`}
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            marginBottom: "0.5rem",
                          }}
                        />
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => removeLayerImage(layerType)}
                            style={{
                              flex: 1,
                              padding: "0.5rem",
                              backgroundColor: "#FF4444",
                              color: "#FFFFFF",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                            }}
                          >
                            Remove Image
                          </button>
                        </div>

                        {/* Image Scale */}
                        <div style={{ marginTop: "0.75rem" }}>
                          <label style={{ ...styles.controlLabel, fontSize: "0.75rem" }}>
                            <span>Scale</span>
                            <span style={{ color: "#666666" }}>{layer.imageScale.toFixed(2)}</span>
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.01"
                            value={layer.imageScale}
                            onChange={(e) => updateLayerImageScale(layerType, Number(e.target.value))}
                            style={styles.slider}
                          />
                        </div>

                        {/* Image Offset X */}
                        <div style={{ marginTop: "0.75rem" }}>
                          <label style={{ ...styles.controlLabel, fontSize: "0.75rem" }}>
                            <span>Offset X</span>
                            <span style={{ color: "#666666" }}>{(layer.imageOffsetX * 100).toFixed(0)}%</span>
                          </label>
                          <input
                            type="range"
                            min="-1"
                            max="1"
                            step="0.01"
                            value={layer.imageOffsetX}
                            onChange={(e) => updateLayerImageOffsetX(layerType, Number(e.target.value))}
                            style={styles.slider}
                          />
                        </div>

                        {/* Image Offset Y */}
                        <div style={{ marginTop: "0.75rem" }}>
                          <label style={{ ...styles.controlLabel, fontSize: "0.75rem" }}>
                            <span>Offset Y</span>
                            <span style={{ color: "#666666" }}>{(layer.imageOffsetY * 100).toFixed(0)}%</span>
                          </label>
                          <input
                            type="range"
                            min="-1"
                            max="1"
                            step="0.01"
                            value={layer.imageOffsetY}
                            onChange={(e) => updateLayerImageOffsetY(layerType, Number(e.target.value))}
                            style={styles.slider}
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRefs.current[layerType]?.click()}
                        style={{
                          width: "100%",
                          padding: "0.625rem",
                          marginTop: "0.75rem",
                          backgroundColor: "#FFFFFF",
                          border: "1px dashed #CCCCCC",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          color: "#666666",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Upload size={14} />
                        Upload Image
                      </button>
                    )}
                    
                    <input
                      ref={(el) => (fileInputRefs.current[layerType] = el)}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(layerType, file);
                        }
                      }}
                    />

                    {/* Background Gradient Controls - only for background layer */}
                    {layerType === "background" && !transparentBg && (
                      <BackgroundGradientControls
                        layer={layers.background}
                        onToggleGradient={toggleBackgroundGradient}
                        onUpdateAngle={updateGradientAngle}
                        onAddColor={addGradientColor}
                        onRemoveColor={removeGradientColor}
                        onUpdateColor={updateGradientColor}
                        onUpdatePosition={updateGradientPosition}
                        onUpdateBackgroundColor={updateBackgroundColor}
                      />
                    )}
                  </div>
                );
              })}
              </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Timeline & Export */}
      <div style={styles.bottomBar}>
        {/* Play/Pause Button */}
        <button
          onClick={toggleAnimation}
          style={styles.playButton}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isAnimating ? <Pause size={24} color="#000000" /> : <Play size={24} color="#000000" />}
        </button>

        {/* Animation Type */}
        <div style={{
          padding: "0.75rem 1rem",
          backgroundColor: "#2A2A2A",
          color: "#FFFFFF",
          border: "1px solid #3A3A3A",
          borderRadius: "6px",
          fontSize: "0.875rem",
          minWidth: "80px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          Pulse
        </div>

        {/* Animation Speed */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "180px", flexShrink: 0 }}>
          <span style={{ fontSize: "0.75rem", color: "#AAAAAA", whiteSpace: "nowrap" }}>Speed:</span>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "2px",
              background: "#3A3A3A",
              outline: "none",
            }}
          />
          <span style={{ fontSize: "0.75rem", color: "#FFFFFF", minWidth: "2rem" }}>
            {animationSpeed.toFixed(1)}x
          </span>
        </div>

        {/* Export Format */}
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#2A2A2A",
            color: "#FFFFFF",
            border: "1px solid #3A3A3A",
            borderRadius: "6px",
            fontSize: "0.875rem",
            outline: "none",
            cursor: "pointer",
            minWidth: "90px",
            flexShrink: 0,
          }}
        >
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
        </select>

        {/* Export Button */}
        <button
          onClick={handleExport}
          style={styles.exportButton}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#EEEEEE";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
          }}
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
}
