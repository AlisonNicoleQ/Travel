// Archivo: src/database.js

//Trabaja sobre el cliente de Prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default prisma;
