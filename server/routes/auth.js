

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDb, saveDatabase } = require("../db");
const authMiddleware = require("../middleware/auth");


const router = express.Router();


function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


function getOne(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    stmt.free();
    // Build an object like { id: 1, full_name: "Smruti", ... }
    const row = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    return row;
  }
  stmt.free();
  return null;
}

router.post("/register", async (req, res) => {
  try {
    const db = getDb();


    const { fullName, email, password } = req.body;

    
    if (!fullName || !email || !password) {
      return res.status(400).json({
        error: "All fields are required (fullName, email, password).",
      });
    }

    // Check email looks valid
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    //  password check is at least 6 characters long
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long.",
      });
    }

    //  duplicate email cheek 
    const existingUser = getOne(db, "SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (existingUser) {
      return res.status(400).json({
        error: "An account with this email already exists.",
      });
    }

    // password Hashing
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    db.run(
      "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
      [fullName, email, hashedPassword]
    );

    
    saveDatabase();

    const newUser = getOne(db, "SELECT id FROM users WHERE email = ?", [email]);

    // Seed default tasks
    const defaultTasks = [
      { title: "Review design system architecture", completed: 0, due_bucket: "today", duration: "4h Focus", tag: "Design" },
      { title: "Morning meditation session", completed: 1, due_bucket: "today", duration: "15m Focus", tag: "" },
      { title: "Draft quarterly performance report", completed: 0, due_bucket: "today", duration: "3h Focus", tag: "Business" },
      { title: "Prepare for dashboard presentation", completed: 0, due_bucket: "upcoming", duration: "1h Focus", tag: "Business" },
      { title: "Refactor state management in dashboard", completed: 0, due_bucket: "upcoming", duration: "2h Focus", tag: "Design" },
      { title: "Learn Rust web assembly frameworks", completed: 0, due_bucket: "someday", duration: "12h Focus", tag: "Personal" },
      { title: "Explore Tailwind CSS v4 new directives", completed: 0, due_bucket: "someday", duration: "3h Focus", tag: "Design" }
    ];

    for (const task of defaultTasks) {
      db.run(
        "INSERT INTO tasks (user_id, title, completed, due_bucket, duration, tag) VALUES (?, ?, ?, ?, ?, ?)",
        [newUser.id, task.title, task.completed, task.due_bucket, task.duration, task.tag]
      );
    }

    // Seed default notes
    const defaultNotes = [
      { title: "🚀 Getting Started with Good Notes", content: "Welcome to Good Notes! This is a premium workspace for organized thinking. Here you can capture notes, choose beautiful color card tags, and mark notes as favorites by clicking the star icon. Start by creating a new note!", is_favorite: 1, color: "#818cf8" },
      { title: "💡 Project Brainstorming Ideas", content: "1. Build an AI-driven notes categorization engine.\n2. Design clean, minimalist typography themes.\n3. Add offline database synchronization.", is_favorite: 0, color: "#10b981" },
      { title: "📅 Weekly Review Checklist", content: "- Review 'Smart To-Do' list completed tasks.\n- Clear inbox and archive old files.\n- Focus on high-impact design architectures.", is_favorite: 0, color: "#f59e0b" }
    ];

    for (const note of defaultNotes) {
      db.run(
        "INSERT INTO notes (user_id, title, content, is_favorite, color) VALUES (?, ?, ?, ?, ?)",
        [newUser.id, note.title, note.content, note.is_favorite, note.color]
      );
    }
    
    saveDatabase();

    return res.status(201).json({
      id: newUser.id,
      fullName,
      email,
    });
  } catch (err) {
    
    console.error("Register error:", err.message);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const db = getDb();
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    // Find user by email
    const user = getOne(db, "SELECT * FROM users WHERE email = ?", [email]);

    // If no user was found, return a generic "Invalid credentials"
    
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    //Compare the password 
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    //   Generate a JWT
    // The token payload contains the user's id and email.
    //  expiresIn: "7d" means the token is valid for 7 days.
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        fullName: user.full_name, 
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/me", authMiddleware, (req, res) => {
  try {
    const db = getDb();

    const user = getOne(
      db,
      "SELECT id, full_name, email FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    return res.status(200).json({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
    });
  } catch (err) {
    console.error("Get user error:", err.message);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
