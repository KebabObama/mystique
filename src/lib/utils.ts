import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const mod = (i: number, j = 10, k = 2) => {
  return Math.floor((i - j) / k);
};
