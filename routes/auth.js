const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { username, password } = req.body;
  const vulnerability = req.headers['x-vulnerability'];

  if (vulnerability === 'sql_injection') {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    db.all(query, (err, rows) => { 
      if (err) {
        console.error("Detalji greške:", err);
        res.statu(500).send("Greška pri obradi zahtjeva");
      } else if (rows.length > 0) {
        req.session.userId = rows[0].id;
        res.redirect('/change-email'); 
      } else {
        res.status(401).send("Prijava neuspješna (ranjiva)");
      }
    });
  } else {
    db.all(
      `SELECT * FROM users WHERE username = ? AND password = ?`,
      [username, password],
      (err, rows) => {
        if (err) {
          res.status(500).send("Greška pri obradi zahtjeva");
        } else if (rows.length > 0) {
          req.session.userId = rows[0].id;
          res.redirect('/change-email'); 
        } else {
          res.status(401).send("Prijava neuspješna (sigurna)");
        }
      }
    );
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Greška prilikom odjave");
    }
    res.redirect('/');
  });
});

module.exports = router;
