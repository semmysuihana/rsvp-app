-- CreateEnum
CREATE TYPE "RSVPStatus" AS ENUM ('WAITING', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "rsvpStatus" "RSVPStatus" NOT NULL DEFAULT 'WAITING',
    "notes" TEXT,
    "substituteName" TEXT,
    "pax" INTEGER NOT NULL DEFAULT 1,
    "sendCount" INTEGER NOT NULL DEFAULT 0,
    "maxSend" INTEGER NOT NULL DEFAULT 3,
    "lastSendAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
