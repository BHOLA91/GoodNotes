const express = require("express");
const { getDb, saveDatabase } = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Helper to get multiple rows from sql.js
function getAll(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    const row = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    rows.push(row);
  }
  stmt.free();
  return rows;
}

// Helper to get one row
function getOne(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    stmt.free();
    const row = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    return row;
  }
  stmt.free();
  return null;
}

// GET all tasks for user
router.get("/", authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    const tasks = getAll(db, "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at ASC", [userId]);
    res.json(tasks);
  } catch (err) {
    console.error("Fetch tasks error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create task
router.post("/", authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    const { title, due_bucket, duration, tag } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Task title is required" });
    }

    db.run(
      "INSERT INTO tasks (user_id, title, completed, due_bucket, duration, tag) VALUES (?, ?, 0, ?, ?, ?)",
      [userId, title, due_bucket || "today", duration || "", tag || ""]
    );
    saveDatabase();

    const newTask = getOne(db, "SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC LIMIT 1", [userId]);
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT update task
router.put("/:id", authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, completed, due_bucket, duration, tag } = req.body;

    const task = getOne(db, "SELECT * FROM tasks WHERE id = ? AND user_id = ?", [taskId, userId]);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTitle = title !== undefined ? title : task.title;
    const updatedCompleted = completed !== undefined ? (completed ? 1 : 0) : task.completed;
    const updatedBucket = due_bucket !== undefined ? due_bucket : task.due_bucket;
    const updatedDuration = duration !== undefined ? duration : task.duration;
    const updatedTag = tag !== undefined ? tag : task.tag;

    db.run(
      "UPDATE tasks SET title = ?, completed = ?, due_bucket = ?, duration = ?, tag = ? WHERE id = ? AND user_id = ?",
      [updatedTitle, updatedCompleted, updatedBucket, updatedDuration, updatedTag, taskId, userId]
    );
    saveDatabase();

    const updatedTask = getOne(db, "SELECT * FROM tasks WHERE id = ?", [taskId]);
    res.json(updatedTask);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE task
router.delete("/:id", authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = getOne(db, "SELECT * FROM tasks WHERE id = ? AND user_id = ?", [taskId, userId]);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    db.run("DELETE FROM tasks WHERE id = ? AND user_id = ?", [taskId, userId]);
    saveDatabase();

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
