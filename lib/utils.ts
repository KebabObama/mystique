import { createAuthClient } from "better-auth/react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const authClient = createAuthClient();
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const mod = (i: number, j = 10, k = 2) => Math.floor((i - j) / k);
// prettier-ignore
export const getCroppedImg = async (imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }): Promise<Blob> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");
  ctx.drawImage(
    image,
    pixelCrop.x,     pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0              , 0,
    pixelCrop.width, pixelCrop.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas is empty"));
      resolve(blob);
    }, "image/png");
  });
};

