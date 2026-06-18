// ============================================================
// ACADÉMIE VERDICT 360 AI — Gestion codes d'accès
// À ajouter dans academie.fragrant-pond-3bd6.workers.dev
// KV Binding requis : ACADEMIE_CODES
// ============================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ─────────────────────────────────────────
    // POST /generer-code
    // Génère un nouveau code à 6 chiffres
    // Usage : Jacques appelle cette route depuis la page admin
    // ─────────────────────────────────────────
    if (path === "/generer-code" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const nom = body.nom || "Employé";
      const programme = body.programme || "manipulateur"; // manipulateur | gestionnaire

      // Générer code 6 chiffres unique
      let code;
      let existe = true;
      while (existe) {
        code = Math.floor(100000 + Math.random() * 900000).toString();
        const check = await env.ACADEMIE_CODES.get(`code:${code}`);
        existe = check !== null;
      }

      // Sauvegarder dans KV
      const data = {
        code,
        nom,
        programme,
        essais_restants: 3,
        utilise: false,
        cree_le: new Date().toISOString(),
        expire_le: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 jours
      };

      await env.ACADEMIE_CODES.put(
        `code:${code}`,
        JSON.stringify(data),
        { expirationTtl: 90 * 24 * 60 * 60 } // 90 jours en secondes
      );

      return new Response(JSON.stringify({
        success: true,
        code,
        nom,
        programme,
        message: `Code généré pour ${nom} — ${programme}`
      }), { headers: corsHeaders });
    }

    // ─────────────────────────────────────────
    // POST /valider-code
    // Vérifie le code entré par l'employé
    // Décrémente le compteur d'essais
    // ─────────────────────────────────────────
    if (path === "/valider-code" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const code = (body.code || "").trim();

      if (!code || code.length !== 6) {
        return new Response(JSON.stringify({
          success: false,
          erreur: "Code invalide — 6 chiffres requis."
        }), { headers: corsHeaders });
      }

      const raw = await env.ACADEMIE_CODES.get(`code:${code}`);

      // Code inexistant
      if (!raw) {
        return new Response(JSON.stringify({
          success: false,
          erreur: "Code introuvable. Vérifiez et réessayez."
        }), { headers: corsHeaders });
      }

      const data = JSON.parse(raw);

      // Code déjà utilisé (formation complétée)
      if (data.utilise) {
        return new Response(JSON.stringify({
          success: false,
          erreur: "Ce code a déjà été utilisé pour compléter une formation."
        }), { headers: corsHeaders });
      }

      // Plus d'essais
      if (data.essais_restants <= 0) {
        return new Response(JSON.stringify({
          success: false,
          erreur: "Ce code est désactivé après 3 tentatives. Contactez votre responsable."
        }), { headers: corsHeaders });
      }

      // Code valide — décrémenter essais
      data.essais_restants -= 1;

      await env.ACADEMIE_CODES.put(
        `code:${code}`,
        JSON.stringify(data),
        { expirationTtl: 90 * 24 * 60 * 60 }
      );

      return new Response(JSON.stringify({
        success: true,
        nom: data.nom,
        programme: data.programme,
        essais_restants: data.essais_restants,
        message: `Accès accordé — ${data.programme}`
      }), { headers: corsHeaders });
    }

    // ─────────────────────────────────────────
    // POST /completer-formation
    // Marque le code comme utilisé après réussite de l'examen
    // ─────────────────────────────────────────
    if (path === "/completer-formation" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const code = (body.code || "").trim();
      const score = body.score || 0;

      const raw = await env.ACADEMIE_CODES.get(`code:${code}`);
      if (!raw) {
        return new Response(JSON.stringify({
          success: false,
          erreur: "Code introuvable."
        }), { headers: corsHeaders });
      }

      const data = JSON.parse(raw);
      data.utilise = true;
      data.score_final = score;
      data.complete_le = new Date().toISOString();

      await env.ACADEMIE_CODES.put(
        `code:${code}`,
        JSON.stringify(data),
        { expirationTtl: 90 * 24 * 60 * 60 }
      );

      return new Response(JSON.stringify({
        success: true,
        message: "Formation marquée complétée.",
        nom: data.nom,
        programme: data.programme,
        score
      }), { headers: corsHeaders });
    }

    // ─────────────────────────────────────────
    // GET /statut-code?code=XXXXXX
    // Vérifie le statut d'un code (usage admin)
    // ─────────────────────────────────────────
    if (path === "/statut-code" && request.method === "GET") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response(JSON.stringify({ erreur: "Paramètre code requis." }), { headers: corsHeaders });
      }

      const raw = await env.ACADEMIE_CODES.get(`code:${code}`);
      if (!raw) {
        return new Response(JSON.stringify({ erreur: "Code introuvable." }), { headers: corsHeaders });
      }

      return new Response(raw, { headers: corsHeaders });
    }

    // Route inconnue
    return new Response(JSON.stringify({ erreur: "Route inconnue." }), {
      status: 404,
      headers: corsHeaders
    });
  }
};
