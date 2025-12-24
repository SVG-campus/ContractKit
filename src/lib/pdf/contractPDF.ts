import jsPDF from 'jspdf'

export interface ContractData {
  contractNumber: string
  effectiveDate: string
  contractorName: string
  contractorAddress: string
  clientName: string
  clientEmail: string
  clientCompany?: string
  projectName: string
  projectDescription: string
  scopeOfWork: string
  deliverables: string
  timeline: string
  totalAmount: number
  revisionsIncluded: number
  paymentSchedule: string
  governingState: string
}

export async function generateContractPDF(data: ContractData): Promise<Blob> {
  const doc = new jsPDF()
  let yPos = 20

  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('DESIGN SERVICES CONTRACT', 105, yPos, { align: 'center' })
  yPos += 15

  // Contract Number
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Contract #: ${data.contractNumber}`, 20, yPos)
  doc.text(`Effective Date: ${new Date(data.effectiveDate).toLocaleDateString()}`, 150, yPos)
  yPos += 10

  // Parties Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('PARTIES', 20, yPos)
  yPos += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Designer (Service Provider):', 20, yPos)
  yPos += 5
  doc.text(data.contractorName, 25, yPos)
  if (data.contractorAddress) {
    yPos += 5
    doc.text(data.contractorAddress, 25, yPos)
  }
  yPos += 10

  doc.text('Client:', 20, yPos)
  yPos += 5
  doc.text(data.clientName, 25, yPos)
  yPos += 5
  doc.text(data.clientEmail, 25, yPos)
  if (data.clientCompany) {
    yPos += 5
    doc.text(data.clientCompany, 25, yPos)
  }
  yPos += 12

  // Project Details
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('PROJECT DETAILS', 20, yPos)
  yPos += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Project Name: ${data.projectName}`, 20, yPos)
  yPos += 6
  
  if (data.projectDescription) {
    const descLines = doc.splitTextToSize(`Description: ${data.projectDescription}`, 170)
    doc.text(descLines, 20, yPos)
    yPos += (descLines.length * 5) + 5
  }

  // Scope of Work
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Scope of Work:', 20, yPos)
  yPos += 6
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const scopeLines = doc.splitTextToSize(data.scopeOfWork, 170)
  doc.text(scopeLines, 20, yPos)
  yPos += (scopeLines.length * 5) + 8

  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }

  // Deliverables
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Deliverables:', 20, yPos)
  yPos += 6
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const delivLines = doc.splitTextToSize(data.deliverables, 170)
  doc.text(delivLines, 20, yPos)
  yPos += (delivLines.length * 5) + 8

  // Financial Terms
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('FINANCIAL TERMS', 20, yPos)
  yPos += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Project Fee: $${data.totalAmount.toLocaleString()}`, 20, yPos)
  yPos += 6
  doc.text(`Payment Schedule: ${data.paymentSchedule}`, 20, yPos)
  yPos += 6
  doc.text(`Revisions Included: ${data.revisionsIncluded} rounds`, 20, yPos)
  yPos += 10

  // Timeline
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Timeline:', 20, yPos)
  yPos += 6
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(data.timeline, 20, yPos)
  yPos += 10

  // Check if we need a new page
  if (yPos > 230) {
    doc.addPage()
    yPos = 20
  }

  // Standard Terms
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('STANDARD TERMS & CONDITIONS', 20, yPos)
  yPos += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const terms = [
    {
      title: '1. Intellectual Property Rights',
      text: 'Upon full payment, all rights to the final approved designs will transfer to the Client. Designer retains the right to display work in portfolio.'
    },
    {
      title: '2. Revisions',
      text: `The project includes ${data.revisionsIncluded} rounds of revisions. Additional revisions will be billed at $100/hour.`
    },
    {
      title: '3. Timeline',
      text: 'Timeline begins upon receipt of deposit and all required materials. Delays caused by Client may extend delivery dates accordingly.'
    },
    {
      title: '4. Kill Fee',
      text: 'If project is cancelled by Client, Designer retains deposit and is entitled to 50% of remaining balance for work completed.'
    },
    {
      title: '5. Confidentiality',
      text: 'Both parties agree to keep confidential information private and not disclose to third parties without written consent.'
    },
    {
      title: '6. Termination',
      text: 'Either party may terminate with 14 days written notice. Client pays for all work completed to date.'
    },
    {
      title: '7. Governing Law',
      text: `This contract is governed by the laws of ${data.governingState}.`
    }
  ]

  terms.forEach(term => {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFont('helvetica', 'bold')
    doc.text(term.title, 20, yPos)
    yPos += 5
    
    doc.setFont('helvetica', 'normal')
    const termLines = doc.splitTextToSize(term.text, 170)
    doc.text(termLines, 20, yPos)
    yPos += (termLines.length * 5) + 6
  })

  // Signatures
  if (yPos > 220) {
    doc.addPage()
    yPos = 20
  }

  yPos += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('SIGNATURES', 20, yPos)
  yPos += 15

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Designer:', 20, yPos)
  doc.text('Client:', 120, yPos)
  yPos += 15

  doc.line(20, yPos, 80, yPos)
  doc.line(120, yPos, 180, yPos)
  yPos += 5

  doc.text(data.contractorName, 20, yPos)
  doc.text(data.clientName, 120, yPos)
  yPos += 6

  doc.text('Date: _______________', 20, yPos)
  doc.text('Date: _______________', 120, yPos)

  return doc.output('blob')
}
