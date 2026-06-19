

const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "goodnotes.db");

let db = null;


function saveDatabase() {
  if (db) {
    const data = db.export();                       
    const buffer = Buffer.from(data);                
    fs.writeFileSync(DB_PATH, buffer);              
  }
}


async function initDatabase() {
 
  const SQL = await initSqlJs();

 
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    
    db = new SQL.Database();
  }

  
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name  TEXT    NOT NULL,
      email      TEXT    NOT NULL UNIQUE,
      password   TEXT    NOT NULL,
      created_at TEXT    DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL,
      title       TEXT    NOT NULL,
      completed   INTEGER DEFAULT 0,
      due_bucket  TEXT    DEFAULT 'today',
      duration    TEXT,
      tag         TEXT,
      created_at  TEXT    DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL,
      title       TEXT    NOT NULL,
      content     TEXT,
      is_favorite INTEGER DEFAULT 0,
      color       TEXT    DEFAULT '#6366f1',
      created_at  TEXT    DEFAULT (datetime('now')),
      updated_at  TEXT    DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  saveDatabase();

  return db;
}


module.exports = {
  initDatabase,   
  getDb: () => db, 
  saveDatabase,   
};
