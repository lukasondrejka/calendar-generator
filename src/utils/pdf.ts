// PDF utils

import { jsPDF, jsPDFOptions } from 'jspdf'
import 'svg2pdf.js'
import { preprocessSVG } from './svg';
import { pxToCm } from './units';

export const openPDF = async (elements: Array<Element>) => {
  const document = await createPDF(elements);

  if (document)
    window.open(document.output('bloburl'));
}

export const downloadPDF = async (elements: Array<Element>) => {
  const document = await createPDF(elements);

  if (document)
    document.save('calendar.pdf');
}

const createPDF = async (elements: Array<Element>): Promise<jsPDF | null> => {
  if (!elements || elements.length === 0 || !elements[0])
    return null;

  const options: jsPDFOptions = {
    orientation: 'portrait',
    format: [
      pxToCm(elements[0].clientWidth), 
      pxToCm(elements[0].clientHeight)
    ],
    unit: 'cm',
  };

  const document: jsPDF = new jsPDF(options);

  document.setProperties({
    title: 'Calendar',
  });

  for (const [index, element] of elements.entries()) {
    console.log('element', element);
    // @ts-ignore
    await document.svg(preprocessSVG(element));
    
    if (index < elements.length - 1) 
      document.addPage();
  }

  return document;
};
