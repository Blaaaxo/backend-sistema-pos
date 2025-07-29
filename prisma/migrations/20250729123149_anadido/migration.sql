/*
  Warnings:

  - You are about to drop the `ExistenciaProductoBodega` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExistenciaProductoBodega" DROP CONSTRAINT "ExistenciaProductoBodega_bodega_id_fkey";

-- DropForeignKey
ALTER TABLE "ExistenciaProductoBodega" DROP CONSTRAINT "ExistenciaProductoBodega_producto_id_fkey";

-- DropTable
DROP TABLE "ExistenciaProductoBodega";

-- CreateTable
CREATE TABLE "ExistenciaProducto" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "stock_bueno" INTEGER NOT NULL DEFAULT 0,
    "stock_malo" INTEGER NOT NULL DEFAULT 0,
    "stock_transito" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExistenciaProducto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExistenciaProducto_producto_id_bodega_id_key" ON "ExistenciaProducto"("producto_id", "bodega_id");

-- AddForeignKey
ALTER TABLE "ExistenciaProducto" ADD CONSTRAINT "ExistenciaProducto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExistenciaProducto" ADD CONSTRAINT "ExistenciaProducto_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
