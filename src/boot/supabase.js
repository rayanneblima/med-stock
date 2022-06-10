import { createClient } from '@supabase/supabase-js'
import useAuthUser from 'src/composables/useAuthUser'

// a pasta boot é inicializada antes da aplicação quasar

const supabaseURL = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseURL, supabaseKey)

supabase.auth.onAuthStateChange((event, session) => {
  const { user } = useAuthUser()

  user.value = session?.user || null
})

export default function useSupabase () {
  return { supabase }
}
