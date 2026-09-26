import { pxToCm } from './units';

type FontWeight = 'normal' | 'bold';

let context: CanvasRenderingContext2D | null | undefined;

// Width in cm of a text rendered in the calendar SVG
export const textWidth = (text: string, fontSize: number, fontWeight: FontWeight = 'normal'): number => {
  context ??= document.createElement('canvas').getContext('2d');
  if (!context)
    return pxToCm(text.length * fontSize * 0.55);

  context.font = `${fontWeight} ${fontSize}px "Work Sans", sans-serif`;
  return pxToCm(context.measureText(text).width);
};

// Largest font size down to minSize at which the text fits, otherwise the text is shortened with "…"
export const fitText = (text: string, maxWidth: number, maxSize: number, minSize: number, fontWeight: FontWeight = 'normal') => {
  for (let size = maxSize; size >= minSize; size--)
    if (textWidth(text, size, fontWeight) <= maxWidth)
      return { text, fontSize: size };

  let shortened = text;
  while (shortened.length > 1 && textWidth(`${shortened}…`, minSize, fontWeight) > maxWidth)
    shortened = shortened.slice(0, -1);
  return { text: `${shortened.trimEnd()}…`, fontSize: minSize };
};
