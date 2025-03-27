# Next.js 15 Search Parameter Solution

## The Problem

In Next.js 15, there were issues with using `useSearchParams()` during static site generation, particularly when building pages that use this hook. This occurs because:

1. `useSearchParams()` is a client-side hook that can't be used during server-side rendering
2. During the build process, Next.js tries to prerender pages statically
3. Pages using `useSearchParams()` need to be properly wrapped in suspense boundaries

## The Solution

We implemented a hybrid approach that:

1. Provides simple static versions of the pages for production builds
2. Uses dynamic client components with full functionality during development
3. Sets up proper suspense boundaries and dynamic exports

### Implementation Details

1. **Created simplified static versions of shop and search pages for production**:
   - Static placeholders for product grids
   - Export with `dynamic = 'force-dynamic'` to ensure server-rendering

2. **Created client components for development**:
   - `ShopClient.tsx` and `SearchClient.tsx` components that use `useSearchParams()`
   - These handle all filtering, sorting and pagination

3. **Used conditional rendering based on environment**:
   - Pages check `process.env.NODE_ENV` to determine which version to render
   - In development: render the full client component
   - In production: render the simplified static version

4. **Created a production build script**:
   - Sets `NODE_ENV=production` explicitly
   - Ensures proper environment variables during build

### Key Files

- `src/app/(routes)/(store)/(shop)/shop/page.tsx` - Main shop page with conditional rendering
- `src/app/(routes)/(store)/(shop)/shop/ShopClient.tsx` - Client component for development
- `src/app/(routes)/search/page.tsx` - Main search page with conditional rendering
- `src/app/(routes)/search/SearchClient.tsx` - Client component for development
- `build-prod.js` - Production build script
- `next.config.mjs` - Cleaned up configuration

### Development vs Production Workflow

**Development**:
- Run `npm run dev`
- Pages use client components with full functionality
- Search parameters work correctly for filtering and pagination

**Production**:
- Run `npm run build:prod`
- Static versions of pages are generated for initial load
- Client-side navigation and hydration happens once the page loads in the browser

## Future Improvements

1. Implement server components that pass search parameters to client components
2. Use static props with ISR (Incremental Static Regeneration) for production pages
3. Improve the production placeholder experience with skeleton loaders

## References

- [Next.js 15 useSearchParams documentation](https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout)
- [Next.js Data Fetching patterns](https://nextjs.org/docs/app/building-your-application/data-fetching) 