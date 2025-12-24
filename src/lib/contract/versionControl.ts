import { supabase } from '../supabase'

export async function createContractVersion(
  contractId: string,
  contractData: any,
  changeDescription: string
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get current version number
    const { data: versions } = await supabase
      .from('contract_versions')
      .select('version_number')
      .eq('contract_id', contractId)
      .order('version_number', { ascending: false })
      .limit(1)

    const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1

    // Get user profile for name
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single()

    // Create version snapshot
    const { error } = await supabase.from('contract_versions').insert({
      contract_id: contractId,
      user_id: user.id,
      version_number: nextVersion,
      contract_data: contractData,
      change_description: changeDescription,
      changed_by_name: profile?.full_name || 'Unknown',
    })

    if (error) throw error

    // Log audit trail
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      contract_id: contractId,
      action: 'contract_updated',
      details: {
        version: nextVersion,
        description: changeDescription,
      },
    })

    return true
  } catch (error) {
    console.error('Error creating contract version:', error)
    return false
  }
}

export async function getContractVersions(contractId: string) {
  try {
    const { data, error } = await supabase
      .from('contract_versions')
      .select('*')
      .eq('contract_id', contractId)
      .order('version_number', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching contract versions:', error)
    return []
  }
}
