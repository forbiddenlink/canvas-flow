import * as fabric from 'fabric';

/**
 * Advanced image adjustment utilities for Canvas
 * Implements professional photo editing adjustments
 */

export interface AdjustmentValues {
  brightness?: number; // -100 to 100
  contrast?: number; // -100 to 100
  saturation?: number; // -100 to 100
  temperature?: number; // -100 to 100
  exposure?: number; // -2 to 2 EV
  shadows?: number; // -100 to 100
  highlights?: number; // -100 to 100
  vibrance?: number; // -100 to 100
}

/**
 * Apply temperature adjustment (warm/cool tones)
 * @param image Fabric image object
 * @param value Temperature value (-100 to 100)
 */
export function applyTemperature(
  image: fabric.Image,
  value: number
): void {
  if (!image.filters) image.filters = [];

  // Remove existing temperature filter
  image.filters = image.filters.filter(
    (f) => !(f && 'temperature' in f)
  );

  if (value !== 0) {
    // Temperature adjustment using color matrix
    // Warm (positive): add red/yellow, reduce blue
    // Cool (negative): add blue, reduce red/yellow
    const normalized = value / 100;
    const matrix = new fabric.filters.ColorMatrix({
      matrix: [
        1 + normalized * 0.3, 0, 0, 0, 0,                    // R
        0, 1 + normalized * 0.1, 0, 0, 0,                    // G
        0, 0, 1 - normalized * 0.3, 0, 0,                    // B
        0, 0, 0, 1, 0
      ],
    });
    (matrix as any).temperature = true; // Mark for identification
    image.filters.push(matrix);
  }

  image.applyFilters();
}

/**
 * Apply exposure adjustment (EV stops)
 * @param image Fabric image object
 * @param value Exposure value (-2 to 2 EV)
 */
export function applyExposure(
  image: fabric.Image,
  value: number
): void {
  if (!image.filters) image.filters = [];

  // Remove existing exposure filter
  image.filters = image.filters.filter(
    (f) => !(f && 'exposure' in f)
  );

  if (value !== 0) {
    // Exposure in EV stops (each stop doubles/halves light)
    const multiplier = Math.pow(2, value);
    const brightness = (multiplier - 1) * 255;

    const filter = new fabric.filters.Brightness({
      brightness: brightness / 255,
    });
    (filter as any).exposure = true; // Mark for identification
    image.filters.push(filter);
  }

  image.applyFilters();
}

/**
 * Apply shadows adjustment (lift or deepen shadows)
 * @param image Fabric image object
 * @param value Shadows value (-100 to 100)
 */
export function applyShadows(
  image: fabric.Image,
  value: number
): void {
  if (!image.filters) image.filters = [];

  // Remove existing shadows filter
  image.filters = image.filters.filter(
    (f) => !(f && 'shadows' in f)
  );

  if (value !== 0) {
    // Shadows: adjust darker tones without affecting highlights
    const normalized = value / 100;
    const filter = new fabric.filters.Brightness({
      brightness: normalized * 0.5,
    });
    (filter as any).shadows = true;
    image.filters.push(filter);

    // Add contrast to keep midtones in check
    const contrastFilter = new fabric.filters.Contrast({
      contrast: -normalized * 0.2,
    });
    (contrastFilter as any).shadowsContrast = true;
    image.filters.push(contrastFilter);
  }

  image.applyFilters();
}

/**
 * Apply highlights adjustment (recover or boost highlights)
 * @param image Fabric image object
 * @param value Highlights value (-100 to 100)
 */
export function applyHighlights(
  image: fabric.Image,
  value: number
): void {
  if (!image.filters) image.filters = [];

  // Remove existing highlights filter
  image.filters = image.filters.filter(
    (f) => !(f && 'highlights' in f)
  );

  if (value !== 0) {
    // Highlights: adjust brighter tones
    const normalized = value / 100;
    const filter = new fabric.filters.Brightness({
      brightness: -normalized * 0.5,
    });
    (filter as any).highlights = true;
    image.filters.push(filter);

    // Add contrast to preserve shadow detail
    const contrastFilter = new fabric.filters.Contrast({
      contrast: normalized * 0.2,
    });
    (contrastFilter as any).highlightsContrast = true;
    image.filters.push(contrastFilter);
  }

  image.applyFilters();
}

/**
 * Auto white balance - analyze and correct color cast
 * @param image Fabric image object
 */
export function autoWhiteBalance(image: fabric.Image): void {
  if (!image.getElement()) return;

  const element = image.getElement() as HTMLImageElement | HTMLCanvasElement;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;

  canvas.width = element.width || 100;
  canvas.height = element.height || 100;
  ctx.drawImage(element, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Calculate average RGB values
  let totalR = 0, totalG = 0, totalB = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    totalR += data[i];
    totalG += data[i + 1];
    totalB += data[i + 2];
  }

  const avgR = totalR / pixelCount;
  const avgG = totalG / pixelCount;
  const avgB = totalB / pixelCount;

  // Calculate correction factors (aim for gray average)
  const avg = (avgR + avgG + avgB) / 3;
  const rFactor = avg / avgR;
  const gFactor = avg / avgG;
  const bFactor = avg / avgB;

  // Apply color matrix correction
  if (!image.filters) image.filters = [];
  
  // Remove existing auto white balance
  image.filters = image.filters.filter(
    (f) => !(f && 'autoWhiteBalance' in f)
  );

  const matrix = new fabric.filters.ColorMatrix({
    matrix: [
      rFactor, 0, 0, 0, 0,
      0, gFactor, 0, 0, 0,
      0, 0, bFactor, 0, 0,
      0, 0, 0, 1, 0
    ],
  });
  (matrix as any).autoWhiteBalance = true;
  image.filters.push(matrix);

  image.applyFilters();
}

/**
 * Apply all adjustments at once
 * @param image Fabric image object
 * @param values Object with adjustment values
 */
export function applyAllAdjustments(
  image: fabric.Image,
  values: AdjustmentValues
): void {
  if (values.temperature !== undefined) {
    applyTemperature(image, values.temperature);
  }
  if (values.exposure !== undefined) {
    applyExposure(image, values.exposure);
  }
  if (values.shadows !== undefined) {
    applyShadows(image, values.shadows);
  }
  if (values.highlights !== undefined) {
    applyHighlights(image, values.highlights);
  }
  
  // Apply standard adjustments
  if (values.brightness !== undefined) {
    const filter = new fabric.filters.Brightness({
      brightness: values.brightness / 100,
    });
    if (!image.filters) image.filters = [];
    image.filters.push(filter);
  }
  
  if (values.contrast !== undefined) {
    const filter = new fabric.filters.Contrast({
      contrast: values.contrast / 100,
    });
    if (!image.filters) image.filters = [];
    image.filters.push(filter);
  }
  
  if (values.saturation !== undefined) {
    const filter = new fabric.filters.Saturation({
      saturation: values.saturation / 100,
    });
    if (!image.filters) image.filters = [];
    image.filters.push(filter);
  }

  image.applyFilters();
}

/**
 * Reset all adjustments
 * @param image Fabric image object
 */
export function resetAdjustments(image: fabric.Image): void {
  image.filters = [];
  image.applyFilters();
}
