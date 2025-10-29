import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();


// Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(
rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200, // límite de 200 peticiones por IP
    standardHeaders: true,
    legacyHeaders: false,
}));

// Rutas
app.use("/api/", userRoutes);

// Salud
app.get("/health", (req, res) => { res.json({ status: "ok" }); });

// Inicio
const port = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI)
    .then(() => app.listen(port, () => console.log(`API lista en http://localhost:${port}`)))
    .catch((error) => {
        console.error("Error iniciando el servidor:", error);
        process.exit(1);
    });