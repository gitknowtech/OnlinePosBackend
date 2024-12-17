const { exec } = require("child_process");
const port = process.env.PORT || 5000;

console.log(`Checking for running server on port ${port}...`);

// Run kill-port to stop the server on the given port
exec(`npx kill-port ${port}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error stopping the port ${port}:`, error.message);
    return;
  }
  console.log(`Port ${port} cleared successfully. Starting server...`);
});
