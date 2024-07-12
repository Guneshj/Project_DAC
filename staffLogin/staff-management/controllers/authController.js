const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 8, (err, hashedPassword) => {
        if (err) throw err;
        db.query('INSERT INTO staff (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
            if (err) throw err;
            res.send('User registered successfully.');
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM staff WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, match) => {
                if (err) throw err;
                if (match) {
                    const token = jwt.sign({ id: results[0].id }, 'your_jwt_secret', { expiresIn: '1h' });
                    res.json({ token });
                } else {
                    res.status(401).send('Invalid credentials.');
                }
            });
        } else {
            res.status(401).send('Invalid credentials.');
        }
    });
};
