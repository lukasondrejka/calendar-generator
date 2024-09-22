import { jsPDF, jsPDFOptions } from 'jspdf'
import 'svg2pdf.js'
import { preprocessSVG } from './svg';

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

  const pageSizes = {
    A4: [21, 29.7],
    Letter: [21.59, 27.94],
  };

  const options: jsPDFOptions = {
    orientation: 'portrait',
    format: [...pageSizes[pageSize]],
    unit: 'cm',
  };

  const document: jsPDF = new jsPDF(options);

  document.setProperties({
    title: 'Calendar',
  });

  document.addFont(
    'http://fonts.gstatic.com/s/worksans/v2/zVvigUiMvx7JVEnrJgc-5Q.ttf', 
    'Work Sans', 'normal');

  document.addFont(
    'http://fonts.gstatic.com/s/worksans/v2/4udXuXg54JlPEP5iKO5AmS3USBnSvpkopQaUR-2r7iU.ttf', 'Work Sans', 'bold');
  document.setFont('Work Sans');

  for (const [index, element] of elements.entries()) {
    console.log('element', element);
    // @ts-ignore
    await document.svg(preprocessSVG(element));
    
    if (index < elements.length - 1) 
      document.addPage();
  }

  return document;
};
