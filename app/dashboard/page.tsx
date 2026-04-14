"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login"); // 🔒 redirect if not logged in
      } else {
        setUser(data.user);
      }
    };

    checkUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return <p>Checking access...</p>;

  return (
    <div>
      <h1>Dashboard 🔐</h1>
      <p>Welcome: {user.email}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}