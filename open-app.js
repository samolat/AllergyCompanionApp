const { exec } = require('child_process');

// Function to open URL based on platform
function openBrowser(url) {
  const platform = process.platform;
  
  // Different commands for different operating systems
  let command;
  
  if (platform === 'darwin') {  // macOS
    command = `open "${url}"`;
  } else if (platform === 'win32') {  // Windows
    command = `start "${url}"`;
  } else {  // Linux and others
    command = `xdg-open "${url}"`;
  }
  
  // Execute the command
  exec(command, (error) => {
    if (error) {
      console.error(`Failed to open browser: ${error}`);
      return;
    }
    console.log(`Opening ${url} in your default browser...`);
  });
}

// Open the local development server
openBrowser('http://localhost:8080'); 