import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface ContractData {
  contractNumber: string
  clientName: string
  clientEmail: string
  clientCompany?: string
  projectName: string
  projectDescription: string
  scopeOfWork: string
  deliverables: string
  timeline: string
  totalAmount: number
  paymentSchedule: string
  revisions: number
  contractorName: string
  contractorCompany: string
  contractorAddress: string
  contractorPhone: string
  effectiveDate: string
  state: string
}

export async function generateContractPDF(data: ContractData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPos = margin

  // Header
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('DESIGN SERVICES AGREEMENT', pageWidth / 2, yPos, { align: 'center' })
  yPos += 15

  // Contract Number and Date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Contract #: ${data.contractNumber}`, margin, yPos)
  doc.text(`Effective Date: ${data.effectiveDate}`, pageWidth - margin, yPos, { align: 'right' })
  yPos += 10

  // Divider
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  // Parties Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('PARTIES TO THIS AGREEMENT', margin, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Designer/Contractor:', margin, yPos)
  yPos += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(data.contractorName, margin + 5, yPos)
  yPos += 5
  if (data.contractorCompany) {
    doc.text(data.contractorCompany, margin + 5, yPos)
    yPos += 5
  }
  doc.text(data.contractorAddress, margin + 5, yPos)
  yPos += 5
  doc.text(`Phone: ${data.contractorPhone}`, margin + 5, yPos)
  yPos += 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Client:', margin, yPos)
  yPos += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(data.clientName, margin + 5, yPos)
  yPos += 5
  if (data.clientCompany) {
    doc.text(data.clientCompany, margin + 5, yPos)
    yPos += 5
  }
  doc.text(data.clientEmail, margin + 5, yPos)
  yPos += 10

  // Check if we need a new page
  if (yPos > pageHeight - 40) {
    doc.addPage()
    yPos = margin
  }

  // Project Details Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('PROJECT DETAILS', margin, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Project Name:', margin, yPos)
  yPos += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const projectNameLines = doc.splitTextToSize(data.projectName, pageWidth - 2 * margin - 5)
  doc.text(projectNameLines, margin + 5, yPos)
  yPos += projectNameLines.length * 5 + 5

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Project Description:', margin, yPos)
  yPos += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const descLines = doc.splitTextToSize(data.projectDescription, pageWidth - 2 * margin - 5)
  doc.text(descLines, margin + 5, yPos)
  yPos += descLines.length * 5 + 5

  // Check if we need a new page
  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = margin
  }

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Scope of Work:', margin, yPos)
  yPos += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const scopeLines = doc.splitTextToSize(data.scopeOfWork, pageWidth - 2 * margin - 5)
  doc.text(scopeLines, margin + 5, yPos)
  yPos += scopeLines.length * 5 + 5

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Deliverables:', margin, yPos)
  yPos += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const delivLines = doc.splitTextToSize(data.deliverables, pageWidth - 2 * margin - 5)
  doc.text(delivLines, margin + 5, yPos)
  yPos += delivLines.length * 5 + 5

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Timeline:', margin, yPos)
  yPos += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(data.timeline, margin + 5, yPos)
  yPos += 10

  // Check if we need a new page
  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = margin
  }

  // Financial Terms Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('FINANCIAL TERMS', margin, yPos)
  yPos += 8

  doc.setFontSize(11)
  doc.text('Total Project Fee:', margin, yPos)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`$${data.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, margin + 50, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Payment Schedule:', margin, yPos)
  yPos += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const paymentLines = doc.splitTextToSize(data.paymentSchedule, pageWidth - 2 * margin - 5)
  doc.text(paymentLines, margin + 5, yPos)
  yPos += paymentLines.length * 5 + 5

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Revisions Included:', margin, yPos)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`${data.revisions} rounds of revisions`, margin + 50, yPos)
  yPos += 10

  // Check if we need a new page
  if (yPos > pageHeight - 80) {
    doc.addPage()
    yPos = margin
  }

  // Legal Terms Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('TERMS AND CONDITIONS', margin, yPos)
  yPos += 8

  const legalTerms = [
    {
      title: '1. Intellectual Property',
      text: 'Upon full payment, all rights to the final approved designs will transfer to the Client. Designer retains the right to display the work in their portfolio.',
    },
    {
      title: '2. Revisions',
      text: `The project includes ${data.revisions} rounds of revisions. Additional revisions will be billed at the Designer's hourly rate.`,
    },
    {
      title: '3. Timeline',
      text: 'The timeline is an estimate and subject to change based on Client feedback and approval times. Delays in Client responses may extend the project timeline.',
    },
    {
      title: '4. Termination',
      text: 'Either party may terminate this agreement with 14 days written notice. Client will be billed for all work completed up to the termination date.',
    },
    {
      title: '5. Kill Fee',
      text: 'If the project is cancelled before completion, Client agrees to pay 50% of the remaining balance as a kill fee.',
    },
    {
      title: '6. Confidentiality',
      text: 'Both parties agree to keep confidential information shared during this project private and secure.',
    },
    {
      title: '7. Governing Law',
      text: `This agreement shall be governed by the laws of the State of ${data.state}.`,
    },
  ]

  doc.setFontSize(10)
  legalTerms.forEach(term => {
    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = margin
    }

    doc.setFont('helvetica', 'bold')
    doc.text(term.title, margin, yPos)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    const termLines = doc.splitTextToSize(term.text, pageWidth - 2 * margin - 5)
    doc.text(termLines, margin + 5, yPos)
    yPos += termLines.length * 5 + 8
  })

  // Signature Section - Always on new page
  doc.addPage()
  yPos = margin

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('SIGNATURES', margin, yPos)
  yPos += 15

  // Designer Signature
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Designer/Contractor:', margin, yPos)
  yPos += 15
  doc.setLineWidth(0.3)
  doc.line(margin, yPos, margin + 80, yPos)
  yPos += 5
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Signature', margin, yPos)
  yPos += 8
  doc.text(`Name: ${data.contractorName}`, margin, yPos)
  yPos += 6
  doc.text('Date: _________________', margin, yPos)
  yPos += 20

  // Client Signature
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Client:', margin, yPos)
  yPos += 15
  doc.line(margin, yPos, margin + 80, yPos)
  yPos += 5
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Signature', margin, yPos)
  yPos += 8
  doc.text(`Name: ${data.clientName}`, margin, yPos)
  yPos += 6
  doc.text('Date: _________________', margin, yPos)

  // Footer on every page
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${i} of ${totalPages} • ${data.contractNumber}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  return doc.output('blob')
}
