// Archivo: src/routes/usersRoute.js

//Se importa express
import express from 'express';
//Funcion 'Router'
const router = express.Router();
//Se importa la DB, siempre hay que ponerle el .js
import prisma from '../database.js';

router.use(express.json());

// Ruta para obtener los clientes
router.get('/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ error: 'Hubo un error al obtener los clientes' });
  }
});

// Ruta para obtener los administradores
router.get('/admin', async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json(admins);
  } catch (error) {
    console.error('Error al obtener los administradores:', error);
    res.status(500).json({ error: 'Hubo un error al obtener los administradores' });
  }
});

// POST = INSERT
// POST para crear un cliente solamente con el nombre, correo y contraseña
router.post('/clientes', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  try {
    const newCliente = await prisma.cliente.create({
      data: {
        nombre,
        correo,
        contrasena
      }
    });

    res.json(newCliente);
    console.log('Cliente creado:', newCliente);
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json({ error: 'Hubo un error al crear el cliente' });
  }
});

export default router;
