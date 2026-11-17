# Personal notebook deployment

The existing PostgreSQL tables are reused; no schema migration or data deletion is required. Existing published pieces remain public. Home-page content has moved to `/about` and remains editable through `/cms/home`.

## GitHub login

Register a GitHub OAuth app owned by Isaac:

- Application name: Isaac’s private notebook
- Homepage URL: `https://www.belloisaac.com`
- Authorization callback URL: `https://www.belloisaac.com/api/auth/callback/github`
- Device flow: off

Set these **Production** environment variables on the existing Vercel `website` project:

- `AUTH_GITHUB_ID`: the OAuth client ID
- `AUTH_GITHUB_SECRET`: the OAuth client secret
- `AUTH_SECRET`: a cryptographically random secret (at least 32 bytes)
- `AUTH_URL`: `https://www.belloisaac.com`
- `AUTH_TRUST_HOST`: `true`

Keep the existing `DATABASE_URL`. Never commit secrets. The login requests GitHub profile access (`read:user`), not repository access. Only immutable GitHub user ID `35108225` (verified as `isaaccodekill`) is admitted. Without configuration, the notebook stays locked. Redeploy after adding environment variables.

Verify the actual GitHub sign-in, create a private draft, reload it, and check signed-out `/api/posts` is 401 and `/cms` redirects to login. Do not publish personal drafts as part of deployment verification.

## Writing behavior

- New pages are always private drafts. GET/prefetch never creates a record.
- Draft edits autosave after 1.5 seconds, with writes serialized and explicit errors/retry.
- Read previews use the same safe structured-text renderer as public articles.
- Publishing requires a separate confirmation. The publish endpoint atomically writes the submitted content and status to the database; it no longer writes files in a serverless filesystem.
- Edits to an already published piece are held in the open tab until explicitly published. They do not autosave over the public version. Download a text copy before leaving if retaining unpublished revisions.
- Images newly added in the editor are embedded in the draft document, not uploaded to the previously public image bucket. Existing external image URLs remain externally hosted. New images are limited to 2 MB each; keep total request size below the hosting platform’s limit.
- Authentication is checked in each server page and private API handler, including metadata queries. Write handlers check request origin. Private responses have `no-store` headers.

## Local verification

Use only a disposable local PostgreSQL database on `127.0.0.1:55439/journal`. Set a separate local `AUTH_SECRET`, `AUTH_URL=http://localhost:3000`, and `AUTH_TRUST_HOST=true` in ignored `.env.local`. Apply the schema with drizzle-kit, then start Next. `node scripts/check-notebook.mjs` verifies authentication, default privacy, CSRF checks, draft exclusion, save/publish separation, and rendering. It creates explicitly labeled LOCAL sample records; never run it against production. Its generated local session fixture must not be committed.

`npm run build`, TypeScript, focused lint, and `npm audit --omit=dev` were also checked. The remaining audit notices are in development-only drizzle-kit tooling; do not run its development server against untrusted origins.

## Visual references

Pinterest exploration: https://www.pinterest.com/search/pins/?q=minimal%20personal%20blog%20website%20design

Sparse blog reference: https://www.pinterest.com/pin/361906520033127520/

Typographic reference: https://www.pinterest.com/pin/883479651882112847/

These informed spacious type, quiet rules and a personal notebook feel. No reference images were copied.
