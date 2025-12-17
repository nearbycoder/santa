import type { Participant, SecretSantaMatch } from '../types/secret-santa'

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function encodeParticipants(participants: Array<Participant>): string {
  return btoa(JSON.stringify(participants))
}

export function decodeParticipants(encoded: string): Array<Participant> {
  try {
    return JSON.parse(atob(encoded))
  } catch {
    return []
  }
}

export function encodeMatches(matches: Array<SecretSantaMatch>): string {
  return btoa(JSON.stringify(matches))
}

export function decodeMatches(encoded: string): Array<SecretSantaMatch> {
  try {
    return JSON.parse(atob(encoded))
  } catch {
    return []
  }
}

export function generateSecretSantaMatches(
  participants: Array<Participant>,
): Array<SecretSantaMatch> {
  if (participants.length < 2) {
    throw new Error('Need at least 2 participants for Secret Santa')
  }

  const shuffled = [...participants].sort(() => Math.random() - 0.5)
  const matches: Array<SecretSantaMatch> = []

  for (let i = 0; i < shuffled.length; i++) {
    const giver = shuffled[i]
    const receiver = shuffled[(i + 1) % shuffled.length]

    // Check for exclusions
    if (giver.exclusions?.includes(receiver.id)) {
      // If exclusion found, restart the process
      return generateSecretSantaMatches(participants)
    }

    matches.push({ giver, receiver })
  }

  return matches
}

export function validateParticipant(name: string): string | null {
  if (!name.trim()) {
    return 'Name is required'
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters'
  }
  return null
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return null
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}
