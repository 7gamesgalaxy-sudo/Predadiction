export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const supabaseUrl = process.env.SUPABASE_URL || "NO_DEFINIDA";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "NO_DEFINIDA";

  return res.status(200).json({
    url_status: supabaseUrl !== "NO_DEFINIDA" ? "OK" : "FALTA",
    key_status: serviceKey !== "NO_DEFINIDA" ? "OK" : "FALTA"
  });
}
