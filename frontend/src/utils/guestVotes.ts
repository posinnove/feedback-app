const GUEST_VOTES_KEY = 'guest-votes-v1'

type VoteDirection = 'up' | 'down'
type GuestVoteStore = Record<string, VoteDirection>

function readGuestVotes(): GuestVoteStore {
  if (typeof window === 'undefined') return {}

  try {
    const raw = localStorage.getItem(GUEST_VOTES_KEY)
    if (!raw) return {}

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    return Object.entries(parsed).reduce<GuestVoteStore>((acc, [key, value]) => {
      if (value === 'up' || value === 'down') {
        acc[key] = value
      }
      return acc
    }, {})
  } catch {
    return {}
  }
}

function writeGuestVotes(store: GuestVoteStore): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(GUEST_VOTES_KEY, JSON.stringify(store))
  } catch {
    // Ignore write failures (e.g., private mode quotas).
  }
}

export function getGuestVote(itemKey: string): VoteDirection | null {
  const votes = readGuestVotes()
  return votes[itemKey] ?? null
}

export function recordGuestVote(itemKey: string, direction: VoteDirection): void {
  const votes = readGuestVotes()
  votes[itemKey] = direction
  writeGuestVotes(votes)
}

export function removeGuestVote(itemKey: string): void {
  const votes = readGuestVotes()
  delete votes[itemKey]
  writeGuestVotes(votes)
}
