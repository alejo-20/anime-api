// ─────────────────────────────────────────────────────────────
//  jikan.js — Imágenes desde Jikan usando MAL ID exacto
//  Busca por ID directo → nunca equivoca el personaje
//  Combina: imagen principal + galería para 4 fotos distintas
// ─────────────────────────────────────────────────────────────

const fetch     = require('node-fetch');
const JIKAN     = 'https://api.jikan.moe/v4';
const NEEDED    = 4;
const cache     = {};
const sleep     = (ms) => new Promise(r => setTimeout(r, ms));

async function getCharacterImages(name, malId) {
  const key = `${malId}`;
  if (cache[key]) {
    console.log(`[cache] ${name}`);
    return cache[key];
  }

  console.log(`[jikan] buscando por ID ${malId}: ${name}`);
  const images = new Set();

  try {
    // 1. Datos principales del personaje por ID exacto
    const infoRes = await fetch(`${JIKAN}/characters/${malId}`, { timeout: 10000 });
    if (infoRes.ok) {
      const info = await infoRes.json();
      const d    = info.data;
      if (d?.images?.jpg?.image_url)       images.add(d.images.jpg.image_url);
      if (d?.images?.jpg?.large_image_url) images.add(d.images.jpg.large_image_url);
      if (d?.images?.webp?.image_url)      images.add(d.images.webp.image_url);
      if (d?.images?.webp?.large_image_url) images.add(d.images.webp.large_image_url);
    }

    // 2. Galería de fotos del personaje
    await sleep(400);
    const galRes = await fetch(`${JIKAN}/characters/${malId}/pictures`, { timeout: 10000 });
    if (galRes.ok) {
      const gal = await galRes.json();
      for (const pic of (gal.data || [])) {
        if (images.size >= NEEDED) break;
        if (pic.jpg?.image_url)       images.add(pic.jpg.image_url);
        if (pic.jpg?.large_image_url) images.add(pic.jpg.large_image_url);
        if (pic.webp?.image_url)      images.add(pic.webp.image_url);
      }
    }

    // 3. Si aún faltan, usar variaciones de URL del CDN de MAL
    //    MAL almacena imágenes en cdn.myanimelist.net con el formato:
    //    /images/characters/[folder]/[id].jpg  y  [id]l.jpg (large)
    if (images.size < NEEDED) {
      const folder  = Math.floor(malId / 1000) * 1000;
      const baseUrl = `https://cdn.myanimelist.net/images/characters/${folder}/${malId}`;
      images.add(`${baseUrl}.jpg`);
      images.add(`${baseUrl}l.jpg`);
    }

    const result = [...images].slice(0, NEEDED);

    // Si aún tenemos menos de 4, repetir la primera (último recurso)
    while (result.length < NEEDED) {
      result.push(result[0]);
    }

    cache[key] = result;
    console.log(`[jikan] ✅ ${name}: ${[...images].length} únicas encontradas`);
    return result;

  } catch (err) {
    console.error(`[jikan] error "${name}" (id ${malId}):`, err.message);
    // Fallback: construir URLs del CDN de MAL directo
    const folder  = Math.floor(malId / 1000) * 1000;
    const baseUrl = `https://cdn.myanimelist.net/images/characters/${folder}/${malId}`;
    const fallback = [
      `${baseUrl}.jpg`,
      `${baseUrl}l.jpg`,
      `${baseUrl}.jpg`,
      `${baseUrl}l.jpg`,
    ];
    cache[key] = fallback;
    return fallback;
  }
}

module.exports = { getCharacterImages };
