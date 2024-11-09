const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const db = require('../db');

const csrfProtection = csrf();

router.get('/get-csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.post('/change-email', (req, res, next) => {
  const vulnerability = req.headers['x-vulnerability'];
  req.isVulnerable = vulnerability === 'csrf';

  if (req.isVulnerable) {
    console.log("CSRF zaštita je isključena za ovaj zahtjev zbog postavke vulnerability.");
    next(); 
  } else {
    csrfProtection(req, res, next); 
  }
}, (req, res) => {
  const { email } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "Prvo se morate prijaviti" });
  }

  db.get('SELECT email FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Greška prilikom dohvaćanja korisničkog podataka" });
    }

    const oldEmail = row.email;

    db.run('UPDATE users SET email = ? WHERE id = ?', [email, userId], (err) => {
      if (err) {
        return res.status(500).json({ error: "Greška prilikom ažuriranja e-mail adrese" });
      }
      res.json({
        message: req.isVulnerable
          ? "E-mail adresa uspješno promijenjena (ranjiv na CSRF)" 
          : "E-mail adresa uspješno promijenjena (zaštićeno od CSRF-a)",
        oldEmail: oldEmail,
        newEmail: email
      });
    });
  });
});

router.get('/get-email', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "Prvo se morate prijaviti" });
  }

  db.get('SELECT email FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Greška prilikom dohvaćanja e-mail adrese" });
    }

    res.json({ email: row.email });
  });
});


module.exports = router;
