const express     = require('express');
const cors        = require('cors');
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const animeData   = require('./data');
const { getCharacterImages } = require('./jikan');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ── Swagger ───────────────────────────────────────────────────
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: '🎌 Anime API Docs',
  customCss: `
    .swagger-ui .topbar { background-color: #0f0f1a; }
    .swagger-ui .info .title { color: #e74c3c; }
  `,
  swaggerOptions: { docExpansion: 'list', tryItOutEnabled: true },
}));

app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── Helper ────────────────────────────────────────────────────
const LABELS = {
  saintseiya:    'Saint Seiya',
  hunterxhunter: 'Hunter x Hunter',
  onepiece:      'One Piece',
  naruto:        'Naruto',
};

// Agrega imágenes de Jikan a un personaje
async function withImages(character) {
  const images = await getCharacterImages(character.name);
  return { ...character, images, images_count: images.length };
}

// ── Rutas ─────────────────────────────────────────────────────

/**
 * @swagger
 * /:
 *   get:
 *     summary: Bienvenida y lista de endpoints
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Info general de la API
 *         content:
 *           application/json:
 *             example:
 *               message: "🎌 Anime API funcionando"
 *               version: "1.0.0"
 *               images_source: "Jikan API (MyAnimeList)"
 *               docs: "http://localhost:3000/docs"
 */
app.get('/', (req, res) => {
  res.json({
    message: '🎌 Anime API funcionando',
    version: '1.0.0',
    images_source: 'Jikan API (MyAnimeList) — imágenes reales',
    docs: `http://localhost:${PORT}/docs`,
    endpoints: {
      'GET /categories':           'Lista las 4 series',
      'GET /:category':            '10 personajes de una serie (sin imágenes)',
      'GET /:category/:name':      'Personaje completo con 4 imágenes reales',
      'GET /:category/search?q=':  'Búsqueda parcial por nombre',
    },
    categories: Object.keys(animeData),
  });
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista las 4 series de anime disponibles
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
app.get('/categories', (req, res) => {
  const data = Object.keys(animeData).map((k) => ({
    id:    k,
    label: LABELS[k],
    total: animeData[k].length,
    characters: animeData[k].map((c) => c.name),
  }));
  res.json({ success: true, data });
});

/**
 * @swagger
 * /{category}:
 *   get:
 *     summary: Lista los 10 personajes de una serie (datos base, sin imágenes)
 *     description: Para obtener las imágenes reales usa **GET /{category}/{name}**
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [saintseiya, hunterxhunter, onepiece, naruto]
 *         example: naruto
 *     responses:
 *       200:
 *         description: Lista de personajes
 *       404:
 *         description: Categoría no encontrada
 */
app.get('/:category', (req, res) => {
  const { category } = req.params;
  if (category === 'favicon.ico') return res.status(204).end();

  if (!animeData[category]) {
    return res.status(404).json({
      success: false,
      message: `Categoría "${category}" no encontrada`,
      available: Object.keys(animeData),
    });
  }

  res.json({
    success:  true,
    category,
    label:    LABELS[category],
    total:    animeData[category].length,
    note:     'Usa GET /:category/:name para obtener las 4 imágenes reales del personaje',
    data:     animeData[category],
  });
});

/**
 * @swagger
 * /{category}/search:
 *   get:
 *     summary: Busca personajes por nombre parcial
 *     description: Búsqueda insensible a mayúsculas. Devuelve datos base sin imágenes.
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [saintseiya, hunterxhunter, onepiece, naruto]
 *         example: naruto
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example: nar
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *       400:
 *         description: Falta el parámetro q
 *       404:
 *         description: Sin resultados
 */
app.get('/:category/search', (req, res) => {
  const { category } = req.params;
  const { q }        = req.query;

  if (!animeData[category]) {
    return res.status(404).json({ success: false, message: `Categoría "${category}" no encontrada` });
  }
  if (!q) {
    return res.status(400).json({ success: false, message: 'Debes enviar ?q=nombre' });
  }

  const results = animeData[category].filter((c) =>
    c.name.toLowerCase().includes(q.toLowerCase())
  );

  if (!results.length) {
    return res.status(404).json({
      success: false,
      message: `Sin resultados para "${q}" en ${category}`,
    });
  }

  res.json({ success: true, category, query: q, total: results.length, data: results });
});

/**
 * @swagger
 * /{category}/{name}:
 *   get:
 *     summary: Obtiene un personaje con sus 4 imágenes reales de MyAnimeList
 *     description: |
 *       Busca el personaje en la base local y obtiene **4 imágenes reales**
 *       desde la **Jikan API (MyAnimeList)** automáticamente.
 *
 *       Las imágenes se guardan en **cache** después de la primera consulta,
 *       así que la segunda vez la respuesta es instantánea.
 *
 *       ⚠️ La primera consulta puede tardar 1-2 segundos mientras busca en Jikan.
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [saintseiya, hunterxhunter, onepiece, naruto]
 *         example: naruto
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         example: Naruto
 *     responses:
 *       200:
 *         description: Personaje con 4 imágenes reales de MyAnimeList
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               category: naruto
 *               images_source: "Jikan API (MyAnimeList)"
 *               data:
 *                 id: 1
 *                 name: Naruto
 *                 age: "17"
 *                 power: "Rasengan / Modo Sabio"
 *                 images_count: 4
 *                 images:
 *                   - "https://cdn.myanimelist.net/images/characters/2/284121.jpg"
 *                   - "https://cdn.myanimelist.net/images/characters/2/284121.jpg"
 *                   - "https://cdn.myanimelist.net/images/characters/2/284121.jpg"
 *                   - "https://cdn.myanimelist.net/images/characters/2/284121.jpg"
 *       404:
 *         description: Personaje o categoría no encontrada
 */
app.get('/:category/:name', async (req, res) => {
  const { category, name } = req.params;

  if (!animeData[category]) {
    return res.status(404).json({
      success:   false,
      message:   `Categoría "${category}" no encontrada`,
      available: Object.keys(animeData),
    });
  }

  const character = animeData[category].find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );

  if (!character) {
    return res.status(404).json({
      success:   false,
      message:   `Personaje "${name}" no encontrado en ${category}`,
      available: animeData[category].map((c) => c.name),
    });
  }

  // Obtiene imágenes reales de Jikan (con cache)
  const full = await withImages(character);

  res.json({
    success:       true,
    category,
    images_source: 'Jikan API (MyAnimeList)',
    data:          full,
  });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Anime API  →  http://localhost:${PORT}`);
  console.log(`📖 Swagger    →  http://localhost:${PORT}/docs`);
  console.log(`🖼️  Imágenes   →  Jikan API (MyAnimeList) con cache`);
});
