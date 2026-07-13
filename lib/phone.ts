/** Strict US phone display: (xxx)xxx-xxxx */
export const PHONE_PATTERN = /^\(\d{3}\)\d{3}-\d{4}$/;

/** Digits only, max 10 (US local number) */
export function digitsOnly(value: string, max = 10): string {
  return value.replace(/\D/g, "").slice(0, max);
}

/**
 * Format as (xxx)xxx-xxxx while typing.
 * Accepts partial input so the field can grow character by character.
 */
export function formatPhoneInput(value: string): string {
  const d = digitsOnly(value, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)})${d.slice(3)}`;
  return `(${d.slice(0, 3)})${d.slice(3, 6)}-${d.slice(6)}`;
}

export function isCompletePhone(value: string): boolean {
  return PHONE_PATTERN.test(value);
}
