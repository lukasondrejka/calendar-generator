import type { jsPDF } from 'jspdf';
import { cmToPx } from './units';

export interface PDFOptions {
  width: number; // cm
  height: number; // cm
  title: string;
  fileName: string;
}

const FONTS = [
  { url: 'https://fonts.gstatic.com/s/worksans/v3/zVvigUiMvx7JVEnrJgc-5Q.ttf', weight: 'normal' },
  { url: 'https://fonts.gstatic.com/s/worksans/v3/z9rX03Xuz9ZNHTMg1_ghGS3USBnSvpkopQaUR-2r7iU.ttf', weight: 'bold' },
];

// svg2pdf doesn't understand cm, so attributes (never text) are converted to px
const toPx = (svg: Element): Element => {
  const clone = svg.cloneNode(true) as Element;
  for (const node of [clone, ...clone.querySelectorAll('*')])
    for (const { name, value } of node.attributes)
      if (value.includes('cm'))
        node.setAttribute(name, value.replace(/(\d+(?:\.\d+)?)cm/g, (_, cm) => `${cmToPx(Number(cm)).toFixed(4)}px`));
  return clone;
};

const createPDF = async (pages: Element[], { width, height, title }: PDFOptions): Promise<jsPDF> => {
  // Loaded on demand, it's most of the bundle
  const [{ jsPDF }] = await Promise.all([import('jspdf'), import('svg2pdf.js')]);
  const pdf = new jsPDF({ unit: 'cm', format: [width, height] });

  pdf.setProperties({ title, creator: 'Calendar Generator' });
  for (const font of FONTS)
    pdf.addFont(font.url, 'Work Sans', 'normal', font.weight);
  pdf.setFont('Work Sans');

  for (const [index, page] of pages.entries()) {
    if (index > 0)
      pdf.addPage();
    await pdf.svg(toPx(page));
  }
  return pdf;
};

export const downloadPDF = async (pages: Element[], options: PDFOptions) => {
  (await createPDF(pages, options)).save(options.fileName);
};

export const openPDF = async (pages: Element[], options: PDFOptions) => {
  // Opened right in the click handler, a tab opened after the async render would be blocked as a popup
  const tab = window.open('', '_blank');
  try {
    const url = (await createPDF(pages, options)).output('bloburl').toString();
    if (tab)
      tab.location.href = url;
    else
      window.open(url, '_blank');
  } catch (error) {
    tab?.close();
    throw error;
  }
};
