import { useEffect, useState } from 'react'
import { spyfallCategoryOptions, spyfallWords } from '../data/locations'
import type {
  SpyfallPlayer,
  SpyfallRound,
  SpyfallSettings,
  SpyfallState,
  SpyfallStats,
  SpyfallWinner,
  SpyfallWord,
} from '../types'
import { pickRandomItem, pickUniqueIndices } from '../utils/random'
import { readLocalStorage, removeLocalStorage, writeLocalStorage } from '../../../utils/storage'

const STORAGE_KEY = 'party-games.spyfall.state'
const CUSTOM_KEY = 'party-games.spyfall.custom-words'
const STATS_KEY = 'party-games.spyfall.stats'

const DEFAULT_SETTINGS: SpyfallSettings = {
  playerCount: 6,
  spyMode: 'fixed',
  spyCount: 1,
  enabledCategories: spyfallCategoryOptions.map((option) => option.id),
}

const DEFAULT_STATS: SpyfallStats = {
  gamesPlayed: 0,
  spyWins: 0,
  civilianWins: 0,
  wordCounts: {},
}

function createPlayerName(index: number) {
  return `Игрок ${index + 1}`
}

function createCustomWord(text: string): SpyfallWord {
  return {
    id: `custom-${text.toLowerCase().replaceAll(/\s+/g, '-')}`,
    text,
    category: 'places',
  }
}

function normalizeStats(stats: SpyfallStats | null): SpyfallStats {
  if (!stats) {
    return DEFAULT_STATS
  }

  return {
    gamesPlayed: typeof stats.gamesPlayed === 'number' ? stats.gamesPlayed : 0,
    spyWins: typeof stats.spyWins === 'number' ? stats.spyWins : 0,
    civilianWins: typeof stats.civilianWins === 'number' ? stats.civilianWins : 0,
    wordCounts: stats.wordCounts && typeof stats.wordCounts === 'object' ? stats.wordCounts : {},
  }
}

function getEligibleWords(settings: SpyfallSettings, customWords: string[]) {
  const builtInWords = spyfallWords.filter((word) =>
    settings.enabledCategories.includes(word.category),
  )
  const custom = customWords.map((word) => createCustomWord(word))
  const combined = [...builtInWords, ...custom]

  return combined.length > 0 ? combined : [...spyfallWords]
}

function resolveSpyCount(settings: SpyfallSettings) {
  if (settings.spyMode === 'random') {
    return Math.floor(Math.random() * (settings.playerCount + 1))
  }

  return Math.min(Math.max(settings.spyCount, 0), settings.playerCount)
}

function generateRound(settings: SpyfallSettings, customWords: string[]): SpyfallRound {
  const secretWord = pickRandomItem(getEligibleWords(settings, customWords)) ?? spyfallWords[0]
  const actualSpyCount = resolveSpyCount(settings)
  const spyIndices = new Set(pickUniqueIndices(settings.playerCount, actualSpyCount))

  const players: SpyfallPlayer[] = Array.from({ length: settings.playerCount }, (_, index) => ({
    id: `player-${index + 1}`,
    name: createPlayerName(index),
    isSpy: spyIndices.has(index),
  }))

  return {
    wordId: secretWord.id,
    secretWord: secretWord.text,
    actualSpyCount,
    players,
    revealIndex: 0,
    revealOpened: false,
    result: null,
    statsRecorded: false,
  }
}

function createInitialState(): SpyfallState {
  const customWords = readLocalStorage<string[]>(CUSTOM_KEY) ?? []
  const stats = normalizeStats(readLocalStorage<SpyfallStats>(STATS_KEY))

  return {
    status: 'settings',
    settings: DEFAULT_SETTINGS,
    customWords,
    round: null,
    stats,
  }
}

function normalizeRound(round: SpyfallRound | null): SpyfallRound | null {
  if (!round) {
    return null
  }

  return {
    ...round,
    players: Array.isArray(round.players) ? round.players : [],
    actualSpyCount: typeof round.actualSpyCount === 'number' ? round.actualSpyCount : 0,
    revealIndex: typeof round.revealIndex === 'number' ? round.revealIndex : 0,
    revealOpened: Boolean(round.revealOpened),
    result: round.result ?? null,
    statsRecorded: Boolean(round.statsRecorded),
  }
}

function normalizeState(saved: SpyfallState | null): SpyfallState {
  if (!saved) {
    return createInitialState()
  }

  const customWords = readLocalStorage<string[]>(CUSTOM_KEY) ?? saved.customWords ?? []
  const settings: SpyfallSettings = {
    ...DEFAULT_SETTINGS,
    ...saved.settings,
    spyMode: saved.settings?.spyMode === 'random' ? 'random' : 'fixed',
    spyCount:
      typeof saved.settings?.spyCount === 'number'
        ? Math.max(0, Math.min(saved.settings.spyCount, saved.settings.playerCount ?? DEFAULT_SETTINGS.playerCount))
        : DEFAULT_SETTINGS.spyCount,
  }

  return {
    status: saved.status ?? 'settings',
    settings,
    customWords,
    round: normalizeRound(saved.round),
    stats: normalizeStats(readLocalStorage<SpyfallStats>(STATS_KEY) ?? saved.stats),
  }
}

