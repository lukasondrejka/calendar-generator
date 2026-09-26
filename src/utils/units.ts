const PX_PER_CM = 96 / 2.54;

export const cmToPx = (cm: number): number => cm * PX_PER_CM;
export const pxToCm = (px: number): number => px / PX_PER_CM;
export const cmToIn = (cm: number): number => cm / 2.54;
export const inToCm = (inches: number): number => inches * 2.54;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

// Rounds to a multiple of step without floating point noise (0.30000000000000004)
export const roundTo = (value: number, step: number): number =>
  Number((Math.round(value / step) * step).toFixed(6));
