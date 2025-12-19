
import { createClient } from '@supabase/supabase-js';

// NOTA: Em produção, estas chaves devem vir de variáveis de ambiente seguras.
const supabaseUrl = 'https://fncmbfppccifpniwcaxu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuY21iZnBwY2NpZnBuaXdjYXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MjY2MzIsImV4cCI6MjA4MTUwMjYzMn0.YN6XEzSH3XXX8ROtW7S-jstZgaTW2YaApP4YssFjTF0';

export const supabase = createClient(supabaseUrl, supabaseKey);
