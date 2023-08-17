const fs = require('fs');
const path = require('path');

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

// Function to log errors to error.log file
function logError(error) {
  const logFilePath = path.join(__dirname, 'logs', 'error.log');
  const logMessage = `[${new Date().toISOString()}] ${error.stack || error}\n`;

  fs.appendFile(logFilePath, logMessage, err => {
    if (err) {
      console.error('Error writing to error log file:', err);
    }
  });
}

module.exports = {
  logEvent,
  logError
};
