/*
  Warnings:

  - The primary key for the `devices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `devices` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `keyword_device` DROP FOREIGN KEY `keyword_device_device_id_fkey`;

-- DropIndex
DROP INDEX `devices_device_id_key` ON `devices`;

-- AlterTable
ALTER TABLE `devices` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`device_id`);

-- AlterTable
ALTER TABLE `keyword_device` MODIFY `device_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `keyword_device` ADD CONSTRAINT `keyword_device_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`device_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
