/**
 * Dynamic graduation-year helpers.
 *
 * Frontend requirement: graduation years must support future dates (at least
 * through 2035) for students' *expected* graduation, and must not treat a
 * future year as an error. Ranges are generated from the current calendar year
 * so the UI keeps working without edits in future years.
 */

const BASE_YEAR = 1990;

/** Number of years past the current year to offer for expected graduation. */
const FUTURE_HORIZON = 9;

export function currentYear(): number {
  return new Date().getFullYear();
}

/** Upper bound of the graduation-year picker — always at least 2035. */
export function graduationMaxYear(): number {
  return Math.max(currentYear() + FUTURE_HORIZON, 2035);
}

/** Full range of graduation years (oldest → newest): BASE_YEAR..max. */
export function graduationYearRange(): number[] {
  const years: number[] = [];
  for (let y = BASE_YEAR; y <= graduationMaxYear(); y++) years.push(y);
  return years;
}

/** Future-facing years for a student's expected graduation: current..max. */
export function expectedGraduationYears(): number[] {
  const years: number[] = [];
  for (let y = currentYear(); y <= graduationMaxYear(); y++) years.push(y);
  return years;
}

/** Years an alumni could actually have graduated: BASE_YEAR..current. */
export function alumniGraduationYears(): number[] {
  const years: number[] = [];
  for (let y = BASE_YEAR; y <= currentYear(); y++) years.push(y);
  return years;
}

/** Convenience: full range as strings for <select>/<Select> options. */
export function graduationYearOptions(): string[] {
  return graduationYearRange().map(String);
}

/** Covers the whole picker (BASE_YEAR .. graduationMaxYear()). */
export const GRADUATION_YEARS: number[] = graduationYearRange();