import "dotenv/config";
import "./config/defaults.js";
import app from "./app.js";

app.listen(process.env.PORT, () => console.log(`NextOwner API berjalan di http://localhost:${process.env.PORT}`));
