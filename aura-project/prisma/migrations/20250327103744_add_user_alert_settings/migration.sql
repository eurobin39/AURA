-- AlterTable
ALTER TABLE "User" ADD COLUMN     "feedbackInterval" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "lowFocusAlert" BOOLEAN NOT NULL DEFAULT true;
