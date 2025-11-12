import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { getServerAuthSession } from "@/lib/auth/session";

const f = createUploadthing();

export const fileRouter = {
  cardImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerAuthSession();
      if (!session?.user?.id) throw new UploadThingError("UNAUTHORIZED");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { imageUrl: file.url, userId: metadata.userId };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
