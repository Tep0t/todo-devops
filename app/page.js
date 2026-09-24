"use client";

import { useState, useSyncExternalStore } from "react";
import styles from "./page.module.css";

function subscribeToTheme(callback) {
  window.addEventListener("todo-theme-change", callback);
  return () => window.removeEventListener("todo-theme-change", callback);
}

function getThemeSnapshot() {
  const savedTheme = window.localStorage.getItem("todo-theme");
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
}

function getServerThemeSnapshot() {
  return "dark";
}

export default function Home() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  function addTask(event) {
    event.preventDefault();
    const title = taskText.trim();

    if (!title) {
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: crypto.randomUUID(), title, completed: false },
    ]);
    setTaskText("");
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("todo-theme", nextTheme);
    window.dispatchEvent(new Event("todo-theme-change"));
  }

  return (
    <div className={styles.page} data-theme={theme}>
      <main className={styles.main}>
        <button
          className={styles.themeToggle}
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span className={styles.themeIcon} aria-hidden="true">
            {theme === "dark" ? "☾" : "☀"}
          </span>
          <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
        </button>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Daily focus</p>
          <h1>My ToDo List</h1>
          <p className={styles.subtitle}>Keep the next small step in sight.</p>
        </header>

        <section className={styles.todoPanel} aria-labelledby="todo-heading">
          <div className={styles.panelHeader}>
            <h2 id="todo-heading">Tasks</h2>
            <span className={styles.taskCount}>{tasks.length} total</span>
          </div>

          <form className={styles.addForm} onSubmit={addTask}>
            <label className={styles.srOnly} htmlFor="task-input">
              New task
            </label>
            <input
              id="task-input"
              type="text"
              value={taskText}
              onChange={(event) => setTaskText(event.target.value)}
              placeholder="What needs doing?"
            />
            <button type="submit">Add Task</button>
          </form>

          <div className={styles.listArea} aria-live="polite">
            {tasks.length === 0 ? (
              <p className={styles.emptyState}>Your list is clear. Add a task to get started.</p>
            ) : (
              <ul className={styles.taskList}>
                {tasks.map((task) => (
                  <li
                    className={`${styles.taskItem} ${task.completed ? styles.completedItem : ""}`}
                    key={task.id}
                  >
                    <label className={styles.taskLabel}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span className={task.completed ? styles.completed : ""}>
                        {task.title}
                      </span>
                    </label>
                    <button
                      className={styles.deleteButton}
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete ${task.title}`}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
