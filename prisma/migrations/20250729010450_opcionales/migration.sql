/*
  Warnings:

  - Made the column `updatedAt` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Proveedor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Proveedor" ALTER COLUMN "updatedAt" SET NOT NULL;
