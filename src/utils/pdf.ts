import { jsPDF, jsPDFOptions } from 'jspdf'
import 'svg2pdf.js'
import { preprocessSVG } from './svg';

export const pageSizes = {
  A4: { width: 21, height: 29.7 },
  Letter: { width: 21.59, height: 27.94 },
};

export const openPDF = async (elements: Array<Element>, pageSize: 'A4' | 'Letter') => {
  const document = await createPDF(elements, pageSize);

  if (document)
    window.open(document.output('bloburl'));
}

export const downloadPDF = async (elements: Array<Element>, pageSize: 'A4' | 'Letter') => {
  const document = await createPDF(elements, pageSize);

  if (document)
    document.save('calendar.pdf');
}

const createPDF = async (elements: Array<Element>, pageSize: 'A4' | 'Letter'): Promise<jsPDF | null> => {
  if (!elements || elements.length === 0 || !elements[0])
    return null;

  const options: jsPDFOptions = {
    orientation: 'portrait',
    format: [pageSizes[pageSize].width, pageSizes[pageSize].height],
    unit: 'cm',
  };

  const document: jsPDF = new jsPDF(options);

  document.setProperties({
    title: 'Calendar',
  });

  document.addFont(
    'http://fonts.gstatic.com/s/worksans/v3/zVvigUiMvx7JVEnrJgc-5Q.ttf', 'Work Sans', 'normal');

  document.addFont(
    'http://fonts.gstatic.com/s/worksans/v3/z9rX03Xuz9ZNHTMg1_ghGS3USBnSvpkopQaUR-2r7iU.ttf', 'Work Sans', 'normal', 'bold');
  
  document.setFont('Work Sans');

  for (const [index, element] of elements.entries()) {
    // @ts-ignore
    await document.svg(preprocessSVG(element));
    
    if (index < elements.length - 1) 
      document.addPage();
  }

  return document;
};
