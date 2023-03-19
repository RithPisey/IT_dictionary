/*
  Warnings:

  - Added the required column `start_letter` to the `Keyword` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Keyword" ADD COLUMN     "start_letter" CHAR NOT NULL;
