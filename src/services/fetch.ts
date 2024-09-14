import { createClient } from '@supabase/supabase-js';

// Credenciales de tu proyecto Supabase
const supabaseUrl = 'https://qoachxxxbofyisaapere.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvYWNoeHh4Ym9meWlzYWFwZXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzMjkzNjEsImV4cCI6MjA0MDkwNTM2MX0.RubuDap5GOzBk9kamQQOhwD5EtPjR7Uoxo-mKKQXnfk';

export const supabase = createClient(supabaseUrl, supabaseKey);