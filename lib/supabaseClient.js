import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://jvmgkxvrhnmhrbtkgvtl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bWdreHZyaG5taHJidGtndnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDg2NDIsImV4cCI6MjA5MTcyNDY0Mn0._rm04uCB0QfLRZ85XoNN5rwGYlX8502Clko3UU2MVaU"
);