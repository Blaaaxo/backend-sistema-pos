/*
  Warnings:

  - You are about to drop the column `ciudad` on the `Bodega` table. All the data in the column will be lost.
  - Added the required column `ciudad_id` to the `Bodega` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bodega" DROP COLUMN "ciudad",
ADD COLUMN     "ciudad_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Bodega" ADD CONSTRAINT "Bodega_ciudad_id_fkey" FOREIGN KEY ("ciudad_id") REFERENCES "Ciudades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
