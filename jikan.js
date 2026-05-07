// ─────────────────────────────────────────────────────────────
//  jikan.js — Servicio de imágenes reales desde Jikan API
//  https://api.jikan.moe/v4  (MyAnimeList, gratis, sin API key)
//
//  • Busca el personaje por nombre en Jikan
//  • Devuelve hasta 4 imágenes reales (perfil + galería)
//  • Cache en memoria para no repetir llamadas innecesarias
//  • Si Jikan falla, devuelve imágenes placeholder como fallback
// ─────────────────────────────────────────────────────────────

const fetch = require('node-fetch');

const JIKAN_BASE  = 'https://api.jikan.moe/v4';
const IMAGES_NEEDED = 4;

// Cache en memoria: { "Naruto": [...4 urls] }
const imageCache = {};

// Fallback si Jikan no responde
const fallback = (name) => [
  `https://via.placeholder.com/300x300/1a1a2e/ffffff?text=${encodeURIComponent(name)}+1`,
  `https://via.placeholder.com/300x300/16213e/ffffff?text=${encodeURIComponent(name)}+2`,
  `https://via.placeholder.com/300x300/0f3460/ffffff?text=${encodeURIComponent(name)}+3`,
  `https://via.placeholder.com/300x300/e94560/ffffff?text=${encodeURIComponent(name)}+4`,
];

// Pausa para respetar el rate limit de Jikan (3 req/seg)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Obtiene 4 imágenes reales de un personaje desde Jikan API.
 * Usa cache para no repetir llamadas.
 *
 * @param {string} name - Nombre del personaje (ej: "Naruto")
 * @returns {Promise<string[]>} Array de 4 URLs de imágenes
 */
async function getCharacterImages(name) {
  // 1. Si ya está en cache, devuelve directamente
  if (imageCache[name]) {
    console.log(`[cache] ${name}`);
    return imageCache[name];
  }

  try {
    console.log(`[jikan] buscando imágenes de: ${name}`);

    // 2. Buscar el personaje en Jikan
    const searchUrl = `${JIKAN_BASE}/characters?q=${encodeURIComponent(name)}&limit=1`;
    const searchRes = await fetch(searchUrl, { timeout: 8000 });

    if (!searchRes.ok) throw new Error(`Jikan search error: ${searchRes.status}`);
    const searchData = await searchRes.json();

    if (!searchData.data || searchData.data.length === 0) {
      console.warn(`[jikan] no encontrado: ${name}`);
      return fallback(name);
    }

    const character = searchData.data[0];
    const malId     = character.mal_id;
    const images    = [];

    // 3. Imagen principal (perfil oficial de MAL)
    const mainImage = character.images?.jpg?.image_url
                   || character.images?.webp?.image_url;
    if (mainImage) images.push(mainImage);

    // 4. Buscar imágenes adicionales en la galería del personaje
    await sleep(400); // respetar rate limit de Jikan
    const galleryUrl = `${JIKAN_BASE}/characters/${malId}/pictures`;
    const galleryRes = await fetch(galleryUrl, { timeout: 8000 });

    if (galleryRes.ok) {
      const galleryData = await galleryRes.json();
      const galleryImgs = (galleryData.data || [])
        .map((p) => p.jpg?.image_url || p.webp?.image_url)
        .filter(Boolean);

      // Añadir imágenes de galería hasta tener 4
      for (const url of galleryImgs) {
        if (images.length >= IMAGES_NEEDED) break;
        if (!images.includes(url)) images.push(url);
      }
    }

    // 5. Si no alcanzamos 4, repetir la principal como relleno
    while (images.length < IMAGES_NEEDED) {
      images.push(images[0] || fallback(name)[images.length]);
    }

    const result = images.slice(0, IMAGES_NEEDED);

    // 6. Guardar en cache
    imageCache[name] = result;
    console.log(`[jikan] ✅ ${name}: ${result.length} imágenes`);

    return result;

  } catch (err) {
    console.error(`[jikan] error para "${name}":`, err.message);
    return fallback(name);
  }
}

/**
 * Pre-carga las imágenes de todos los personajes de una categoría.
 * Útil para "calentar" el cache al iniciar el servidor.
 *
 * @param {Object[]} characters - Array de personajes
 */
async function preloadCategory(characters) {
  for (const char of characters) {
    await getCharacterImages(char.name);
    await sleep(500); // 500ms entre cada llamada para no saturar Jikan
  }
}

module.exports = { getCharacterImages, preloadCategory };
