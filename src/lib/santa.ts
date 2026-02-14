// Utility functions for Secret Santa logic and URL state management

export interface Participant {
  name: string
  id: string
}

export interface Assignment {
  giver: string
  receiver: string
  giverId: string
  receiverId: string
}

/**
 * Generate a unique ID for a participant
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Generate Secret Santa assignments
 * Each person gives to exactly one person and receives from exactly one person
 */
export function generateAssignments(
  participants: Participant[]
): Assignment[] {
  if (participants.length < 2) {
    throw new Error('Need at least 2 participants')
  }

  const givers = [...participants]
  const receivers = shuffleArray([...participants])

  // Ensure no one is assigned to themselves
  for (let i = 0; i < givers.length; i++) {
    if (givers[i].id === receivers[i].id) {
      // Swap with next person (wrap around if at end)
      const nextIdx = (i + 1) % receivers.length
      ;[receivers[i], receivers[nextIdx]] = [receivers[nextIdx], receivers[i]]
    }
  }

  return givers.map((giver, idx) => ({
    giver: giver.name,
    receiver: receivers[idx].name,
    giverId: giver.id,
    receiverId: receivers[idx].id,
  }))
}

/**
 * Encode participants to URL-safe string
 */
export function encodeParticipants(participants: Participant[]): string {
  const data = JSON.stringify(participants)
  return btoa(encodeURIComponent(data))
}

/**
 * Decode participants from URL-safe string
 */
export function decodeParticipants(encoded: string): Participant[] {
  try {
    const data = decodeURIComponent(atob(encoded))
    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * Encode assignments to URL-safe string
 */
export function encodeAssignments(assignments: Assignment[]): string {
  const data = JSON.stringify(assignments)
  return btoa(encodeURIComponent(data))
}

/**
 * Decode assignments from URL-safe string
 */
export function decodeAssignments(encoded: string): Assignment[] {
  try {
    const data = decodeURIComponent(atob(encoded))
    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * Create a reveal token for a specific participant
 */
export function createRevealToken(
  assignment: Assignment,
  allAssignments: Assignment[]
): string {
  const data = {
    giver: assignment.giver,
    receiver: assignment.receiver,
    giverId: assignment.giverId,
    // Include a hash of all assignments to prevent tampering
    hash: btoa(JSON.stringify(allAssignments)),
  }
  return btoa(encodeURIComponent(JSON.stringify(data)))
}

/**
 * Decode a reveal token
 */
export function decodeRevealToken(token: string): {
  giver: string
  receiver: string
  giverId: string
} | null {
  try {
    const data = decodeURIComponent(atob(token))
    return JSON.parse(data)
  } catch {
    return null
  }
}
