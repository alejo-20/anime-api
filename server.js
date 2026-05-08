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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: '🎌 Anime API Docs',
  swaggerOptions: { docExpansion: 'list', tryItOutEnabled: true },
}));
app.get('/docs.json', (req, res) => { res.setHeader('Content-Type','application/json'); res.send(swaggerSpec); });

const LABELS = { saintseiya:'Saint Seiya', hunterxhunter:'Hunter x Hunter', onepiece:'One Piece', naruto:'Naruto' };

/**
 * @swagger
 * /:
 *   get:
 *     summary: Bienvenida
 *     tags: [General]
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/', (req, res) => {
  res.json({ message:'🎌 Anime API', docs:`http://localhost:${PORT}/docs`, categories: Object.keys(animeData) });
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista las 4 series
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/categories', (req, res) => {
  const data = Object.keys(animeData).map(k => ({
    id: k, label: LABELS[k], total: animeData[k].length,
    characters: animeData[k].map(c => c.name),
  }));
  res.json({ success: true, data });
});

/**
 * @swagger
 * /{category}:
 *   get:
 *     summary: Lista los 10 personajes de una serie
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [saintseiya, hunterxhunter, onepiece, naruto]
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrado
 */
app.get('/:category', (req, res) => {
  const { category } = req.params;
  if (category === 'favicon.ico') return res.status(204).end();
  if (!animeData[category]) {
    return res.status(404).json({ success:false, message:`Categoría "${category}" no encontrada`, available: Object.keys(animeData) });
  }
  // Devuelve sin imágenes (se cargan al consultar individualmente)
  const data = animeData[category].map(({ malId, ...rest }) => rest);
  res.json({ success:true, category, label: LABELS[category], total: data.length, data });
});

/**
 * @swagger
 * /{category}/search:
 *   get:
 *     summary: Busca por nombre parcial
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [saintseiya, hunterxhunter, onepiece, naruto]
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Falta q
 *       404:
 *         description: No encontrado
 */
app.get('/:category/search', (req, res) => {
  const { category } = req.params;
  const { q }        = req.query;
  if (!animeData[category]) return res.status(404).json({ success:false, message:`Categoría no encontrada` });
  if (!q) return res.status(400).json({ success:false, message:'Envía ?q=nombre' });
  const results = animeData[category]
    .filter(c => c.name.toLowerCase().includes(q.toLowerCase()))
    .map(({ malId, ...rest }) => rest);
  if (!results.length) return res.status(404).json({ success:false, message:`Sin resultados para "${q}"` });
  res.json({ success:true, category, query:q, total:results.length, data:results });
});

/**
 * @swagger
 * /{category}/{name}:
 *   get:
 *     summary: Personaje con 4 imágenes reales de MyAnimeList
 *     description: Busca el personaje por ID exacto en MAL. Siempre devuelve el personaje correcto con imágenes únicas.
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
 *         description: Personaje con imágenes
 *       404:
 *         description: No encontrado
 */
app.get('/:category/:name', async (req, res) => {
  const { category, name } = req.params;
  if (!animeData[category]) {
    return res.status(404).json({ success:false, message:`Categoría "${category}" no encontrada`, available: Object.keys(animeData) });
  }
  const character = animeData[category].find(c => c.name.toLowerCase() === decodeURIComponent(name).toLowerCase());
  if (!character) {
    return res.status(404).json({
      success:false,
      message:`"${name}" no encontrado en ${category}`,
      available: animeData[category].map(c => c.name),
    });
  }

  // Busca imágenes por MAL ID exacto
  const images = await getCharacterImages(character.name, character.malId);
  const { malId, ...charData } = character;

  res.json({
    success: true,
    category,
    data: { ...charData, images, images_count: images.length },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Anime API  → http://localhost:${PORT}`);
  console.log(`📖 Swagger    → http://localhost:${PORT}/docs`);
});
