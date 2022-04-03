/**
 * Checks wheter a provided string date is a valid Date
 * @param date
 * @returns True if the string is a valid date. False otherwise.
 */
export function dateIsValid(date: string): Boolean {
  const parsed = new Date(date);
  return !(Number.isNaN(parsed.getTime()));
}

/**
 * Parses a str date to a ISO date only str.
 * @param date
 * @returns A string with the date only in ISO format.
 */
export function formatDateOnly(date: string): string {
  const parsed = (new Date(date)).toISOString().split('T');

  return parsed[0];
}

/**
 * Get current date.
 * @returns A date string with ISO format.
 */
export function getCurrentDateStr(): string {
  return (new Date().toISOString());
}
