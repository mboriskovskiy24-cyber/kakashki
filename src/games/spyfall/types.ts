export type SpyfallCategoryId = 'places' | 'transport' | 'jobs' | 'fantasy' | 'movies'
export type SpyfallWinner = 'spies' | 'civilians'
export type SpyfallStatus =
  | 'settings'
  | 'reveal'
  | 'playing'
  | 'decision'
  | 'round-result'
  | 'winner'

export interface SpyfallSettings {
  playerCount: number
  spyMode: 'fixed' | 'random'
  spyCount: number
  enabledCategories: SpyfallCategoryId[]
}

export interface SpyfallCategoryOption {
  id: SpyfallCategoryId
  name: string
  description: string
}

export interface SpyfallWord {
  id: string
  text: string
  category: SpyfallCategoryId
}

export interface SpyfallPlayer {
  id: string
  name: string
  isSpy: boolean
}

export interface SpyfallVoteSummary {
  playerId: string
  playerName: string
  count: number
}

export interface SpyfallVoteDetail {
  voterName: string
  targetName: string
}

export interface SpyfallRoundResult {
  winner: SpyfallWinner
  reason: string
  accusedPlayerIds: string[]
  voteDetails: SpyfallVoteDetail[]
  voteSummary: SpyfallVoteSummary[]
  spyGuessSuccess: boolean | null
}

export interface SpyfallRound {
  wordId: string
  secretWord: string
  actualSpyCount: number
  players: SpyfallPlayer[]
  revealIndex: number
  revealOpened: boolean
  result: SpyfallRoundResult | null
  statsRecorded: boolean
}

export interface SpyfallStats {
  gamesPlayed: number
  spyWins: number
  civilianWins: number
  wordCounts: Record<string, number>
}

export interface SpyfallState {
  status: SpyfallStatus
  settings: SpyfallSettings
  customWords: string[]
  round: SpyfallRound | null
  stats: SpyfallStats
}
