// Archivo: src/server.js

//Se importa express
import express from 'express';
//Se importa usersRoute siempre se pone el .js
import usersRoute from './routes/usersRoute.js';

const app = express();

// Rutas
app.use("/api", usersRoute);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
