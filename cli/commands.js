const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const configFilePath = path.join(__dirname, '../config.json');

async function viewAndAlterConfig() {
  const config = require(configFilePath);

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'appName',
      message: 'Enter the application name:',
      default: config.name
    },
  ]);

  const updatedConfig = {
    ...config,
    ...answers
  };

  fs.writeFileSync(configFilePath, JSON.stringify(updatedConfig, null, 2));

  console.log('Configuration updated successfully.');
}

module.exports = {
  viewAndAlterConfig
};
