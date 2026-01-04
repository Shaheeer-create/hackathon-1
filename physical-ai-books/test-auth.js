const { spawn } = require('child_process');
const path = require('path');

console.log('Starting authentication server setup and testing...');

// Step 1: Run database migrations
console.log('Step 1: Running database migrations...');
const migrateProcess = spawn('npm', ['run', 'db:push'], {
  cwd: path.join(__dirname),
  stdio: 'inherit'
});

migrateProcess.on('close', (code) => {
  console.log(`Database migration process exited with code ${code}`);
  
  if (code === 0) {
    console.log('Step 2: Starting server...');
    // Step 2: Start the server
    const serverProcess = spawn('node', ['server.js'], {
      cwd: path.join(__dirname),
      stdio: 'inherit'
    });

    serverProcess.on('error', (err) => {
      console.error('Failed to start server:', err);
    });

    // Let the server run for a few seconds to ensure it's properly started
    setTimeout(() => {
      console.log('Server is running on port 4000. You can now test authentication at http://localhost:4000');
      console.log('Press Ctrl+C to stop the server.');
    }, 3000);
  } else {
    console.error('Database migration failed. Cannot start server.');
  }
});