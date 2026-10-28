
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({
      error: "Falta configurar Supabase en el servidor"
    });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({
      error: "Inicia sesión para consultar tu acceso"
    });
  }

  try {
    const baseUrl = supabaseUrl.replace(/\/+$/, "");

    const userResponse = await fetch(
      `${baseUrl}/auth/v1/user`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!userResponse.ok) {
      return res.status(401).json({
        error: "Sesión inválida o vencida"
      });
    }

    const user = await userResponse.json();

    const membershipResponse = await fetch(
      `${baseUrl}/rest/v1/pory_vip_memberships?user_id=eq.${encodeURIComponent(user.id)}&select=expires_at,status&status=eq.active&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`
        }
      }
    );

    if (!membershipResponse.ok) {
      return res.status(500).json({
        error: "No se pudo consultar la membresía"
      });
    }

    const memberships = await membershipResponse.json();
    const vip = memberships.length > 0;

    return res.status(200).json({
      authenticated: true,
      email: user.email || null,
      standard: true,
      vip,
      expiresAt: vip ? memberships[0].expires_at : null
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error interno al consultar el acceso"
    });
  }
}