function applyStats(stats: SpyfallStats, winner: SpyfallWinner, secretWord: string): SpyfallStats {
  return {
    gamesPlayed: stats.gamesPlayed + 1,
    spyWins: stats.spyWins + (winner === 'spies' ? 1 : 0),
    civilianWins: stats.civilianWins + (winner === 'civilians' ? 1 : 0),
    wordCounts: {
      ...stats.wordCounts,
      [secretWord]: (stats.wordCounts[secretWord] ?? 0) + 1,
    },
  }
}

export function useSpyfallGame() {
  const [state, setState] = useState<SpyfallState>(() =>
    normalizeState(readLocalStorage<SpyfallState>(STORAGE_KEY)),
  )

  useEffect(() => {
    writeLocalStorage(STORAGE_KEY, state)
  }, [state])

  useEffect(() => {
    writeLocalStorage(CUSTOM_KEY, state.customWords)
  }, [state.customWords])

  useEffect(() => {
    writeLocalStorage(STATS_KEY, state.stats)
  }, [state.stats])

  const currentRevealPlayer = state.round?.players[state.round.revealIndex] ?? null

  function resetSettings() {
    setState((currentState) => ({
      ...currentState,
      settings: DEFAULT_SETTINGS,
    }))
  }

  function startGame(settings: SpyfallSettings) {
    setState((currentState) => ({
      ...currentState,
      settings,
      round: generateRound(settings, currentState.customWords),
      status: 'reveal',
    }))
  }

  function toggleReveal() {
    setState((currentState) =>
      currentState.round
        ? {
            ...currentState,
            round: {
              ...currentState.round,
              revealOpened: !currentState.round.revealOpened,
            },
          }
        : currentState,
    )
  }

  function passPhone() {
    setState((currentState) => {
      if (!currentState.round) {
        return currentState
      }

      const nextIndex = currentState.round.revealIndex + 1
      const allSeen = nextIndex >= currentState.round.players.length

      return {
        ...currentState,
        status: allSeen ? 'playing' : 'reveal',
        round: {
          ...currentState.round,
          revealIndex: allSeen ? currentState.round.revealIndex : nextIndex,
          revealOpened: false,
        },
      }
    })
  }

  function restartRound() {
    setState((currentState) => ({
      ...currentState,
      round: generateRound(currentState.settings, currentState.customWords),
      status: 'reveal',
    }))
  }

  function finalizeRound(winner: SpyfallWinner, reason: string, spyGuessSuccess: boolean | null) {
    setState((currentState) => {
      if (!currentState.round) {
        return currentState
      }

      const nextStats = currentState.round.statsRecorded
        ? currentState.stats
        : applyStats(currentState.stats, winner, currentState.round.secretWord)

      return {
        ...currentState,
        status: 'round-result',
        stats: nextStats,
        round: {
          ...currentState.round,
          result: {
            winner,
            reason,
            accusedPlayerIds: [],
            voteDetails: [],
            voteSummary: [],
            spyGuessSuccess,
          },
          statsRecorded: true,
        },
      }
    })
  }

  function openDecision() {
    setState((currentState) =>
      currentState.round
        ? {
            ...currentState,
            status: 'decision',
          }
        : currentState,
    )
  }

  function decideWinner(winner: SpyfallWinner, reason: string, spyGuessSuccess: boolean | null) {
    finalizeRound(winner, reason, spyGuessSuccess)
  }

  function returnToDiscussion() {
    setState((currentState) =>
      currentState.round
        ? {
            ...currentState,
            status: 'playing',
          }
        : currentState,
    )
  }

  function openWinnerScreen() {
    setState((currentState) => ({
      ...currentState,
      status: 'winner',
    }))
  }

  function playAgain() {
    setState((currentState) => ({
      ...currentState,
      round: generateRound(currentState.settings, currentState.customWords),
      status: 'reveal',
    }))
  }

  function newRound() {
    setState((currentState) => ({
      ...currentState,
      status: 'settings',
      round: null,
    }))
  }

  function addCustomWord(word: string) {
    const trimmedWord = word.trim()
    if (!trimmedWord) {
      return
    }

    setState((currentState) => {
      if (currentState.customWords.includes(trimmedWord)) {
        return currentState
      }

      return {
        ...currentState,
        customWords: [...currentState.customWords, trimmedWord],
      }
    })
  }

  function removeCustomWord(word: string) {
    setState((currentState) => ({
      ...currentState,
      customWords: currentState.customWords.filter((item) => item !== word),
    }))
  }

  function resetGame() {
    removeLocalStorage(STORAGE_KEY)
    setState(createInitialState())
  }

  const winRate = state.stats.gamesPlayed
    ? Math.round((state.stats.civilianWins / state.stats.gamesPlayed) * 100)
    : 0
  const mostCommonWords = Object.entries(state.stats.wordCounts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)

  return {
    addCustomWord,
    currentRevealPlayer,
    decideWinner,
    mostCommonWords,
    newRound,
    openWinnerScreen,
    openDecision,
    passPhone,
    playAgain,
    removeCustomWord,
    resetGame,
    resetSettings,
    restartRound,
    returnToDiscussion,
    startGame,
    state,
    toggleReveal,
    winRate,
  }
}
