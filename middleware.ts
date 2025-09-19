import { NextRequest, NextResponse } from 'next/server';

// 🚧 MAINTENANCE MODE TOGGLE - Set to true to enable maintenance mode for live site
// TESTING: Completely disable middleware to see what happens
const MAINTENANCE_MODE = false;

export function middleware(request: NextRequest) {
  // Skip maintenance mode for localhost development
  const isLocalhost = request.nextUrl.hostname === 'localhost' || 
                     request.nextUrl.hostname === '127.0.0.1';
  
  // Skip maintenance for static assets and API routes
  const isStaticAsset = request.nextUrl.pathname.startsWith('/_next') ||
                       request.nextUrl.pathname.startsWith('/api') ||
                       request.nextUrl.pathname.includes('.') ||
                       request.nextUrl.pathname === '/favicon.ico';

  // If maintenance mode is enabled and not localhost, redirect to maintenance
  if (MAINTENANCE_MODE && !isLocalhost && !isStaticAsset) {
    // Create maintenance HTML response
    const maintenanceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HOA Connect Demo - Maintenance Mode</title>
    <!-- FORCE REFRESH: 2025-09-18-23-46-00 - INLINE STYLES -->
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: #1a1a1a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        
        .container {
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            max-width: 28rem;
            width: 100%;
            padding: 2rem;
            text-align: center;
        }
        
        
        .title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 0.5rem;
        }
        
        .maintenance-badge {
            color: #d97706;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .description {
            color: #6b7280;
            margin-bottom: 1.5rem;
        }
        
        .notice-box {
            background-color: #fef3c7;
            border: 1px solid #f3e8a6;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .notice-title {
            color: #92400e;
            font-weight: 600;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
        
        .notice-text {
            color: #a16207;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <div class="container">
        
        <h1 class="title">HOA Connect Demo</h1>
        
        <div>
            <p class="maintenance-badge">🚧 Maintenance Mode</p>
            <p class="description">We're currently updating the demo platform with new features and improvements.</p>
        </div>
        
        <div class="notice-box">
            <p class="notice-title">Scheduled Maintenance</p>
            <p class="notice-text">Our team is working hard to bring you an enhanced experience. Please check back soon!</p>
        </div>
    </div>
</body>
</html>`;

    return new NextResponse(maintenanceHtml, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': '3600', // Suggest retry after 1 hour
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
