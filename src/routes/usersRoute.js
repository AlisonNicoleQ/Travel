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
  const { nombre, correo, contrasena, telefono } = req.body;

  try {
    const newCliente = await prisma.cliente.create({
      data: {
        nombre,
        telefono,
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

//ruta para el login, verifica que el email que se da existe, y ademas revisa que el pass sea igual.
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Query the database to find a user with the provided email
      const user = await prisma.cliente.findUnique({
          where: {
              correo: email
          }
      });

      // Check if the user exists
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Check if the provided password matches the stored password
      if (user.contrasena !== password) {
          return res.status(401).json({ error: 'Incorrect password' });
      }

      // If user exists and password matches, authentication successful
      res.json({ message: 'Login successful' });

  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
