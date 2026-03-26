import { supabase } from '../config/supabase'

// Get security settings from database
export const getSecuritySettings = async () => {
  try {
    const { data, error } = await supabase
      .from('security_settings')
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching security settings:', error)
    return { success: false, error: error.message }
  }
}

// Update security settings
export const updateSecuritySettings = async (settings) => {
  try {
    const { data, error } = await supabase
      .from('security_settings')
      .upsert([{ id: 1, ...settings }], { onConflict: 'id' })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error updating security settings:', error)
    return { success: false, error: error.message }
  }
}

// Verify page password
export const verifyPagePassword = async (pageName, password) => {
  try {
    const { data, error } = await supabase
      .from('security_settings')
      .select('page_passwords')
      .eq('id', 1)
      .single()
    
    if (error) throw error
    
    const pagePasswords = data?.page_passwords || {}
    const correctPassword = pagePasswords[pageName]
    
    return {
      success: true,
      isValid: correctPassword === password,
      message: correctPassword === password ? 'Access granted' : 'Invalid password'
    }
  } catch (error) {
    console.error('Error verifying password:', error)
    return { success: false, error: error.message }
  }
}

// Log access attempt
export const logAccessAttempt = async (pageName, success, ipAddress = null) => {
  try {
    const logEntry = {
      page: pageName,
      success: success,
      timestamp: new Date().toISOString(),
      ip: ipAddress
    }
    
    const { data, error } = await supabase
      .from('security_settings')
      .select('access_logs')
      .eq('id', 1)
      .single()
    
    if (error) throw error
    
    const currentLogs = data?.access_logs || []
    const updatedLogs = [...currentLogs, logEntry].slice(-100) // Keep last 100 entries
    
    const { error: updateError } = await supabase
      .from('security_settings')
      .update({ access_logs: updatedLogs })
      .eq('id', 1)
    
    if (updateError) throw updateError
    return { success: true }
  } catch (error) {
    console.error('Error logging access attempt:', error)
    return { success: false, error: error.message }
  }
}

// Change admin password
export const changeAdminPassword = async (oldPassword, newPassword) => {
  try {
    // First verify old password
    const { data, error } = await supabase
      .from('security_settings')
      .select('admin_password')
      .eq('id', 1)
      .single()
    
    if (error) throw error
    
    if (data.admin_password !== oldPassword) {
      return { success: false, error: 'Current password is incorrect' }
    }
    
    // Update password
    const { error: updateError } = await supabase
      .from('security_settings')
      .update({ admin_password: newPassword })
      .eq('id', 1)
    
    if (updateError) throw updateError
    return { success: true, message: 'Password updated successfully' }
  } catch (error) {
    console.error('Error changing admin password:', error)
    return { success: false, error: error.message }
  }
}

// Change page password
export const changePagePassword = async (pageName, newPassword) => {
  try {
    const { data, error } = await supabase
      .from('security_settings')
      .select('page_passwords')
      .eq('id', 1)
      .single()
    
    if (error) throw error
    
    const pagePasswords = data?.page_passwords || {}
    pagePasswords[pageName] = newPassword
    
    const { error: updateError } = await supabase
      .from('security_settings')
      .update({ page_passwords: pagePasswords })
      .eq('id', 1)
    
    if (updateError) throw updateError
    return { success: true, message: 'Page password updated successfully' }
  } catch (error) {
    console.error('Error changing page password:', error)
    return { success: false, error: error.message }
  }
}
