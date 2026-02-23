// Generates a cryptographically secure 8-character Base36 code
// Alphabet: 0-9 + A-Z

export function generateBase36Code(length = 8): string {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphabetLength = alphabet.length;

  if (length <= 0) {
    throw new Error("Length must be greater than 0");
  }

  const result: string[] = [];
  for (const byte of crypto.getRandomValues(new Uint8Array(length))) {
    const token = alphabet.at(byte % alphabetLength)!;
    result.push(token);
  }

  return result.join("");
}
