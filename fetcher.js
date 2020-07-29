// pulling in dependacies
const request = require('request');
const fs = require('fs');
const process = require('process');
const readline = require('readline');
const path = require('path');
readline.emitKeypressEvents(process.stdin);

// setting up stdin
const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');
stdin.resume();

// setting up readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// setting inputs to constants
const url = process.argv[2];
const file = process.argv[3];

// checking if path is valid
if (!path.isAbsolute(file)) {
  console.log('Invalid file path!');
  process.exit();
}
// write the file to disk
const writeFile = (body) => {
  fs.writeFile(file, body, (err) => {
    if (err) throw err;
    console.log(`Downloaded and saved ${body.length} bytes to ${file}`);
    process.exit();
  });
};

// request the file
const getFile = () => {
  request(url, (error, response, body) => {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if ((response && response.statusCode !== 200)) {
      console.log(`Failed because of statuscode ${response.statusCode}`);
    } else if (error) {
      console.log(`Failed because of statuscode ${error}`);
    } else {
      writeFile(body);
    }
  });
};

// checking if file exists
if (fs.existsSync(file)) {
  rl.question(`${file} already exists, do you wish to overwrite? (y/n) :` , (answer) => {
    if (answer === 'y') {
      getFile();
    } else {
      process.exit();
    }
  });
} else {
  getFile();
}
