import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface InvoiceLineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  clientName: string
  clientEmail: string
  clientCompany?: string
  contractorName: string
  contractorCompany: string
  contractorAddress: string
  contractorPhone: string
  contractorEmail: string
  lineItems: InvoiceLineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  paymentTerms: string
  notes?: string
  paymentInstructions?: string
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let yPos = margin

  // Header - INVOICE
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(59, 130, 246) // Blue color
  doc.text('INVOICE', margin, yPos)
  
  // Invoice Number and Status
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(`#${data.invoiceNumber}`, pageWidth - margin, yPos, { align: 'right' })
  yPos += 15

  // Divider
  doc.setLineWidth(0.5)
  doc.setDrawColor(59, 130, 246)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  // Two Column Layout - From and Bill To
  const colWidth = (pageWidth - 3 * margin) / 2

  // Left Column - From
  let leftYPos = yPos
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(128, 128, 128)
  doc.text('FROM:', margin, leftYPos)
  leftYPos += 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(data.contractorName, margin, leftYPos)
  leftYPos += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  if (data.contractorCompany) {
    doc.text(data.contractorCompany, margin, leftYPos)
    leftYPos += 5
  }
  
  const addressLines = doc.splitTextToSize(data.contractorAddress, colWidth - 5)
  addressLines.forEach((line: string) => {
    doc.text(line, margin, leftYPos)
    leftYPos += 5
  })
  
  doc.text(data.contractorPhone, margin, leftYPos)
  leftYPos += 5
  doc.text(data.contractorEmail, margin, leftYPos)

  // Right Column - Bill To
  let rightYPos = yPos
  const rightColX = margin + colWidth + margin
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(128, 128, 128)
  doc.text('BILL TO:', rightColX, rightYPos)
  rightYPos += 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(data.clientName, rightColX, rightYPos)
  rightYPos += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  if (data.clientCompany) {
    doc.text(data.clientCompany, rightColX, rightYPos)
    rightYPos += 5
  }
  doc.text(data.clientEmail, rightColX, rightYPos)

  yPos = Math.max(leftYPos, rightYPos) + 15

  // Invoice Details Box
  doc.setFillColor(245, 247, 250)
  doc.rect(margin, yPos, pageWidth - 2 * margin, 20, 'F')
  
  const detailsYPos = yPos + 7
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  
  doc.text('Invoice Date:', margin + 5, detailsYPos)
  doc.setFont('helvetica', 'normal')
  doc.text(data.invoiceDate, margin + 40, detailsYPos)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Due Date:', margin + 5, detailsYPos + 7)
  doc.setFont('helvetica', 'normal')
  doc.text(data.dueDate, margin + 40, detailsYPos + 7)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Terms:', margin + 100, detailsYPos)
  doc.setFont('helvetica', 'normal')
  doc.text(data.paymentTerms, margin + 140, detailsYPos)

  yPos += 25

  // Line Items Table
  const tableColumn = ['Description', 'Qty', 'Rate', 'Amount']
  const tableRows = data.lineItems.map(item => [
    item.description,
    item.quantity.toString(),
    `$${item.rate.toFixed(2)}`,
    `$${item.amount.toFixed(2)}`,
  ])

  ;(doc as any).autoTable({
    startY: yPos,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' },
    },
    margin: { left: margin, right: margin },
  })

  yPos = (doc as any).lastAutoTable.finalY + 10

  // Totals Section
  const totalsX = pageWidth - margin - 60
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal:', totalsX - 30, yPos)
  doc.text(`$${data.subtotal.toFixed(2)}`, totalsX + 30, yPos, { align: 'right' })
  yPos += 7

  if (data.taxRate > 0) {
    doc.text(`Tax (${data.taxRate}%):`, totalsX - 30, yPos)
    doc.text(`$${data.taxAmount.toFixed(2)}`, totalsX + 30, yPos, { align: 'right' })
    yPos += 7
  }

  // Total with background
  doc.setFillColor(59, 130, 246)
  doc.rect(totalsX - 35, yPos - 5, 65, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.text('TOTAL:', totalsX - 30, yPos + 2)
  doc.text(`$${data.total.toFixed(2)}`, totalsX + 30, yPos + 2, { align: 'right' })
  yPos += 15

  doc.setTextColor(0, 0, 0)

  // Payment Instructions
  if (data.paymentInstructions) {
    yPos += 5
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Payment Instructions:', margin, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const instructionLines = doc.splitTextToSize(data.paymentInstructions, pageWidth - 2 * margin)
    doc.text(instructionLines, margin, yPos)
    yPos += instructionLines.length * 5 + 5
  }

  // Notes
  if (data.notes) {
    yPos += 5
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Notes:', margin, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const notesLines = doc.splitTextToSize(data.notes, pageWidth - 2 * margin)
    doc.text(notesLines, margin, yPos)
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text(
    `Thank you for your business! • ${data.invoiceNumber}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  )

  return doc.output('blob')
}
