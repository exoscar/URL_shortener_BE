import { randomUUID } from "crypto";

const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function encodeBase62(num) {
  if (num === 0) return BASE62[0];
  let result = "";
  const base = BASE62.length;
  while (num > 0) {
    result = BASE62[num % base] + result;
    num = Math.floor(num / base);
  }
  return result;
}

export function generateUUID() {
  return randomUUID();
}
