const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_login_app',
});

db.connect((err) => {
    if (err) {
        console.log('Database Connection Error' ,err);
        return;
    }
    console.log('Database Connected');
});

// Endpoint post login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // const query = 'SELECT * FROM tb_users WHERE username = ? AND password = ?';
    // db.query(query, [username, password], (err, results) => {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }

    //     if (results.length > 0) {
    //         res.json({ success: true, user:results[0] });
    //     } else {
    //         res.json({ success: false, message: 'Invalid username or password' });
    //     }
    // });

    const query = 'SELECT * FROM tb_users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length > 0) {
            const user = results[0];
            if (bcrypt.compareSync(password, user.password)) {
                res.json({ success: true, user });
            } else {
                res.json({ success: false, message: 'Invalid username or password' });
            }
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});

// Endpoint post register
app.post('/register', (req, res) => {
    const { username, password, name } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Check if username already exists
    const checkQuery = 'SELECT * FROM tb_users WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results.length > 0) {
            return res.json({ success: false, message: 'Username already exists' });
        }
    });

    // Insert new user
    const insertQuery = 'INSERT INTO tb_users (username, password, name) VALUES (?, ?, ?)';
    db.query(insertQuery, [username, hashedPassword, name], (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ success: true, message: 'User registered successfully' });
    });
});

// update users -> username/password/name
app.put('/update-user', async(req, res) => {
    const { currentUsername, newUsername, newPassword, newName } = req.body;

    // Validasi username
    if (!currentUsername) {
        return res.status(400).json({ success: false, message: 'Current username is required' });
    }

    try {
        const update = [];
        const values = [];

        // Tambahkan data baru yang diubah
        if (newUsername) {
            update.push('username = ?');
            values.push(newUsername);
        }
        if (newPassword) {
            const hashedPassword = bcrypt.hashSync(newPassword, 10);
            update.push('password = ?');
            values.push(hashedPassword);
        }
        if (newName) {
            update.push('name = ?');
            values.push(newName);
        }

        if (update.length === 0) {
            return res.status(400).json({ success: false, message: 'No data to update' });
        }

        // Tambahkan username yang akan diupdate ke daftar nilai
        values.push(currentUsername);
        
        const query = `UPDATE tb_users SET ${update.join(', ')} WHERE username = ?`;
        db.query(query, values, (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database Error', error: err});
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({ success: true, message: 'User updated successfully' });
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.listen(4000, () => {
    console.log('Server started on port 4000');
});