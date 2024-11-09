const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./vulnerability_demo.db', (err) => {
  if (err) {
    console.error('Greška pri otvaranju baze podataka:', err.message);
  } else {
    console.log('Uspješno spojeno na SQLite bazu podataka');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);

  db.get(`SELECT COUNT(*) AS count FROM users`, (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, 
             ['admin', 'admin123', 'admin@example.com']);
      db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, 
             ['user1', 'password1', 'user1@example.com']);
      db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, 
             ['user2', 'password2', 'user2@example.com']);
    }
  });
});

module.exports = db;
