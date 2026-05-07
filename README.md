# 🎌 Anime API

API REST de personajes de anime con Express.js, lista para Railway.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Info general y lista de endpoints |
| GET | `/categories` | Lista las 4 categorías disponibles |
| GET | `/:category` | Los 10 personajes de una categoría |
| GET | `/:category/:name` | Personaje exacto por nombre |
| GET | `/:category/search?q=nombre` | Búsqueda parcial por nombre |

## Categorías válidas

- `saintseiya`
- `hunterxhunter`
- `onepiece`
- `naruto`

## Ejemplos

```
GET /naruto/Naruto
GET /onepiece/Luffy
GET /hunterxhunter/search?q=kil
GET /saintseiya
```

## Correr localmente

```bash
npm install
npm start
# → http://localhost:3000
```
