// PDF utils

import { jsPDF } from 'jspdf'
import 'svg2pdf.js'
import { preprocessSVG } from './svg';
import { pxToCm } from './units';

export const openPDF = async (element: Element) => {
  const document = await createPDF(element);

  if (document)
    window.open(document.output('bloburl'));
}

export const downloadPDF = async (element: Element) => {
  const document = await createPDF(element);

  if (document)
    document.save('calendar.pdf');
}

const createPDF = async (element: Element): Promise<jsPDF | null> => {
  if (!element) 
    return null;

  const document: jsPDF = new jsPDF({
    orientation: 'portrait',
    format: [
      pxToCm(element.clientWidth), 
      pxToCm(element.clientHeight)
    ],
    unit: 'cm',
  });

  document.setProperties({
    title: 'Calendar',
  });

  // @ts-ignore
  await document.svg(preprocessSVG(element));

  return document;
};
