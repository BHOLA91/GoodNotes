

const express = require("express");
const bcrypt = require("bcrypt");
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
