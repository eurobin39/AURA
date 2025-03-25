-- AlterTable
ALTER TABLE "FocusInsight" ADD COLUMN     "workSessionId" INTEGER;

-- AddForeignKey
ALTER TABLE "FocusInsight" ADD CONSTRAINT "FocusInsight_workSessionId_fkey" FOREIGN KEY ("workSessionId") REFERENCES "WorkSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
