// Build script for Vercel deployment
const { execSync } = require('child_process');

console.log('Starting Vercel build process...');

// Set NODE_ENV to production explicitly
process.env.NODE_ENV = 'production';

try {
  // Run the NextJS build command
  console.log('Running Next.js build with production settings...');
  execSync('NODE_ENV=production next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1', // Disable telemetry for faster builds
    }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 