// Middleware disabled for now - CMS is unprotected
// TODO: Add authentication after first deployment

export function middleware() {
  // No-op - let all requests through
}

export const config = {
  // Empty matcher - middleware won't run on any routes
  matcher: [],
};
