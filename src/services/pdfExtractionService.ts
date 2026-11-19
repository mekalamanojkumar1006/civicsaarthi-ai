/**
 * CivicSaarthi AI - PDF Text Extraction Service
 *
 * Extracts text page-by-page from citizen documents and government gazette notifications.
 * Preserves page numbers, handles multi-page documents, detects scanned-only PDFs (OCR requirement),
 * and gracefully flags password-protected or corrupted files.
 */

export interface ExtractedPage {
  pageNumber: number
  text: string
  wordCount: number
}

export interface PdfExtractionResult {
  success: boolean
  totalPages: number
  pages: ExtractedPage[]
  fullText: string
  isScannedOnly: boolean
  isPasswordProtected: boolean
  error?: string
}

/**
 * Dynamically loads pdfjs-dist to support both browser environments (with worker)
 * and build/node environments cleanly.
 */
async function getPdfJs() {
  // Use legacy build for maximum compatibility across browser and serverless runtimes
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.min.mjs')
  return pdfjs
}

/**
 * Extracts structured text from an ArrayBuffer or Uint8Array representing a PDF file.
 */
export async function extractTextFromPdf(data: ArrayBuffer | Uint8Array): Promise<PdfExtractionResult> {
  try {
    const pdfjs = await getPdfJs()

    const loadingTask = pdfjs.getDocument({
      data: data instanceof Uint8Array ? data : new Uint8Array(data),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    })

    const pdfDoc = await loadingTask.promise
    const totalPages = pdfDoc.numPages
    const pages: ExtractedPage[] = []
    let combinedText = ''

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum)
      const textContent = await page.getTextContent()

      // Concatenate text items preserving order
      const pageStrings = textContent.items
        .map((item: any) => (item && 'str' in item ? item.str : ''))
        .filter((str: string) => str.trim().length > 0)

      const pageText = pageStrings.join(' ').replace(/\s+/g, ' ').trim()
      const wordCount = pageText ? pageText.split(/\s+/).length : 0

      pages.push({
        pageNumber: pageNum,
        text: pageText,
        wordCount,
      })

      if (pageText) {
        combinedText += `\n[--- Page ${pageNum} ---]\n${pageText}\n`
      }
    }

    const totalWords = pages.reduce((acc, p) => acc + p.wordCount, 0)
    // If a document has pages but less than 10 words total, it is likely an image scan
    const isScannedOnly = totalPages > 0 && totalWords < 10

    return {
      success: true,
      totalPages,
      pages,
      fullText: combinedText.trim(),
      isScannedOnly,
      isPasswordProtected: false,
    }
  } catch (err: any) {
    const errorMsg = err?.message || String(err)

    if (errorMsg.includes('PasswordException') || errorMsg.toLowerCase().includes('password')) {
      return {
        success: false,
        totalPages: 0,
        pages: [],
        fullText: '',
        isScannedOnly: false,
        isPasswordProtected: true,
        error: 'Password-protected PDF document. Citizen unlock password required.',
      }
    }

    return {
      success: false,
      totalPages: 0,
      pages: [],
      fullText: '',
      isScannedOnly: false,
      isPasswordProtected: false,
      error: `Failed to extract PDF text: ${errorMsg}`,
    }
  }
}

/**
 * Convenience helper to extract text directly from a File or Blob object in the browser.
 */
export async function extractTextFromBlob(blob: Blob): Promise<PdfExtractionResult> {
  const arrayBuffer = await blob.arrayBuffer()
  return extractTextFromPdf(arrayBuffer)
}
