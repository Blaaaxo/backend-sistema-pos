/*
  Warnings:

  - You are about to drop the column `user_id` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_user_id_fkey";

-- DropIndex
DROP INDEX "Profile_user_id_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "user_id",
ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "Descripcion" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "precio_base" DECIMAL(12,2) NOT NULL,
    "costo_promedio" DECIMAL(12,2),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "unidad_medida" TEXT NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "iva_id" INTEGER,
    "consumo_id" INTEGER,
    "saludable_id" INTEGER,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bodega" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "ciudad" TEXT,

    CONSTRAINT "Bodega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExistenciaProductoBodega" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "ExistenciaProductoBodega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoPrecioHistorial" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "precio_base" DECIMAL(12,2) NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),

    CONSTRAINT "ProductoPrecioHistorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "correo" TEXT,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenCompra" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL,
    "observaciones" TEXT,
    "proveedor_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "OrdenCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenCompraDetalle" (
    "id" SERIAL NOT NULL,
    "orden_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "iva_porcentaje" DECIMAL(5,2),
    "consumo_porcentaje" DECIMAL(5,2),
    "saludable_porcentaje" DECIMAL(5,2),

    CONSTRAINT "OrdenCompraDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngresoCompra" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observaciones" TEXT,
    "user_id" INTEGER NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "orden_compra_id" INTEGER,
    "total_con_imp" DECIMAL(12,2) NOT NULL,
    "total_sin_imp" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "IngresoCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngresoCompraDetalle" (
    "id" SERIAL NOT NULL,
    "ingresoCompra_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "iva_porcentaje" DECIMAL(5,2),
    "iva_valor" DECIMAL(12,2),
    "consumo_porcentaje" DECIMAL(5,2),
    "consumo_valor" DECIMAL(12,2),
    "saludable_porcentaje" DECIMAL(5,2),
    "saludable_valor" DECIMAL(12,2),
    "otros_costos" DECIMAL(12,2),
    "costo_total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "IngresoCompraDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevolucionesProveedor" (
    "id" SERIAL NOT NULL,
    "motivo_salida" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "observaciones" TEXT,
    "total_con_imp" DECIMAL(12,2) NOT NULL,
    "total_sin_imp" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "DevolucionesProveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevolucionesProveedorDetalle" (
    "id" SERIAL NOT NULL,
    "devolucion_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "costo_unitario" DECIMAL(12,2) NOT NULL,
    "iva_porcentaje" DECIMAL(5,2),
    "iva_valor" DECIMAL(12,2),
    "consumo_porcentaje" DECIMAL(5,2),
    "consumo_valor" DECIMAL(12,2),
    "saludable_porcentaje" DECIMAL(5,2),
    "saludable_valor" DECIMAL(12,2),

    CONSTRAINT "DevolucionesProveedorDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferenciaBodega" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "bodega_origen_id" INTEGER NOT NULL,
    "bodega_destino_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "TransferenciaBodega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferenciaDetalle" (
    "id" SERIAL NOT NULL,
    "transferencia_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "TransferenciaDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kardex" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "bodega_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipo_movimiento" TEXT NOT NULL,
    "documento_origen" TEXT NOT NULL,
    "documento_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "costo_unitario" DECIMAL(12,2) NOT NULL,
    "stock_resultante" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "Kardex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamentos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo_dane" TEXT NOT NULL,

    CONSTRAINT "Departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ciudades" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo_dane" TEXT NOT NULL,
    "departamento_id" INTEGER NOT NULL,

    CONSTRAINT "Ciudades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Impuestos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcentaje" DECIMAL(5,2) NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "Impuestos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ExistenciaProductoBodega_producto_id_bodega_id_key" ON "ExistenciaProductoBodega"("producto_id", "bodega_id");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_nit_key" ON "Proveedor"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "Departamentos_nombre_key" ON "Departamentos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Departamentos_codigo_dane_key" ON "Departamentos"("codigo_dane");

-- CreateIndex
CREATE UNIQUE INDEX "Ciudades_codigo_dane_key" ON "Ciudades"("codigo_dane");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_iva_id_fkey" FOREIGN KEY ("iva_id") REFERENCES "Impuestos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_consumo_id_fkey" FOREIGN KEY ("consumo_id") REFERENCES "Impuestos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_saludable_id_fkey" FOREIGN KEY ("saludable_id") REFERENCES "Impuestos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExistenciaProductoBodega" ADD CONSTRAINT "ExistenciaProductoBodega_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExistenciaProductoBodega" ADD CONSTRAINT "ExistenciaProductoBodega_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoPrecioHistorial" ADD CONSTRAINT "ProductoPrecioHistorial_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompraDetalle" ADD CONSTRAINT "OrdenCompraDetalle_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "OrdenCompra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompraDetalle" ADD CONSTRAINT "OrdenCompraDetalle_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngresoCompra" ADD CONSTRAINT "IngresoCompra_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngresoCompra" ADD CONSTRAINT "IngresoCompra_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngresoCompra" ADD CONSTRAINT "IngresoCompra_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngresoCompra" ADD CONSTRAINT "IngresoCompra_orden_compra_id_fkey" FOREIGN KEY ("orden_compra_id") REFERENCES "OrdenCompra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngresoCompraDetalle" ADD CONSTRAINT "IngresoCompraDetalle_ingresoCompra_id_fkey" FOREIGN KEY ("ingresoCompra_id") REFERENCES "IngresoCompra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngresoCompraDetalle" ADD CONSTRAINT "IngresoCompraDetalle_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevolucionesProveedor" ADD CONSTRAINT "DevolucionesProveedor_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevolucionesProveedor" ADD CONSTRAINT "DevolucionesProveedor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevolucionesProveedorDetalle" ADD CONSTRAINT "DevolucionesProveedorDetalle_devolucion_id_fkey" FOREIGN KEY ("devolucion_id") REFERENCES "DevolucionesProveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevolucionesProveedorDetalle" ADD CONSTRAINT "DevolucionesProveedorDetalle_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferenciaBodega" ADD CONSTRAINT "TransferenciaBodega_bodega_origen_id_fkey" FOREIGN KEY ("bodega_origen_id") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferenciaBodega" ADD CONSTRAINT "TransferenciaBodega_bodega_destino_id_fkey" FOREIGN KEY ("bodega_destino_id") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferenciaBodega" ADD CONSTRAINT "TransferenciaBodega_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferenciaDetalle" ADD CONSTRAINT "TransferenciaDetalle_transferencia_id_fkey" FOREIGN KEY ("transferencia_id") REFERENCES "TransferenciaBodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferenciaDetalle" ADD CONSTRAINT "TransferenciaDetalle_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kardex" ADD CONSTRAINT "Kardex_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kardex" ADD CONSTRAINT "Kardex_bodega_id_fkey" FOREIGN KEY ("bodega_id") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kardex" ADD CONSTRAINT "Kardex_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ciudades" ADD CONSTRAINT "Ciudades_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "Departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
