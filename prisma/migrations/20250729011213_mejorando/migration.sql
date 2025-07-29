/*
  Warnings:

  - The `regimen` column on the `ConfiguracionEmpresa` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `tipo_persona` on the `ConfiguracionEmpresa` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `total_con_imp` to the `OrdenCompra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_sin_imp` to the `OrdenCompra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConfiguracionEmpresa" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "tipo_persona",
ADD COLUMN     "tipo_persona" "TipoPersona" NOT NULL,
DROP COLUMN "regimen",
ADD COLUMN     "regimen" "Regimen",
ALTER COLUMN "fecha_creacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "DevolucionesProveedor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "IngresoCompra" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "OrdenCompra" ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "total_con_imp" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "total_sin_imp" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Proveedor" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
