-- AlterTable
ALTER TABLE "Pagos" ADD COLUMN     "id_detalle_carrito" INTEGER;

-- CreateTable
CREATE TABLE "DetalleCarrito" (
    "id_detalle_carrito" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "id_cliente" INTEGER,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleCarrito_pkey" PRIMARY KEY ("id_detalle_carrito")
);

-- CreateTable
CREATE TABLE "HistorialCompra" (
    "id_historial_compra" SERIAL NOT NULL,
    "id_cliente" INTEGER,
    "fecha_compra" TIMESTAMP(3) NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "items" TEXT NOT NULL,

    CONSTRAINT "HistorialCompra_pkey" PRIMARY KEY ("id_historial_compra")
);
