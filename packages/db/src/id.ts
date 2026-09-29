import { randomInt } from "node:crypto";

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Creates a secure alphanumeric ID in the same format as Better Auth.
export function generateId(size = 24) {
  if (!Number.isInteger(size) || size <= 0) throw new Error("ID size must be a positive integer.");
  return Array.from({ length: size }, () => alphabet[randomInt(alphabet.length)]).join("");
}
