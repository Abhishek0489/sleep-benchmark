// supabaseClient.js
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://ectuojivwypfztsvqkbd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdHVvaml2d3lwZnp0c3Zxa2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDg1ODksImV4cCI6MjA2Nzc4NDU4OX0._JnPAC8i2jHBkBetkxeBKxVlwZcS-qAtyRJXv8w-1fE';

export const supabase = createClient(supabaseUrl, supabaseKey)