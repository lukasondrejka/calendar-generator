import { cmToPx } from './units';

export const preprocessSVG = (element: Element): Element => {
  let svgContent = element.outerHTML;
  svgContent = convertUnits(svgContent);
  element = new DOMParser()
    .parseFromString(svgContent, 'image/svg+xml').documentElement;

  return element;
}

const convertUnits = (svgContent: string): string => {
  const cmRegex = /(\d+(\.\d+)?)cm/g;

  return svgContent.replace(cmRegex, (_, p1) => {
    const cmValue = parseFloat(p1);
    const pxValue = cmToPx(cmValue);
    return `${pxValue.toFixed(4)}px`;
  });
};
