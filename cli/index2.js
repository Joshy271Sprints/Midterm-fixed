const http = require('http');
const fs = require('fs');
const path = require('path');
const tokenGenerator = require('../cli/tokenGenerator');

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

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const html = fs.readFileSync('index.html', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.method === 'GET' && req.url === '/generate-token') {
    const token = tokenGenerator.generateToken();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ token }));

    // Log token generation event
    logEvent('Token generated');
  } else if (req.method === 'POST' && req.url === '/add-user') {
    handleAddUser(req, res);

    // Log user addition event
    logEvent('User added');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Web application server is running on port 3000');
});

function handleAddUser(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const userData = JSON.parse(body);
    addUser(userData, (error, result) => {
      if (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to add user' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User added successfully' }));
      }
    });
  });
}

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
