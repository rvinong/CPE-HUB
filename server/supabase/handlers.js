const { withSupabase } = require("@supabase/server");

const jsonError = (message, status = 500, headers) =>
  Response.json({ message }, { status, headers });

const methodNotAllowed = () =>
  jsonError("Method not allowed.", 405, { Allow: "GET" });

const healthFetch = withSupabase({ auth: "none" }, async (req, ctx) => {
  if (req.method !== "GET") return methodNotAllowed();

  return Response.json({
    ok: true,
    authMode: ctx.authMode,
    service: "cpe-hub",
  });
});

const profileFetch = withSupabase({ auth: "user" }, async (req, ctx) => {
  if (req.method !== "GET") return methodNotAllowed();

  const { data, error } = await ctx.supabase
    .from("profiles")
    .select("id,email,name,mobile,birthday,is_admin,created_at")
    .eq("id", ctx.userClaims.id)
    .single();

  if (error) return jsonError(error.message, 400);

  return Response.json({ profile: data });
});

const adminMerchFetch = withSupabase({ auth: "secret" }, async (req, ctx) => {
  if (req.method !== "GET") {
    return methodNotAllowed();
  }

  const { data, error } = await ctx.supabaseAdmin
    .from("merch")
    .select("*")
    .order("year", { ascending: false })
    .order("product_id", { ascending: false });

  if (error) return jsonError(error.message, 400);

  return Response.json({ merch: data });
});

module.exports = {
  adminMerchFetch,
  healthFetch,
  profileFetch,
};
