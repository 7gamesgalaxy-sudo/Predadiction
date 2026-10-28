const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({
      error: "Falta configurar Supabase en el servidor",
      debug_url: supabaseUrl ? "Presente" : "Vacía o No encontrada",
      debug_key: serviceKey ? "Presente" : "Vacía o No encontrada"
    });
  }
