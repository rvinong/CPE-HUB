# Supabase Server SDK

This project uses `@supabase/server` for server-side request handlers. The browser app still uses `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`; these server handlers use separate server-only variables.

Required server environment variables:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SECRET_KEY=your-supabase-secret-key
SUPABASE_JWKS_URL=https://your-project-ref.supabase.co/auth/v1/.well-known/jwks.json
```

Never commit `SUPABASE_SECRET_KEY`. Add it only in Vercel/Supabase environment settings.

Handlers:

- `GET /api/supabase-health`: open health check using `auth: "none"`.
- `GET /api/me`: user endpoint using `auth: "user"` and the RLS-scoped `ctx.supabase` client. Send `Authorization: Bearer <user-jwt>`.
- `GET /api/admin/merch`: server-to-server endpoint using `auth: "secret"` and `ctx.supabaseAdmin`. Send `apikey: <SUPABASE_SECRET_KEY>`.

For Supabase Edge Functions using non-user auth modes, set `verify_jwt = false` for that function in `supabase/config.toml`.
