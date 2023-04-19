/*
  Warnings:

  - A unique constraint covering the columns `[device_id]` on the table `devices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `devices_device_id_key` ON `devices`(`device_id`);
