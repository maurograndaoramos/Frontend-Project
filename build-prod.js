// Build script for production
const { execSync } = require('child_process');
const os = require('os');

console.log('Starting production build...');

// Set environment variables for production
process.env.NODE_ENV = 'production';

try {
  // Run the build command with proper environment variables
  console.log('Building with NODE_ENV=production...');
  
  // Use different commands based on OS
  if (os.platform() === 'win32') {
    execSync('set NODE_ENV=production && npm run build', { stdio: 'inherit' });
  } else {
    execSync('NODE_ENV=production npm run build', { stdio: 'inherit' });
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 