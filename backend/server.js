const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());


const historyFilePath = path.join(__dirname, 'qr_history.json');
const usersFilePath = path.join(__dirname, 'users.json');


const readJsonFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};


const writeJsonFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

// Endpoint to save QR code history
app.post('/api/history', async (req, res) => {
  const { qrData, userId } = req.body;

  try {
    const history = await readJsonFile(historyFilePath);
    history.push({ ...qrData, userId });
    await writeJsonFile(historyFilePath, history);
    res.status(200).send('Data saved successfully.');
  } catch (err) {
    res.status(500).send('Error saving data.');
  }
});

// Endpoint to retrieve QR code history
app.get('/api/history', async (req, res) => {
  const { userId } = req.query;

  try {
    const history = await readJsonFile(historyFilePath);
    const userHistory = history.filter(item => item.userId === parseInt(userId)); // Ensure userId is an integer
    res.send(userHistory);
  } catch (err) {
    res.status(500).send('Error reading data.');
  }
});


app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await readJsonFile(usersFilePath);
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const userId = users.length + 1; // Simple user ID generation
    const newUser = { id: userId, username, password };
    users.push(newUser);
    await writeJsonFile(usersFilePath, users);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).send('Error saving user data.');
  }
});


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await readJsonFile(usersFilePath);
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).send('Error reading user data.');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
