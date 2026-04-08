// PostgreSQL integer max is 2,147,483,647.
const ANON_VOTER_BASE_ID = 1_500_000_000;
const ANON_VOTER_RANGE = 500_000_000;

/**
 * Converts a stable anon fingerprint into a deterministic unsigned integer id.
 * Uses a high numeric range to avoid collisions with regular user ids.
 */
export function getAnonVoterIdFromFingerprint(fingerprint: string): number {
  const head = fingerprint.slice(0, 8);
  const parsed = Number.parseInt(head, 16);
  const hash = Number.isFinite(parsed) ? parsed : 0;
  return ANON_VOTER_BASE_ID + (hash % ANON_VOTER_RANGE);
}
