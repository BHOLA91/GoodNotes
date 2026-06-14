

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

  saveDatabase();

  return db;
}


module.exports = {
  initDatabase,   
  getDb: () => db, 
  saveDatabase,   
};
