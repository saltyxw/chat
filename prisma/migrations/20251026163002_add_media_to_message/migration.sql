-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "image" TEXT,
ADD COLUMN     "video" TEXT,
ALTER COLUMN "text" DROP NOT NULL;
