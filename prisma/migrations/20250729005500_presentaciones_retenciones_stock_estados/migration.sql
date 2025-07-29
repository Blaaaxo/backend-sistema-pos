/*
  Warnings:

  - You are about to drop the `TransferenciaBodega` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransferenciaDetalle` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `IngresoCompra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Kardex` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tipo_movimiento` on the `Kardex` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoPersona" AS ENUM ('natural', 'juridica');

-- CreateEnum
CREATE TYPE "Regimen" AS ENUM ('comun', 'simplificado');

-- CreateEnum
CREATE TYPE "TipoImpuesto" AS ENUM ('iva', 'consumo', 'saludable');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('entrada', 'salida', 'ajuste');

-- DropForeignKey
ALTER TABLE "TransferenciaBodega" DROP CONSTRAINT "TransferenciaBodega_bodega_destino_id_fkey";

-- DropForeignKey
ALTER TABLE "TransferenciaBodega" DROP CONSTRAINT "TransferenciaBodega_bodega_origen_id_fkey";

-- DropForeignKey
ALTER TABLE "TransferenciaBodega" DROP CONSTRAINT "TransferenciaBodega_user_id_fkey";

-- DropForeignKey
ALTER TABLE "TransferenciaDetalle" DROP CONSTRAINT "TransferenciaDetalle_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "TransferenciaDetalle" DROP CONSTRAINT "TransferenciaDetalle_transferencia_id_fkey";

-- AlterTable
ALTER TABLE "IngresoCompra" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "retefuente" DECIMAL(12,2),
ADD COLUMN     "reteica" DECIMAL(12,2),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Kardex" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "tipo_movimiento",
ADD COLUMN     "tipo_movimiento" "TipoMovimiento" NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Proveedor" ADD COLUMN     "aplica_retefuente" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aplica_reteica" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "porcentaje_retefuente" DECIMAL(5,2),
ADD COLUMN     "porcentaje_reteica" DECIMAL(5,2),
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "TransferenciaBodega";

-- DropTable
DROP TABLE "TransferenciaDetalle";

-- CreateTable
CREATE TABLE "ConfiguracionEmpresa" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "tipo_persona" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "correo" TEXT,
    "representante" TEXT,
    "regimen" TEXT,
    "resolucion_dian" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracionEmpresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresentacionProducto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "equivalencia" INTEGER NOT NULL,
    "unidad_base" TEXT NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresentacionProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrasladosBodega" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "bodega_origen_id" INTEGER NOT NULL,
    "bodega_destino_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "observaciones" TEXT,
    "productoId" INTEGER,

    CONSTRAINT "TrasladosBodega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrasladosaDetalle" (
    "id" SERIAL NOT NULL,
    "transferencia_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "TrasladosaDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barrios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ciudad_id" INTEGER NOT NULL,

    CONSTRAINT "Barrios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionEmpresa_nit_key" ON "ConfiguracionEmpresa"("nit");

-- AddForeignKey
ALTER TABLE "PresentacionProducto" ADD CONSTRAINT "PresentacionProducto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrasladosBodega" ADD CONSTRAINT "TrasladosBodega_bodega_origen_id_fkey" FOREIGN KEY ("bodega_origen_id") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrasladosBodega" ADD CONSTRAINT "TrasladosBodega_bodega_destino_id_fkey" FOREIGN KEY ("bodega_destino_id") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrasladosBodega" ADD CONSTRAINT "TrasladosBodega_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrasladosBodega" ADD CONSTRAINT "TrasladosBodega_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrasladosaDetalle" ADD CONSTRAINT "TrasladosaDetalle_transferencia_id_fkey" FOREIGN KEY ("transferencia_id") REFERENCES "TrasladosBodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrasladosaDetalle" ADD CONSTRAINT "TrasladosaDetalle_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barrios" ADD CONSTRAINT "Barrios_ciudad_id_fkey" FOREIGN KEY ("ciudad_id") REFERENCES "Ciudades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
