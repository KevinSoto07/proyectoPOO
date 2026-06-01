import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import Database from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
//import usuarioRoutes from './routes/usuarioRoutes';
//import leccionRoutes from './routes/leccionRoutes';
//import calificacionRoutes from './routes/calificacionRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rutas
//app.use('/api/usuarios', usuarioRoutes);
//app.use('/api/lecciones', leccionRoutes);
//app.use('/api/calificaciones', calificacionRoutes);

//error de ruta
app.use((req, res) => {
    res.status(404).json({ error: true, message: 'Ruta no encontrada' });
})

//errorHandler
app.use(errorHandler)

//servidor
async function main(): Promise<void> {
    try {
        await Database.testConnection();
        app.listen(PORT, () => {
            console.log(`Servidor encendido en ${PORT}`);
        })
    } catch (error) {
        console.error(`Error de conexión:`, error);
        process.exit(1);
    }
}

main();