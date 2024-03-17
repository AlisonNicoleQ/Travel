// Archivo: src/server.js

// Se importa express
import express from 'express';
import { fileURLToPath } from 'url'; // Importa fileURLToPath para convertir URL a ruta de archivo
import path from 'path'; // Utiliza import para path

// Se importa usersRoute (siempre se especifica la extensión .js)
import usersRoute from './routes/usersRoute.js';

const __filename = fileURLToPath(import.meta.url); // Obtiene la ruta del archivo actual
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual

const app = express();

// Rutas
app.use("/api", usersRoute);

// Utiliza __dirname para establecer la ruta de la carpeta html
app.use(express.static(path.join(__dirname, 'html')));

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
