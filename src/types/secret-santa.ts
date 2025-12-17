export interface Participant {
  id: string
  name: string
  email?: string
  exclusions?: Array<string>
}

export interface SecretSantaMatch {
  giver: Participant
  receiver: Participant
}

export interface SecretSantaState {
  participants: Array<Participant>
  matches: Array<SecretSantaMatch>
  isRevealed: boolean
  currentView: 'setup' | 'matches' | 'reveal'
}

export interface SecretSantaUrlState {
  p?: string // encoded participants
  m?: string // encoded matches
  r?: string // reveal state
  v?: string // current view
}
