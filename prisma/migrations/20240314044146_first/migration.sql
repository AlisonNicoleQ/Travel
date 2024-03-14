-- CreateTable
CREATE TABLE "Admin" (
    "ID_admin" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "imagen" BYTEA,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("ID_admin")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "ID_cliente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "ID_instagram" TEXT,
    "ID_Facebook" TEXT,
    "imagen" BYTEA,
    "Preferencias" TEXT,
    "ID_idioma" INTEGER,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("ID_cliente")
);

-- CreateTable
CREATE TABLE "Destinos" (
    "ID_destino" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DOUBLE PRECISION,
    "ubicacion" TEXT,
    "categoria" TEXT,
    "actividades" TEXT,
    "cupos" INTEGER,
    "ID_admin" INTEGER,

    CONSTRAINT "Destinos_pkey" PRIMARY KEY ("ID_destino")
);

-- CreateTable
CREATE TABLE "Eventos" (
    "ID_evento" SERIAL NOT NULL,
    "ID_tipo_e" INTEGER,
    "ID_cliente" INTEGER,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3),
    "ID_admin" INTEGER,

    CONSTRAINT "Eventos_pkey" PRIMARY KEY ("ID_evento")
);

-- CreateTable
CREATE TABLE "Idiomas" (
    "ID_idioma" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "Idiomas_pkey" PRIMARY KEY ("ID_idioma")
);

-- CreateTable
CREATE TABLE "Itinerario" (
    "ID_itinerario" SERIAL NOT NULL,
    "ID_cliente" INTEGER,
    "ID_reserva" INTEGER,
    "nombre" TEXT,
    "descripcion" TEXT,

    CONSTRAINT "Itinerario_pkey" PRIMARY KEY ("ID_itinerario")
);

-- CreateTable
CREATE TABLE "Pagos" (
    "ID_pago" SERIAL NOT NULL,
    "ID_cliente" INTEGER,
    "ID_tipo_m" INTEGER,
    "nombre_titular" TEXT NOT NULL,
    "numero_tarjeta" TEXT NOT NULL,
    "fecha_expiracion" TIMESTAMP(3),
    "cvv" INTEGER,
    "direccion" TEXT,

    CONSTRAINT "Pagos_pkey" PRIMARY KEY ("ID_pago")
);

-- CreateTable
CREATE TABLE "RecuperacionContrasena" (
    "ID_request" SERIAL NOT NULL,
    "ID_cliente" INTEGER,
    "ID_admin" INTEGER,
    "Token" TEXT NOT NULL,
    "Fecha" TIMESTAMP(3),
    "Estado" TEXT,

    CONSTRAINT "RecuperacionContrasena_pkey" PRIMARY KEY ("ID_request")
);

-- CreateTable
CREATE TABLE "Review" (
    "ID_review" SERIAL NOT NULL,
    "ID_cliente" INTEGER,
    "ID_tipo_s" INTEGER,
    "ID_servicio" INTEGER,
    "ID_destino" INTEGER,
    "calificacion" INTEGER,
    "comentario" TEXT,
    "fecha" TIMESTAMP(3),
    "ID_admin" INTEGER,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("ID_review")
);

-- CreateTable
CREATE TABLE "Reservas" (
    "ID_reserva" SERIAL NOT NULL,
    "ID_cliente" INTEGER,
    "ID_itinerario" INTEGER,
    "ID_servicio" INTEGER,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "precio_total" DOUBLE PRECISION,
    "ID_admin" INTEGER,

    CONSTRAINT "Reservas_pkey" PRIMARY KEY ("ID_reserva")
);

-- CreateTable
CREATE TABLE "Servicios" (
    "ID_servicio" SERIAL NOT NULL,
    "ID_tipo_s" INTEGER,
    "nombre" TEXT NOT NULL,
    "destino" TEXT,
    "precio_diario" DOUBLE PRECISION,
    "detalles" TEXT,
    "ID_admin" INTEGER,

    CONSTRAINT "Servicios_pkey" PRIMARY KEY ("ID_servicio")
);

-- CreateTable
CREATE TABLE "Tipo_evento" (
    "ID_tipo_e" SERIAL NOT NULL,
    "ID_destino" INTEGER,
    "ID_servicio" INTEGER,
    "ID_reserva" INTEGER,

    CONSTRAINT "Tipo_evento_pkey" PRIMARY KEY ("ID_tipo_e")
);

-- CreateTable
CREATE TABLE "Tipo_moneda" (
    "ID_tipo_m" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "simbolo" TEXT,

    CONSTRAINT "Tipo_moneda_pkey" PRIMARY KEY ("ID_tipo_m")
);

-- CreateTable
CREATE TABLE "Tipo_servicio" (
    "ID_tipo_s" SERIAL NOT NULL,
    "Descripcion" TEXT,

    CONSTRAINT "Tipo_servicio_pkey" PRIMARY KEY ("ID_tipo_s")
);

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_ID_idioma_fkey" FOREIGN KEY ("ID_idioma") REFERENCES "Idiomas"("ID_idioma") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destinos" ADD CONSTRAINT "Destinos_ID_admin_fkey" FOREIGN KEY ("ID_admin") REFERENCES "Admin"("ID_admin") ON DELETE SET NULL ON UPDATE CASCADE;
