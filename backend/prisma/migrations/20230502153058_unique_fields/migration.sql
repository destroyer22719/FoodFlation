/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Companies` will be added. If there are existing duplicate values, this will fail.
*/
-- CreateIndex
CREATE UNIQUE INDEX `Companies_name_key` ON `Companies`(`name`);

