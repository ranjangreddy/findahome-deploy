/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `property` table. All the data in the column will be lost.
  - Added the required column `amenities` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableFrom` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bathrooms` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrooms` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactEmail` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactName` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhone` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrls` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceUnit` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentalType` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `property` DROP COLUMN `imageUrl`,
    ADD COLUMN `amenities` VARCHAR(191) NOT NULL,
    ADD COLUMN `availableFrom` DATETIME(3) NOT NULL,
    ADD COLUMN `availableTo` DATETIME(3) NULL,
    ADD COLUMN `bathrooms` INTEGER NOT NULL,
    ADD COLUMN `bedrooms` INTEGER NOT NULL,
    ADD COLUMN `contactEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `contactName` VARCHAR(191) NOT NULL,
    ADD COLUMN `contactPhone` VARCHAR(191) NOT NULL,
    ADD COLUMN `hasLivingRoom` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `imageUrls` VARCHAR(191) NOT NULL,
    ADD COLUMN `priceUnit` VARCHAR(191) NOT NULL,
    ADD COLUMN `rentalType` VARCHAR(191) NOT NULL,
    ADD COLUMN `showEmail` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `showPhone` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
