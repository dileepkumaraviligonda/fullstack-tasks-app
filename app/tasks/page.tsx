"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const router = useRouter();

  // CHECK LOGIN
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
    };
    checkUser();
  }, []);

  // GET USER TASKS
  const fetchTasks = async () => {
    const { data: userData } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userData.user?.id);

    setTasks(data || []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD TASK
  const addTask = async () => {
    if (!title.trim()) return;

    const { data: userData } = await supabase.auth.getUser();

    await supabase.from("tasks").insert([
      {
        title,
        user_id: userData.user?.id,
      },
    ]);

    setTitle("");
    fetchTasks();
  };

  // DELETE TASK
  const deleteTask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  };

  // START EDIT
  const startEdit = (task: any) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  // UPDATE TASK
  const updateTask = async (id: string) => {
    await supabase
      .from("tasks")
      .update({ title: editText })
      .eq("id", id);

    setEditingId(null);
    setEditText("");
    fetchTasks();
  };

  // LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "50px auto",
      padding: 20,
      fontFamily: "Arial"
    }}>
      <h1 style={{ textAlign: "center" }}>📋 My Tasks</h1>

      <button onClick={logout} style={{ marginBottom: 20 }}>
        Logout
      </button>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={title}
          placeholder="Enter task..."
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* LIST */}
      <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              marginBottom: 10,
              border: "1px solid #ddd",
              borderRadius: 8
            }}
          >
            {editingId === task.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button onClick={() => updateTask(task.id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span>{task.title}</span>

                <div>
                  <button onClick={() => startEdit(task)}>✏️</button>
                  <button onClick={() => deleteTask(task.id)}>
                    🗑️
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}