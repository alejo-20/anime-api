const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🎌 Anime API',
      version: '1.0.0',
      description: `
API REST de personajes de anime con imágenes reales de **MyAnimeList** via Jikan API.

### ¿Cómo funcionan las imágenes?
1. Consultas un personaje: \`GET /naruto/Naruto\`
2. El servidor busca automáticamente en **Jikan API (MyAnimeList)**
3. Retorna **4 imágenes reales** del personaje
4. Las imágenes quedan en **cache** — la segunda consulta es instantánea

### Categorías disponibles
| ID | Serie |
|----|-------|
| \`saintseiya\` | Saint Seiya |
| \`hunterxhunter\` | Hunter x Hunter |
| \`onepiece\` | One Piece |
| \`naruto\` | Naruto |

> ⚠️ La primera consulta de cada personaje tarda ~1-2s mientras busca en Jikan.
      `,
    },
    servers: [
      { url: 'http://localhost:3000',                          description: 'Local' },
      { url: 'https://anime-api-production.up.railway.app',   description: 'Railway (producción)' },
    ],
    tags: [
      { name: 'General',    description: 'Información de la API' },
      { name: 'Categorías', description: 'Series de anime disponibles' },
      { name: 'Personajes', description: 'Consulta personajes con imágenes reales' },
    ],
    components: {
      schemas: {
        Character: {
          type: 'object',
          properties: {
            id:           { type: 'integer', example: 1 },
            name:         { type: 'string',  example: 'Naruto' },
            age:          { type: 'string',  example: '17' },
            power:        { type: 'string',  example: 'Rasengan / Modo Sabio' },
            images_count: { type: 'integer', example: 4 },
            images: {
              type: 'array',
              items: { type: 'string', format: 'uri' },
              description: 'URLs reales de MyAnimeList (cdn.myanimelist.net)',
            },
          },
        },
        Error404: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string',  example: 'Personaje no encontrado' },
          },
        },
      },
    },
  },
  apis: ['./server.js'],
};

module.exports = swaggerJsdoc(options);
