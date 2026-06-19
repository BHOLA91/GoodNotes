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

// GET all notes for user
router.get("/", authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    const notes = getAll(db, "SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC", [userId]);
    res.json(notes);
  } catch (err) {
    console.error("Fetch notes error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST create note
router.post("/", authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    const { title, content, color } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Note title is required" });
    }

    db.run(
      "INSERT INTO notes (user_id, title, content, is_favorite, color) VALUES (?, ?, ?, 0, ?)",
      [userId, title, content || "", color || "#6366f1"]
    );
    saveDatabase();

    const newNote = getOne(db, "SELECT * FROM notes WHERE user_id = ? ORDER BY id DESC LIMIT 1", [userId]);
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT update note
router.put("/:id", authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    const noteId = req.params.id;
    const { title, content, is_favorite, color } = req.body;

    const note = getOne(db, "SELECT * FROM notes WHERE id = ? AND user_id = ?", [noteId, userId]);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const updatedTitle = title !== undefined ? title : note.title;
    const updatedContent = content !== undefined ? content : note.content;
    const updatedFavorite = is_favorite !== undefined ? (is_favorite ? 1 : 0) : note.is_favorite;
    const updatedColor = color !== undefined ? color : note.color;

    db.run(
      "UPDATE notes SET title = ?, content = ?, is_favorite = ?, color = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?",
      [updatedTitle, updatedContent, updatedFavorite, updatedColor, noteId, userId]
    );
    saveDatabase();

    const updatedNote = getOne(db, "SELECT * FROM notes WHERE id = ?", [noteId]);
    res.json(updatedNote);
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE note
router.delete("/:id", authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const userId = req.user.id;
    const noteId = req.params.id;

    const note = getOne(db, "SELECT * FROM notes WHERE id = ? AND user_id = ?", [noteId, userId]);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    db.run("DELETE FROM notes WHERE id = ? AND user_id = ?", [noteId, userId]);
    saveDatabase();

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
