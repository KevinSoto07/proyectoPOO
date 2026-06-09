import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import Database from "./config/database";
import { errorHandler } from "./middleware/errorHandler";

// Importación de las rutas con sus nuevos nombres en inglés
import userRoutes from './routes/User.routes';
import lessonRoutes from './routes/Lesson.routes';
import gradeRoutes from './routes/calificacion.routes'; // o scoreRoutes, dependiendo de cómo lo nombraste

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API (Endpoints en inglés)
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/grades', gradeRoutes);

// Error de ruta (404)
app.use((req, res) => {
    res.status(404).json({ error: true, message: 'Ruta no encontrada / Route not found' });
});

// Error Handler Middleware
app.use(errorHandler);

// Servidor
async function main(): Promise<void> {
    try {
        await Database.testConnection();
        app.listen(PORT, () => {
            console.log(`Servidor encendido en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error(`Error de conexión a la base de datos:`, error);
        process.exit(1);
    }
}

main();