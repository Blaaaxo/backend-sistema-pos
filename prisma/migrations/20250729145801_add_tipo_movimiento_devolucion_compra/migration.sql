/*
  Warnings:

  - The values [comun,simplificado] on the enum `Regimen` will be removed. If these variants are still used in the database, this will fail.
  - The values [iva,consumo,saludable] on the enum `TipoImpuesto` will be removed. If these variants are still used in the database, this will fail.
  - The values [entrada,salida,ajuste] on the enum `TipoMovimiento` will be removed. If these variants are still used in the database, this will fail.
  - The values [natural,juridica] on the enum `TipoPersona` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Regimen_new" AS ENUM ('COMUN', 'SIMPLIFICADO');
ALTER TABLE "ConfiguracionEmpresa" ALTER COLUMN "regimen" TYPE "Regimen_new" USING ("regimen"::text::"Regimen_new");
ALTER TYPE "Regimen" RENAME TO "Regimen_old";
ALTER TYPE "Regimen_new" RENAME TO "Regimen";
DROP TYPE "Regimen_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TipoImpuesto_new" AS ENUM ('IVA', 'CONSUMO', 'SALUDABLE');
ALTER TYPE "TipoImpuesto" RENAME TO "TipoImpuesto_old";
ALTER TYPE "TipoImpuesto_new" RENAME TO "TipoImpuesto";
DROP TYPE "TipoImpuesto_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TipoMovimiento_new" AS ENUM ('ENTRADA', 'SALIDA', 'DEVOLUCION_COMPRA', 'DEVOLUCION_VENTA', 'AJUSTE', 'TRASLADO');
ALTER TABLE "Kardex" ALTER COLUMN "tipo_movimiento" TYPE "TipoMovimiento_new" USING ("tipo_movimiento"::text::"TipoMovimiento_new");
ALTER TYPE "TipoMovimiento" RENAME TO "TipoMovimiento_old";
ALTER TYPE "TipoMovimiento_new" RENAME TO "TipoMovimiento";
DROP TYPE "TipoMovimiento_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TipoPersona_new" AS ENUM ('NATURAL', 'JURIDICA');
ALTER TABLE "ConfiguracionEmpresa" ALTER COLUMN "tipo_persona" TYPE "TipoPersona_new" USING ("tipo_persona"::text::"TipoPersona_new");
ALTER TYPE "TipoPersona" RENAME TO "TipoPersona_old";
ALTER TYPE "TipoPersona_new" RENAME TO "TipoPersona";
DROP TYPE "TipoPersona_old";
COMMIT;
