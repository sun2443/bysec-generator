import { useEffect, useRef } from 'react';
import { RGB, interpolateColors, rgbToString, getDarkestColor, darkenColor } from '../utils/colorExtraction';
import { SeededRandom } from '../utils/seededRandom';

export interface PatternSettings {
  aspectRatio: string;
  lineThickness: number;
  bulgeAmount: number;
  rotation: number;
  waveStrength: number;
  lineDensity: number;
  colorRepeats: number;
  opacity: number;
  seed: number;
}

interface PatternCanvasProps {
  colors: RGB[];
  settings: PatternSettings;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function PatternCanvas({ colors, settings, onCanvasReady }: PatternCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || colors.length === 0) return;
    
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size based on aspect ratio
    const aspectRatios: Record<string, [number, number]> = {
      '1:1': [1, 1],
      '3:4': [3, 4],
      '9:16': [9, 16],
      '16:9': [16, 9]
    };
    
    const [w, h] = aspectRatios[settings.aspectRatio];
    const baseSize = 800;
    canvas.width = baseSize * w / Math.max(w, h);
    canvas.height = baseSize * h / Math.max(w, h);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create background gradient
    const darkestColor = getDarkestColor(colors);
    const darkerColor = darkenColor(darkestColor, 0.3);
    
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.max(canvas.width, canvas.height) / 2
    );
    gradient.addColorStop(0, rgbToString(darkestColor));
    gradient.addColorStop(1, rgbToString(darkerColor));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Generate pattern
    drawFiberPattern(ctx, canvas.width, canvas.height, colors, settings);
    
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [colors, settings, onCanvasReady]);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto border border-gray-300 rounded-lg shadow-lg"
    />
  );
}

function drawFiberPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: RGB[],
  settings: PatternSettings
) {
  const {
    lineThickness,
    bulgeAmount,
    rotation,
    waveStrength,
    lineDensity,
    colorRepeats,
    opacity,
    seed
  } = settings;
  
  const random = new SeededRandom(seed);
  const numLines = lineDensity;
  const segments = 500;
  
  // Calculate line positions and properties
  const lines: Array<{
    y: number;
    thickness: number;
    colorPosition: number;
    depth: number;
  }> = [];
  
  for (let i = 0; i < numLines; i++) {
    const t = i / (numLines - 1);
    lines.push({
      y: t * height,
      thickness: lineThickness * random.range(0.8, 1.2),
      colorPosition: t * colorRepeats,
      depth: Math.sin(t * Math.PI) // 0 to 1 to 0, creating depth illusion
    });
  }
  
  // Draw lines from back to front (sorted by depth)
  const sortedLines = [...lines].sort((a, b) => a.depth - b.depth);
  
  for (const line of sortedLines) {
    drawTwistedLine(ctx, width, height, line, colors, settings, random);
  }
}

function drawTwistedLine(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  line: { y: number; thickness: number; colorPosition: number; depth: number },
  colors: RGB[],
  settings: PatternSettings,
  random: SeededRandom
) {
  const segments = 500;
  const { bulgeAmount, rotation, waveStrength, opacity } = settings;
  
  ctx.beginPath();
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = t * width;
    
    // Calculate bulge (lens/eye shape) using sine wave
    const bulge = Math.sin(t * Math.PI) * (bulgeAmount / 100) * height * waveStrength;
    
    // Calculate 3D rotation
    const rotationAngle = t * rotation * Math.PI * 2;
    const depth = Math.sin(rotationAngle);
    
    // Scale factor based on rotation (creates 3D twist illusion)
    const scale = 0.5 + (depth + 1) / 2 * 0.5; // 0.5 to 1.0
    
    // Final y position with bulge and 3D effect
    const y = line.y + bulge * scale;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  // Get color for this line
  const color = interpolateColors(colors, line.colorPosition);
  
  // Calculate alpha based on depth and opacity setting
  const depthAlpha = 0.7 + line.depth * 0.3; // 0.7 to 1.0
  const finalAlpha = (opacity / 100) * depthAlpha;
  
  ctx.strokeStyle = rgbToString(color, finalAlpha);
  ctx.lineWidth = line.thickness;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}
