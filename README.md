# NextOwner — Back-end (REST API)
Proyek 1 PABWE 2026 (individu). API platform preloved & thrifting. Repo front-end terpisah: `ifs24056-pabwe2026-proyek1-frontend`.

- **Stack:** Express.js + Sequelize (migrasi Umzug) + SQLite
- **Pengujian:** Vitest + Supertest (coverage 100%), Jenkins + SonarQube
- Prasyarat: Node.js 20+ dan Git

## Menjalankan di localhost
```bash
git clone <url-repository-backend> ifs24056-pabwe2026-proyek1-backend
cd ifs24056-pabwe2026-proyek1-backend
cp .env.example .env        # Windows CMD: copy .env.example .env
npm install
npm run db:setup            # migrasi + seed database SQLite
npm run dev                 # API di http://localhost:4000
```
Cek: http://localhost:4000/api/health. Akun demo: `demo@nextowner.id` / `demo123`.

Perintah database: `npm run db:migrate` (hanya migrasi), `npm run db:seed` (isi ulang data contoh).

## Pengujian
```bash
npm run test:coverage       # laporan di coverage/lcov.info (dibaca SonarQube)
```

## Deploy
Deploy terpisah dari front-end. Pipeline ada di `Jenkinsfile` (Checkout, Install, Test, Trivy, SonarQube, Quality Gate, Package, Publish, Deploy). Setelah deploy, catat URL API-nya dan isikan ke `VITE_API_URL` di repo front-end (contoh `https://<domain-backend>/api`).

## Struktur
```
src/  config/ db/(migrations, migrator, seed, cli) models/ routes/ middleware.js app.js server.js
```
Tes diletakkan di samping kodenya (`*.test.js`).

## Endpoint
`POST /api/auth/register|login`, `GET /api/auth/me`, `GET /api/items?q&category&condition&min&max&sort`, `GET /api/items/mine`,
`POST /api/items`, `GET|PUT|DELETE /api/items/:id`, `GET /api/favorites`, `GET /api/favorites/ids`, `POST /api/favorites/:id`, `GET /api/health`.
