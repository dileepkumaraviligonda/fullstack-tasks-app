"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;

    await supabase.from("tasks").insert([{ title }]);
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const updateTask = async (id) => {
    await supabase
      .from("tasks")
      .update({ title: editText })
      .eq("id", id);

    setEditingId(null);
    fetchTasks();
  };

  // ✅ TOGGLE COMPLETE
  const toggleComplete = async (task) => {
    await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    fetchTasks();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-6">
          📋 Task Manager
        </h1>

        <button
          onClick={logout}
          className="mb-4 bg-red-500 text-white px-4 py-1 rounded-lg"
        >
          Logout
        </button>

        {/* INPUT */}
        <div className="flex gap-2 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task..."
            className="flex-1 border p-2 rounded-lg"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 rounded-lg"
          >
            Add
          </button>
        </div>

        {/* TASK LIST */}
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-xl"
            >
              <div className="flex items-center gap-2 flex-1">

                {/* ✔ CHECKBOX */}
                <input
                  type="checkbox"
                  checked={task.completed || false}
                  onChange={() => toggleComplete(task)}
                />

                {editingId === task.id ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border p-1 rounded flex-1"
                  />
                ) : (
                  <span
                    className={`${
                      task.completed
                        ? "line-through text-gray-400"
                        : "font-medium"
                    }`}
                  >
                    {task.title}
                  </span>
                )}
              </div>

              <div className="flex gap-3 text-lg">
                {editingId === task.id ? (
                  <button
                    onClick={() => updateTask(task.id)}
                    className="text-green-500"
                  >
                    ✔
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(task)}
                      className="text-blue-500"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}