module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  
  return res.status(200).json({
    status: "ok",
    url_env: process.env.SUPABASE_URL || "NO_URL",
    url_typo: process.env.SUPBASE_URL || "NO_TYPO",
    key_env: process.env.SUPABASE_SERVICE_ROLE_KEY ? "PRESENTE" : "FALTA"
  });
};
