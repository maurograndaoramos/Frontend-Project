// Build script for Vercel deployment
const { execSync } = require('child_process');

console.log('Starting Vercel build process...');

// Set NODE_ENV to production explicitly
process.env.NODE_ENV = 'production';

try {
  // Generate Prisma client first
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit' 
  });
  
  // Run the NextJS build command
  console.log('Running Next.js build with production settings...');
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1', // Disable telemetry for faster builds
    }
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 