const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const tokenGenerator = require('../cli/tokenGenerator');

const app = express();
const port = 3000;

// Set up logging using morgan middleware
app.use(morgan('combined'));

// Function to log events to events.log file
function logEvent(message) {
  const logFilePath = path.join(__dirname, 'logs', 'events.log');
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;

  fs.appendFile(logFilePath, logMessage, err => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}

app.get('/', (req, res) => {
  const html = fs.readFileSync('index.html', 'utf8');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

app.get('/generate-token', (req, res) => {
  const token = tokenGenerator.generateToken();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ token }));

  // Log token generation event
  logEvent('Token generated');
});

app.post('/add-user', express.json(), (req, res) => {
  const userData = req.body;
  addUser(userData, (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Failed to add user' });
    } else {
      res.status(200).json({ message: 'User added successfully' });

      // Log user addition event
      logEvent('User added');
    }
  });
});

function addUser(userData, callback) {
  const usersPath = path.join(__dirname, 'users.json');

  fs.readFile(usersPath, 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    const users = JSON.parse(data);
    users.push(userData);

    fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf8', err => {
      if (err) {
        callback(err);
      } else {
        callback(null, true);
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Web application server is running on port ${port}`);
});
