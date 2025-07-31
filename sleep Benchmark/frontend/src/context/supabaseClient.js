// supabaseClient.js
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://ectuojivwypfztsvqkbd.supabase.co'
const supabaseKey = '';

export const supabase = createClient(supabaseUrl, supabaseKey)
