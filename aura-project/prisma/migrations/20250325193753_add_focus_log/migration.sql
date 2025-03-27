-- CreateTable
CREATE TABLE "FocusLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keyboard" INTEGER NOT NULL,
    "mouseClicks" INTEGER NOT NULL,
    "mouseDistance" INTEGER NOT NULL,
    "focusScore" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FocusLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FocusLog" ADD CONSTRAINT "FocusLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
