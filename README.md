# Frontend Project

A Next.js 15 e-commerce application with a modern UI and comprehensive features.

## Features

- Modern e-commerce UI with product catalog
- User authentication using Next-Auth v5
- Shopping cart and checkout functionality
- Search and filtering capabilities
- Responsive design for all devices

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Production Build

```bash
# Regular build
npm run build

# Production build with environment variables properly set
npm run build:prod
```

## Deployment

This project is ready to deploy on Vercel:

1. Push your code to GitHub, GitLab, or Bitbucket
2. Import the repository in Vercel
3. Set up the required environment variables
4. Deploy the project

## Environment Variables

Create a `.env` file with the following variables:

```
# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

# For production, set the following:
# NEXTAUTH_URL="https://your-production-url.com"
```

## Notes

- The application uses dynamic routing for shop and search pages
- Auth.js is configured with `trustHost: true` for secure authentication in all environments
- Production builds use static versions of the shop and search pages to ensure compatibility with Next.js 15
