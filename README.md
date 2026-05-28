# Full Stack JS Challenge

REST API en Node.js + Express que consume y reformatea archivos CSV de una API externa, con un frontend en React que muestra los datos de forma interactiva.

---

## Arquitectura

```
toolbox/
├── api/                  Node.js 14 — REST API (puerto 8000)
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/files.js        GET /files/data, GET /files/list
│   │   ├── services/externalApi.js
│   │   └── utils/csvParser.js
│   └── test/files.test.js         7 tests (Mocha + Chai)
├── frontend/             Node.js 16 — React SPA (puerto 3000)
│   ├── src/
│   │   ├── App.jsx                Orquestador principal
│   │   ├── components/
│   │   │   ├── AppNavbar.jsx
│   │   │   ├── FileAutocomplete.jsx
│   │   │   ├── FileListTable.jsx
│   │   │   └── FileTable.jsx
│   │   ├── store/filesSlice.js    Redux Toolkit
│   │   └── services/api.js
│   └── test/                      22 tests (Jest + Testing Library)
├── docker-compose.yml
└── README.md
```

---

## Flujo de la aplicación

### API
El API recibe las peticiones del frontend, consulta la API externa (`echo-serv.tbxnet.com`) y devuelve los datos formateados:

```
Frontend → GET /files/list          → lista de archivos disponibles
Frontend → GET /files/data?fileName → contenido del archivo parseado
```

Cada archivo en la respuesta incluye:
- `lines[]` — filas válidas con campos `text`, `number`, `hex`
- `error` — mensaje específico si el archivo no pudo cargarse (vacío, malformado, fallo de descarga)
- `warning` — aviso si algunas filas fueron descartadas pero hay datos válidos

### Frontend
Página única con dos vistas controladas por el autocomplete:

```
[Autocomplete] ← el usuario escribe o selecciona

Vista A (sin selección):   tabla con todos los archivos disponibles + botón "See File"
Vista B (con selección):   tabla con el contenido del archivo seleccionado

Al limpiar la selección → vuelve a Vista A sin nueva petición (fileList cacheado en Redux)
Al re-seleccionar el mismo archivo → no hace nueva petición (resultado cacheado en Redux)
```

---

## Ejecución sin Docker

### Requisitos
- Node.js 14+ para el API
- Node.js 16+ para el frontend

### API

```bash
cd api
npm install
npm start         # escucha en http://localhost:8000
```

```bash
# Verificar que funciona
curl http://localhost:8000/files/list
curl http://localhost:8000/files/data
curl "http://localhost:8000/files/data?fileName=test1.csv"
```

### Frontend

```bash
cd frontend
npm install
npm start         # abre en http://localhost:3000
```

> El frontend debe iniciarse con el API ya corriendo. El dev server proxea `/files/*` a `http://localhost:8000` automáticamente.

### Tests

```bash
# API — 7 tests
cd api && npm test

# Frontend — 22 tests
cd frontend && npm test

# Lint (StandardJS)
cd api && npm run lint
```

---

## Ejecución con Docker

### Requisito
- Docker Desktop instalado y corriendo

### Levantar ambas apps

```bash
docker-compose up --build
```

| Servicio  | URL                    |
|-----------|------------------------|
| API       | http://localhost:8000  |
| Frontend  | http://localhost:3000  |

### Comandos útiles

```bash
# Solo construir las imágenes
docker-compose build

# Correr en segundo plano
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

> En Docker, el frontend usa `API_URL=http://api:8000` como destino del proxy, apuntando al contenedor del API por nombre de servicio en lugar de `localhost`.

---

## Endpoints del API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/files/list` | Lista de archivos disponibles en la fuente |
| GET | `/files/data` | Contenido de todos los archivos (líneas válidas) |
| GET | `/files/data?fileName=x.csv` | Contenido de un archivo específico |

### Ejemplo de respuesta — `/files/data?fileName=file1.csv`

```json
[
  {
    "file": "file1.csv",
    "lines": [
      { "text": "RgTya", "number": 64075909, "hex": "70ad29aacf0b690b0467fe2b2767f765" }
    ]
  }
]
```

Cuando un archivo no tiene datos válidos, la respuesta incluye un campo `error` con la causa:

```json
[
  { "file": "empty.csv",    "lines": [], "error": "The file is empty — no rows were found." },
  { "file": "bad.csv",      "lines": [], "error": "All 3 rows in this file are malformed..." },
  { "file": "offline.csv",  "lines": [], "error": "Could not download this file from the source." }
]
```

---

## Stack

| Capa | Tecnología |
|------|-----------|
| API | Node.js 14, Express, Axios, CORS |
| Tests API | Mocha, Chai, chai-http, nock |
| Lint | StandardJS |
| Frontend | React 18, Redux Toolkit, React Bootstrap, Webpack 5 |
| Tests Frontend | Jest, Testing Library |
| Infraestructura | Docker, Docker Compose |
