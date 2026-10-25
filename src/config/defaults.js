// Nilai bawaan bila .env tidak ada; diimpor paling awal oleh server.js dan cli.js.
process.env.DB_STORAGE ||= "./database.sqlite";
process.env.JWT_SECRET ||= "nextowner-dev-secret";
process.env.PORT ||= "4000";
