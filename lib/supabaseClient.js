import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://jvmgkxvrhnmhrbtkgvtl.supabase.co",
  "YOUR_ANON_KEY"
);