const puppeteer = require('puppeteer');
const path = require('path');


async function generatePDF() {
  console.log('🚀 Starting PDF generation...');
  
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  
  const page = await browser.newPage();
  
  // Load the compiled HTML file
  const htmlPath = path.resolve(__dirname, '../dist/index.html');
  console.log(`📄 Loading HTML from: ${htmlPath}`);
  
  await page.goto(`file://${htmlPath}`, { 
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  // Wait for fonts and styles to load
  await page.evaluateHandle('document.fonts.ready');
  
  // Force light theme for PDF (better for printing)
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });
  
  // Generate PDF with print-optimized settings
  const pdfFilename = 'cv_cojuhari_dumitru.pdf';
  const pdfPath = path.resolve(__dirname, '../dist', pdfFilename);
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: false,
    margin: {
      top: '12mm',
      right: '12mm',
      bottom: '12mm',
      left: '12mm'
    }
  });
  
  await browser.close();
  console.log(`✅ PDF generated successfully: ${pdfPath}`);
}

generatePDF().catch((error) => {
  console.error('❌ PDF generation failed:', error);
  process.exit(1);
});
