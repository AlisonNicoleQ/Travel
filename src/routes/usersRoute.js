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

// Add Preferences to User
router.put('/updatePreferences', async (req, res) => {
  const { ID_cliente, Preferencias, idioma } = req.body;

  try {
    const updatedCliente = await prisma.cliente.update({
      where: {
        ID_cliente
      },
      data: {
        Preferencias,
        idioma: {
          connect: { ID_idioma: idioma } //creamos la conexion de la llave foranea con el int del idioma que recibimos
        }
      }
    });

    res.json(updatedCliente);
    console.log('Cliente actualizado:', updatedCliente);
  } catch (error) {
    console.error(`Error al actualizar las preferencias del cliente: ${ID_cliente}: ${error}`);
    res.status(500).json({ error: 'Hubo un error al actualizar las preferencias del cliente' });
  }
});

/*
====================================================================
Agregar Carrito
====================================================================
*/

// Agregar al carrito
router.post('/addCarrito', async (req, res) => {
  const { id_cliente, item, precio,  subtotal, cantidad} = req.body;

  try {
    const insertDetalleCarrito = await prisma.detalleCarrito.create({
      data: {
        id_cliente,
        item,
        precio,
        subtotal,
        cantidad
      }
    });

    res.json(insertDetalleCarrito);
    console.log('Se agrego al carrito:', insertDetalleCarrito);
  } catch (error) {
    console.error(`Error al isnertar al carrito: ${id_cliente}: ${error}`);
    res.status(500).json({ error: 'Hubo un error insertando al carrito' });
  }
});

//select carrito where id == cliente id
router.put('/getCarrito', async (req, res) => {
  const { id_cliente } = req.body;

  try {
    const getClienteCarrito = await prisma.detalleCarrito.findMany({
      where: {
        id_cliente 
      },
      select: {
        item: true,
        precio: true,
        cantidad: true,
        subtotal: true,
        id_detalle_carrito: true
      }
    });

    res.json(getClienteCarrito);
    console.log('Carrito de cliente:', getClienteCarrito);
  } catch (error) {
    console.error(`Error al conseguir el carrito: ${id_cliente}: ${error}`);
    res.status(500).json({ error: 'Error al conseguir el carrito' });
  }
});

//borrar item del carrito
router.delete('/deleteCarrito', async (req, res) => {
  const { id_detalle_carrito } = req.body;

  try {
    const deleteDetalleCarrito = await prisma.detalleCarrito.delete({
      where: {
        id_detalle_carrito
      }
    });

    res.json(deleteDetalleCarrito);
    console.log('Se borro del carrito:', deleteDetalleCarrito);
  } catch (error) {
    console.error(`Error al borrar del carrito: ${id_detalle_carrito}: ${error}`);
    res.status(500).json({ error: 'Hubo un error borrando del carrito' });
  }
});

//limpiar carrito
router.delete('/clearCarrito', async (req, res) => {
  const { id_detalle_carrito } = req.body;

  try {
    const deleteDetalleCarrito = await prisma.detalleCarrito.delete();

    res.json(deleteDetalleCarrito);
    console.log('Se borro del carrito:', deleteDetalleCarrito);
  } catch (error) {
    console.error(`Error al borrar del carrito: ${id_detalle_carrito}: ${error}`);
    res.status(500).json({ error: 'Hubo un error borrando del carrito' });
  }
});


/*
====================================================================
Historial Compra
====================================================================
*/

router.post('/addHistorial', async (req, res) => {
  const { id_cliente, items, precio,  subtotal, cantidad, fecha_compra} = req.body;

  try {
    const insertDetalleCarrito = await prisma.historialCompra.create({
      data: {
        id_cliente,
        items,
        precio,
        subtotal,
        cantidad,
        fecha_compra
      }
    });

    res.json(insertDetalleCarrito);
    console.log('Se agrego al historial:', insertDetalleCarrito);
  } catch (error) {
    console.error(`Error al isnertar al historial: ${id_cliente}: ${error}`);
    res.status(500).json({ error: 'Hubo un error insertando al historial' });
  }
});

/*
====================================================================
Pago
====================================================================
*/

router.post('/addPago', async (req, res) => {
  const { ID_cliente, ID_tipo_m, id_detalle_carrito,  nombre_titular, numero_tarjeta, fecha_expiracion, cvv, direccion } = req.body;

  try {
    const insertPago = await prisma.pagos.create({
      data: {
        ID_cliente,
        ID_tipo_m,
        id_detalle_carrito,
        nombre_titular,
        numero_tarjeta,
        fecha_expiracion,
        cvv,
        direccion
      }
    });

    res.json(insertPago);
    console.log('Se ha efectuado el pago:', insertPago);
  } catch (error) {
    console.error(`Error al pagar: ${ID_cliente}: ${error}`);
    res.status(500).json({ error: 'Hubo un error al insertar pago' });
  }
});


export default router;
