import { randomUUID } from "crypto";

const CHAR_SET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

export function encodeBase62(num) {
  if (num === 0) return CHAR_SET[0];
  let result = "";
  const base = CHAR_SET.length;
  while (num > 0) {
    result = CHAR_SET[num % base] + result;
    num = Math.floor(num / base);
  }
  return result.length > 7 ? result.slice(0, 7) : result;
}

export function generateUUID() {
  return randomUUID();
}
