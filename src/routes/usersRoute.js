// Archivo: src/routes/usersRoute.js

import express from 'express';
import { PrismaClient } from '@prisma/client'; // Importar Prisma Client

const router = express.Router();
const prisma = new PrismaClient(); // Crear una instancia de Prisma Client

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

    res.json({cliente: newCliente});
    console.log('Cliente creado:', newCliente);
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json({ error: 'Hubo un error al crear el cliente' });
  }
});

//ruta para el login, verifica que el email que se da existe, y ademas revisa que el pass sea igual.
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  console.log('Received email:', correo);
  try {
      // Query the database to find a user with the provided email
      const user = await prisma.cliente.findUnique({
          where: {
              correo: correo
          }
      });

      // Check if the user exists
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Check if the provided password matches the stored password
      if (user.contrasena !== contrasena) {
          return res.status(401).json({ error: 'Incorrect password' });
      }

      // If user exists and password matches, authentication successful
      res.json({ message: 'Login successful', cliente: user});
      console.log('User Login:', user);

  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

//Update Cliente
router.put('/updateCliente', async (req, res) => {
  const { ID_cliente, nombre, correo, contrasena, telefono, imagen } = req.body;

  try {
    const updatedCliente = await prisma.cliente.update({
      where: {
        ID_cliente
      },
      data: {
        nombre,
        correo,
        contrasena,
        telefono,
        imagen
      }
    });

    res.json(updatedCliente);
    console.log('Cliente actualizado:', updatedCliente);
  } catch (error) {
    console.error(`Error al actualizar el cliente: ${id} , ${nombre}, ${correo}, ${contrasena}, ${telefono}, ${imagen}`);
    res.status(500).json({ error: 'Hubo un error al actualizar el cliente' });
  }
});

//comentario

export default router;
