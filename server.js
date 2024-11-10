const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'tajna_sifra',
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'lax' 
  }
}));

app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/change-email');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.get('/change-email', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/'); 
  } else {
    res.sendFile(path.join(__dirname, 'public', 'change-email.html'));
  }
});

app.use('/', authRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
});
