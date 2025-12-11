// Color extraction and manipulation utilities

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function extractDominantColors(image: HTMLImageElement, count: number = 4): RGB[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Downsample for performance
  const maxSize = 100;
  const scale = Math.min(maxSize / image.width, maxSize / image.height);
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;
  
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  
  // Collect all colors with basic sampling
  const colors: RGB[] = [];
  for (let i = 0; i < pixels.length; i += 4 * 4) { // Sample every 4th pixel
    colors.push({
      r: pixels[i],
      g: pixels[i + 1],
      b: pixels[i + 2]
    });
  }
  
  // K-means clustering
  return kMeansClustering(colors, count);
}

function kMeansClustering(colors: RGB[], k: number, iterations: number = 10): RGB[] {
  if (colors.length === 0) return [];
  
  // Initialize centroids randomly
  let centroids: RGB[] = [];
  for (let i = 0; i < k; i++) {
    centroids.push(colors[Math.floor(Math.random() * colors.length)]);
  }
  
  for (let iter = 0; iter < iterations; iter++) {
    // Assign colors to nearest centroid
    const clusters: RGB[][] = Array.from({ length: k }, () => []);
    
    for (const color of colors) {
      let minDist = Infinity;
      let clusterIndex = 0;
      
      for (let i = 0; i < centroids.length; i++) {
        const dist = colorDistance(color, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = i;
        }
      }
      
      clusters[clusterIndex].push(color);
    }
    
    // Update centroids
    centroids = clusters.map(cluster => {
      if (cluster.length === 0) return centroids[0]; // Fallback
      
      const sum = cluster.reduce((acc, color) => ({
        r: acc.r + color.r,
        g: acc.g + color.g,
        b: acc.b + color.b
      }), { r: 0, g: 0, b: 0 });
      
      return {
        r: Math.round(sum.r / cluster.length),
        g: Math.round(sum.g / cluster.length),
        b: Math.round(sum.b / cluster.length)
      };
    });
  }
  
  return centroids;
}

function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

export function getDarkestColor(colors: RGB[]): RGB {
  return colors.reduce((darkest, color) => {
    const brightness = (color.r + color.g + color.b) / 3;
    const darkestBrightness = (darkest.r + darkest.g + darkest.b) / 3;
    return brightness < darkestBrightness ? color : darkest;
  });
}

export function darkenColor(color: RGB, amount: number): RGB {
  return {
    r: Math.max(0, Math.round(color.r * (1 - amount))),
    g: Math.max(0, Math.round(color.g * (1 - amount))),
    b: Math.max(0, Math.round(color.b * (1 - amount)))
  };
}

export function interpolateColors(colors: RGB[], position: number): RGB {
  const repeats = Math.floor(position);
  const fraction = position - repeats;
  
  const index = fraction * colors.length;
  const colorIndex1 = Math.floor(index) % colors.length;
  const colorIndex2 = (colorIndex1 + 1) % colors.length;
  const t = index - Math.floor(index);
  
  const c1 = colors[colorIndex1];
  const c2 = colors[colorIndex2];
  
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t)
  };
}

export function rgbToString(color: RGB, alpha: number = 1): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}
