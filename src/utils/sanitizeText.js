export function sanitizeText(value) {
  const raw = value ?? '';
  let result = '';

  for (const char of raw) {
    const code = char.codePointAt(0);
    if (code > 31 && code !== 127) result += char;
  }

  return result.trim();
}
