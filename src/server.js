import "dotenv/config";
import "./config/defaults.js";
import app from "./app.js";

// Vercel membutuhkan export default, bukan app.listen
export default app;

// Kode di bawah ini hanya akan berjalan jika kamu menjalankannya di localhost (bukan di Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`NextOwner API berjalan di http://localhost:${PORT}`);
  });
}