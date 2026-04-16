import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const DEFAULT_SETTINGS = {
  name: 'Shanti Varsha Angreji Ma. Vi.',
  address: 'Vyas-5, Chapaghat, Damauli, Tanahun, Nepal',
  phone: '+977-XXXXXXXX',
  email: 'info@shantivarsha.edu.np',
  facebook: '#',
  instagram: '#',
  youtube: '#',
  established: '2065',
}

function safeGet() {
  try {
    const raw = localStorage.getItem('schoolSettings')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Make sure it's a real object, not null/array
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function useSchoolSettings() {
  const [settings, setSettings] = useState(() => safeGet() || DEFAULT_SETTINGS)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('school_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle()

        if (!error && data && typeof data === 'object') {
          // Keep whatever is already in localStorage (like principal_photo) 
          // and layer DB data on top of it.
          const currentLocal = safeGet() || {}
          const merged = { ...DEFAULT_SETTINGS, ...currentLocal, ...data }
          setSettings(merged)
          localStorage.setItem('schoolSettings', JSON.stringify(merged))
        }
      } catch {
        // Table may not exist yet — silently fall back to defaults/localStorage
      }
    }

    fetchSettings()

    const handleUpdate = () => {
      const updated = safeGet()
      if (updated) setSettings({ ...DEFAULT_SETTINGS, ...updated })
    }

    window.addEventListener('schoolSettingsUpdated', handleUpdate)
    return () => window.removeEventListener('schoolSettingsUpdated', handleUpdate)
  }, [])

  // Always return merged with defaults so consumers never get undefined fields
  return { ...DEFAULT_SETTINGS, ...settings }
}
