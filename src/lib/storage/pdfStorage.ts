import { supabase } from '../supabase'

export async function uploadContractPDF(
  contractId: string,
  pdfBlob: Blob,
  fileName: string
): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const filePath = `${user.id}/${contractId}/${fileName}.pdf`

    const { error } = await supabase.storage
      .from('contracts')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('contracts')
      .getPublicUrl(filePath)

    // Update contract with PDF URL
    await supabase
      .from('contracts')
      .update({ pdf_url: publicUrl })
      .eq('id', contractId)

    // Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      contract_id: contractId,
      action: 'pdf_generated',
      details: {
        file_path: filePath,
        file_name: fileName,
      },
    })

    return publicUrl
  } catch (error) {
    console.error('Error uploading contract PDF:', error)
    return null
  }
}

export async function uploadInvoicePDF(
  invoiceId: string,
  pdfBlob: Blob,
  fileName: string
): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const filePath = `${user.id}/${invoiceId}/${fileName}.pdf`

    const { error } = await supabase.storage
      .from('invoices')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('invoices')
      .getPublicUrl(filePath)

    // Update invoice with PDF URL
    await supabase
      .from('invoices')
      .update({ pdf_url: publicUrl })
      .eq('id', invoiceId)

    // Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      invoice_id: invoiceId,
      action: 'pdf_generated',
      details: {
        file_path: filePath,
        file_name: fileName,
      },
    })

    return publicUrl
  } catch (error) {
    console.error('Error uploading invoice PDF:', error)
    return null
  }
}

export async function downloadPDF(url: string, fileName: string) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Error downloading PDF:', error)
  }
}
