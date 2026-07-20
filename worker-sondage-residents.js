const ADMIN_KEY = "verdict360-2026";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method === "POST") {
      try {
        const data = await request.json();
        const entry = {
          reponses: data.reponses || {},
          commentaire: data.commentaire || "",
          date: new Date().toISOString(),
        };
        const cle = `reponse:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
        await env.SONDAGE_KV.put(cle, JSON.stringify(entry));
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders() },
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders() },
        });
      }
    }

    if (request.method === "GET" && url.pathname === "/admin") {
      const key = url.searchParams.get("key");
      if (key !== ADMIN_KEY) {
        return new Response("Accès refusé", { status: 401, headers: corsHeaders() });
      }
      const liste = await env.SONDAGE_KV.list({ prefix: "reponse:" });
      const toutes = [];
      for (const item of liste.keys) {
        const valeur = await env.SONDAGE_KV.get(item.name);
        if (valeur) toutes.push(JSON.parse(valeur));
      }
      toutes.sort((a, b) => new Date(b.date) - new Date(a.date));
      return new Response(JSON.stringify(toutes, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    return new Response("Not found", { status: 404, headers: corsHeaders() });
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
