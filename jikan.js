const fetch  = require('node-fetch');
const JIKAN  = 'https://api.jikan.moe/v4';
const NEEDED = 4;
const cache  = {};
const sleep  = (ms) => new Promise(r => setTimeout(r, ms));

async function getCharacterImages(name, malId) {
  const key = `${malId}`;
  if (cache[key]) {
    console.log(`[cache] ${name}`);
    return cache[key];
  }

  console.log(`[jikan] ID ${malId}: ${name}`);
  const images = []; // array ordenado, sin duplicados

  const addUnique = (url) => {
    if (url && typeof url === 'string' && !images.includes(url)) {
      images.push(url);
    }
  };

  try {
    // 1. Imagen principal del personaje
    const infoRes = await fetch(`${JIKAN}/characters/${malId}`, { timeout: 10000 });
    if (infoRes.ok) {
      const { data } = await infoRes.json();
      addUnique(data?.images?.jpg?.image_url);
      addUnique(data?.images?.jpg?.large_image_url);
      addUnique(data?.images?.webp?.image_url);
      addUnique(data?.images?.webp?.large_image_url);
    }

    // 2. Galería del personaje (fotos adicionales)
    await sleep(400);
    const galRes = await fetch(`${JIKAN}/characters/${malId}/pictures`, { timeout: 10000 });
    if (galRes.ok) {
      const { data } = await galRes.json();
      for (const pic of (data || [])) {
        if (images.length >= NEEDED) break;
        addUnique(pic.jpg?.image_url);
        addUnique(pic.jpg?.large_image_url);
        addUnique(pic.webp?.image_url);
        addUnique(pic.webp?.large_image_url);
      }
    }

    // 3. Si aún faltan, completar con variaciones de URL del CDN de MAL
    //    El CDN de MAL guarda imágenes como /images/characters/[folder]/[id].jpg
    //    donde folder = (malId / 1000) redondeado * 1000
    if (images.length < NEEDED) {
      const folder = Math.floor(malId / 1000) * 1000;
      const cdnBase = `https://cdn.myanimelist.net/images/characters/${folder}/${malId}`;
      addUnique(`${cdnBase}.jpg`);
      addUnique(`${cdnBase}l.jpg`); // versión large del CDN
    }

    // 4. Último recurso: si aún no hay 4, buscar personaje relacionado
    //    (evitamos repetir — solo completamos con lo que ya hay)
    const result = images.slice(0, NEEDED);
    if (result.length < NEEDED) {
      console.warn(`[jikan] ${name} solo tiene ${result.length} imágenes únicas`);
    }

    cache[key] = result;
    console.log(`[jikan] ✅ ${name}: ${result.length} imágenes únicas`);
    return result;

  } catch (err) {
    console.error(`[jikan] error "${name}" (id ${malId}):`, err.message);
    const folder  = Math.floor(malId / 1000) * 1000;
    const cdnBase = `https://cdn.myanimelist.net/images/characters/${folder}/${malId}`;
    return [`${cdnBase}.jpg`, `${cdnBase}l.jpg`, `${cdnBase}.jpg`, `${cdnBase}l.jpg`];
  }
}

module.exports = { getCharacterImages };