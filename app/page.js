"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);

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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
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
                  <li className={styles.taskItem} key={task.id}>
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
