-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "lastUsageReset" TIMESTAMP(3),
    "plan" TEXT NOT NULL DEFAULT 'free',
    "monthlyUsage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."processed_images" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cloudinaryUrl" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT,
    "styleUsed" TEXT,
    "sizeUsed" TEXT,
    "status" TEXT NOT NULL DEFAULT 'saved',
    "expiresAt" TIMESTAMP(3),
    "savedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "processed_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."processed_images" ADD CONSTRAINT "processed_images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
