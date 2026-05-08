// ─────────────────────────────────────────────────────────────
//  jikan.js — Imágenes reales desde Jikan API (MyAnimeList)
//  Busca hasta 4 imágenes DISTINTAS por personaje.
//  Si la galería tiene pocas, busca resultados alternativos
//  del mismo personaje para completar las 4.
// ─────────────────────────────────────────────────────────────

const fetch = require('node-fetch');

const JIKAN_BASE    = 'https://api.jikan.moe/v4';
const IMAGES_NEEDED = 4;
const imageCache    = {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Placeholder único por posición (nunca repite)
const placeholder = (name, index) =>
  `https://via.placeholder.com/300x300/1a1a2e/ffffff?text=${encodeURIComponent(name + ' ' + index)}`;

/**
 * Obtiene 4 imágenes DISTINTAS de un personaje desde Jikan.
 */
async function getCharacterImages(name) {
  if (imageCache[name]) {
    console.log(`[cache] ${name}`);
    return imageCache[name];
  }

  try {
    console.log(`[jikan] buscando: ${name}`);

    // 1. Buscar el personaje — pedimos hasta 5 resultados
    //    para tener alternativas si el primero tiene poca galería
    const searchRes = await fetch(
      `${JIKAN_BASE}/characters?q=${encodeURIComponent(name)}&limit=5`,
      { timeout: 10000 }
    );
    if (!searchRes.ok) throw new Error(`search ${searchRes.status}`);
    const searchData = await searchRes.json();

    if (!searchData.data || searchData.data.length === 0) {
      console.warn(`[jikan] no encontrado: ${name}`);
      return [1,2,3,4].map(i => placeholder(name, i));
    }

    const images = new Set(); // Set para garantizar URLs únicas

    // 2. Recorrer los resultados hasta tener 4 imágenes distintas
    for (const character of searchData.data) {
      if (images.size >= IMAGES_NEEDED) break;

      // Imagen principal del perfil
      const main = character.images?.jpg?.image_url
                || character.images?.webp?.image_url;
      if (main) images.add(main);

      // Imagen en tamaño grande (suele ser diferente)
      const large = character.images?.jpg?.large_image_url
                 || character.images?.webp?.large_image_url;
      if (large && large !== main) images.add(large);

      if (images.size >= IMAGES_NEEDED) break;

      // 3. Galería del personaje
      await sleep(350);
      const galRes = await fetch(
        `${JIKAN_BASE}/characters/${character.mal_id}/pictures`,
        { timeout: 8000 }
      );
      if (galRes.ok) {
        const galData = await galRes.json();
        for (const pic of (galData.data || [])) {
          if (images.size >= IMAGES_NEEDED) break;
          const url = pic.jpg?.image_url || pic.webp?.image_url;
          if (url) images.add(url);
          // Versión large de la galería
          const urlL = pic.jpg?.large_image_url || pic.webp?.large_image_url;
          if (urlL && urlL !== url) images.add(urlL);
        }
      }
    }

    // 4. Si aún faltan, completar con placeholders únicos
    const result = [...images].slice(0, IMAGES_NEEDED);
    while (result.length < IMAGES_NEEDED) {
      result.push(placeholder(name, result.length + 1));
    }

    imageCache[name] = result;
    console.log(`[jikan] ✅ ${name}: ${result.length} imágenes distintas`);
    return result;

  } catch (err) {
    console.error(`[jikan] error "${name}":`, err.message);
    return [1,2,3,4].map(i => placeholder(name, i));
  }
}

module.exports = { getCharacterImages };