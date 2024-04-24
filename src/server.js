// Archivo: src/server.js

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';

import usersRoute from './routes/usersRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use("/api", usersRoute);

// Serve static files from the 'html' directory
app.use(express.static(path.join(__dirname, 'html')));

app.use(express.static(path.join(__dirname, 'uploads')));

app.post('/api/uploadImage/:ID_cliente', upload.single('userImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  const { ID_cliente } = req.params;
  const imagePath = req.file.path;

  res.json({ imagePath });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
