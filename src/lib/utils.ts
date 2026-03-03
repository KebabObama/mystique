import { createAuthClient } from "better-auth/react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const authClient = createAuthClient();
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const mod = (i: number, j = 10, k = 2) => Math.floor((i - j) / k);
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  targetSize = 400
): Promise<Blob> => {
  const image = new Image();
  image.src = imageSrc;
  image.crossOrigin = "anonymous";
  await new Promise((resolve) => (image.onload = resolve));
  const canvas = document.createElement("canvas");
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");
  ctx.imageSmoothingQuality = "high";
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetSize,
    targetSize
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        resolve(blob);
      },
      "image/webp",
      0.8
    );
  });
};

export const getUnreadCount = (
  lobby: {
    messages: Array<{ createdAt: Date }>;
    members: Array<{ id: string; lastReadAt: Date | null }>;
  },
  userId: string
): number => {
  const member = lobby.members.find((m) => m.id === userId);
  if (!member) return 0;

  if (!member.lastReadAt) {
    return lobby.messages.length;
  }

  const lastReadAt = new Date(member.lastReadAt);
  if (Number.isNaN(lastReadAt.getTime())) return lobby.messages.length;

  return lobby.messages.filter((msg) => {
    const createdAt = new Date(msg.createdAt);
    if (Number.isNaN(createdAt.getTime())) return false;
    return createdAt > lastReadAt;
  }).length;
};
