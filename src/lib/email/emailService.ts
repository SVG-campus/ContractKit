import { supabase } from '../supabase'

interface SendContractEmailParams {
  contractId: string
  contractNumber: string
  clientName: string
  clientEmail: string
  projectName: string
  contractorName: string
  pdfUrl: string
}

interface SendInvoiceEmailParams {
  invoiceId: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  contractorName: string
  totalAmount: number
  dueDate: string
  pdfUrl: string
}

export async function sendContractForSignature(params: SendContractEmailParams): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Generate signature link (we'll build this page next)
    const signatureLink = `${window.location.origin}/sign/${params.contractId}`

    // In production, this would call your backend API
    // For now, we'll log the email and mark as sent
    console.log('📧 Sending contract email:', {
      to: params.clientEmail,
      subject: `Contract Ready for Signature - ${params.projectName}`,
      link: signatureLink,
    })

    // Update contract status
    const { error: updateError } = await supabase
      .from('contracts')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', params.contractId)

    if (updateError) throw updateError

    // Log email in database
    await supabase.from('email_logs').insert({
      user_id: user.id,
      contract_id: params.contractId,
      recipient_email: params.clientEmail,
      recipient_name: params.clientName,
      subject: `Contract Ready for Signature - ${params.projectName}`,
      email_type: 'contract_signature',
      status: 'sent',
    })

    // Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      contract_id: params.contractId,
      action: 'contract_sent',
      details: {
        recipient: params.clientEmail,
        contract_number: params.contractNumber,
      },
    })

    // Show alert with signature link (for testing)
    alert(`✅ Contract sent!\n\nSignature Link (copy this to send to client):\n${signatureLink}\n\nIn production, an email will be sent automatically.`)

    return true
  } catch (error) {
    console.error('Error sending contract:', error)
    return false
  }
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // In production, this would call your backend API
    console.log('📧 Sending invoice email:', {
      to: params.clientEmail,
      subject: `Invoice ${params.invoiceNumber} from ${params.contractorName}`,
      pdfUrl: params.pdfUrl,
    })

    // Update invoice status
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', params.invoiceId)

    if (updateError) throw updateError

    // Log email in database
    await supabase.from('email_logs').insert({
      user_id: user.id,
      invoice_id: params.invoiceId,
      recipient_email: params.clientEmail,
      recipient_name: params.clientName,
      subject: `Invoice ${params.invoiceNumber} from ${params.contractorName}`,
      email_type: 'invoice_sent',
      status: 'sent',
    })

    // Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      invoice_id: params.invoiceId,
      action: 'invoice_sent',
      details: {
        recipient: params.clientEmail,
        invoice_number: params.invoiceNumber,
        amount: params.totalAmount,
      },
    })

    // Show alert with PDF link (for testing)
    alert(`✅ Invoice sent!\n\nPDF Link (copy this to send to client):\n${params.pdfUrl}\n\nIn production, an email will be sent automatically.`)

    return true
  } catch (error) {
    console.error('Error sending invoice:', error)
    return false
  }
}

export async function markInvoiceAsPaid(invoiceId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('invoices')
      .update({ 
        status: 'paid',
        paid_date: new Date().toISOString(),
      })
      .eq('id', invoiceId)

    if (error) throw error

    // Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      invoice_id: invoiceId,
      action: 'payment_received',
      details: {
        paid_at: new Date().toISOString(),
      },
    })

    return true
  } catch (error) {
    console.error('Error marking invoice as paid:', error)
    return false
  }
}
