"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // 🔄 FETCH USER TASKS
  const fetchTasks = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (!error) setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ➕ ADD TASK
  const addTask = async () => {
    if (!title) return;

    const { data: userData } = await supabase.auth.getUser();

    await supabase.from("tasks").insert([
      {
        title,
        user_id: userData.user.id,
      },
    ]);

    setTitle("");
    fetchTasks();
  };

  // ❌ DELETE TASK
  const deleteTask = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  };

  // ✏️ START EDIT
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  // 💾 UPDATE TASK
  const updateTask = async (id) => {
    await supabase
      .from("tasks")
      .update({ title: editText })
      .eq("id", id);

    setEditingId(null);
    fetchTasks();
  };

  // ✔ TOGGLE COMPLETE
  const toggleComplete = async (task) => {
    await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    fetchTasks();
  };

  // 🔍 FILTER TASKS
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  // 🌙 DARK MODE
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-100 to-purple-200"
      }`}
    >
      <div
        className={`max-w-xl mx-auto p-6 rounded-2xl shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          📋 Task Manager
        </h1>

        {/* 🌙 DARK MODE */}
        <button
          onClick={toggleDarkMode}
          className="mb-2 bg-gray-700 text-white px-3 py-1 rounded"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="mb-4 ml-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>

        {/* ADD TASK */}
        <div className="flex gap-2 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task..."
            className="flex-1 border p-2 rounded-lg text-black"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 rounded-lg"
          >
            Add
          </button>
        </div>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full mb-4 border p-2 rounded-lg text-black"
        />

        {/* TASK LIST */}
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`flex justify-between items-center p-3 rounded-xl ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
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
                    className="border p-1 rounded flex-1 text-black"
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
                      className="text-blue-400"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400"
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