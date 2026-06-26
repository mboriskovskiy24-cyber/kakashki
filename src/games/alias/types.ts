export type AliasDifficulty = 'easy' | 'medium' | 'hard'
export type AliasThemeId =
  | 'party'
  | 'nature'
  | 'cs2'
  | 'sex'
  | 'genitals'
  | 'geography'

export interface AliasTheme {
  id: AliasThemeId
  name: string
  description: string
}

export interface AliasWord {
  value: string
  difficulty: AliasDifficulty
  theme: AliasThemeId
}

export interface AliasSettings {
  teamNames: string[]
  roundDuration: number
  targetScore: number
  skipPenalty: boolean
  themes: AliasThemeId[]
}

export interface AliasTeam {
  id: string
  name: string
  score: number
}

export type AliasRoundEntryResult = 'guessed' | 'skipped'

export interface AliasRoundEntry {
  id: string
  word: string
  result: AliasRoundEntryResult
}

export interface AliasRoundState {
  entries: AliasRoundEntry[]
  remainingMs: number
  startedAt: number | null
}

export interface AliasRoundSummary {
  entries: AliasRoundEntry[]
  isCommitted: boolean
  pointsEarned: number
}

export interface AliasCountdownState {
  remainingMs: number
  startedAt: number | null
}

export type AliasStatus =
  | 'settings'
  | 'lobby'
  | 'countdown'
  | 'playing'
  | 'paused'
  | 'results'
  | 'winner'

export interface AliasState {
  status: AliasStatus
  settings: AliasSettings
  teams: AliasTeam[]
  currentTeamIndex: number
  deck: AliasWord[]
  nextWordIndex: number
  currentWord: AliasWord | null
  round: AliasRoundState
  countdown: AliasCountdownState
  lastRoundSummary: AliasRoundSummary | null
  winnerTeamId: string | null
}
