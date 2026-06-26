import { useEffect, useMemo, useState } from 'react'
import { aliasThemes, aliasWords } from '../data/words'
import type {
  AliasCountdownState,
  AliasRoundEntry,
  AliasRoundState,
  AliasSettings,
  AliasState,
  AliasTeam,
  AliasWord,
} from '../types'
import { shuffleArray } from '../utils/shuffle'
import { readLocalStorage, removeLocalStorage, writeLocalStorage } from '../../../utils/storage'

const STORAGE_KEY = 'party-games.alias'

const DEFAULT_SETTINGS: AliasSettings = {
  teamNames: ['Команда 1', 'Команда 2'],
  roundDuration: 60,
  targetScore: 20,
  skipPenalty: true,
  themes: aliasThemes.map((theme) => theme.id),
}

function createRound(remainingMs: number, startedAt: number | null): AliasRoundState {
  return {
    entries: [],
    remainingMs,
    startedAt,
  }
}

function createCountdown(remainingMs: number, startedAt: number | null): AliasCountdownState {
  return {
    remainingMs,
    startedAt,
  }
}

function createTeams(teamNames: string[]): AliasTeam[] {
  return teamNames.map((name, index) => ({
    id: `team-${index + 1}`,
    name,
    score: 0,
  }))
}

function prepareDeck(settings: AliasSettings) {
  const filteredWords = aliasWords.filter((word) => settings.themes.includes(word.theme))
  return shuffleArray(filteredWords.length > 0 ? filteredWords : aliasWords)
}

function getNextWord(deck: AliasWord[], nextWordIndex: number, settings: AliasSettings) {
  if (deck.length === 0) {
    return {
      currentWord: null,
      deck,
      nextWordIndex,
    }
  }

  if (nextWordIndex >= deck.length) {
    const refreshedDeck = prepareDeck(settings)
    return {
      currentWord: refreshedDeck[0] ?? null,
      deck: refreshedDeck,
      nextWordIndex: 1,
    }
  }

  return {
    currentWord: deck[nextWordIndex] ?? null,
    deck,
    nextWordIndex: nextWordIndex + 1,
  }
}

function createInitialState(settings: AliasSettings = DEFAULT_SETTINGS): AliasState {
  const deck = prepareDeck(settings)

  return {
    status: 'settings',
    settings,
    teams: createTeams(settings.teamNames),
    currentTeamIndex: 0,
    deck,
    nextWordIndex: 1,
    currentWord: deck[0] ?? null,
    round: createRound(settings.roundDuration * 1000, null),
    countdown: createCountdown(5000, null),
    lastRoundSummary: null,
    winnerTeamId: null,
  }
}

function calculateRoundPoints(entries: AliasRoundEntry[], skipPenalty: boolean) {
  return entries.reduce((total, entry) => {
    if (entry.result === 'guessed') {
      return total + 1
    }

    return total - (skipPenalty ? 1 : 0)
  }, 0)
}

function normalizeEntries(value: unknown): AliasRoundEntry[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((entry, index) => {
      if (!entry || typeof entry !== 'object') {
        return null
      }

      const candidate = entry as Partial<AliasRoundEntry>
      if (typeof candidate.word !== 'string') {
        return null
      }

      const result = candidate.result === 'skipped' ? 'skipped' : 'guessed'

      return {
        id:
          typeof candidate.id === 'string' && candidate.id.length > 0
            ? candidate.id
            : `restored-${index}-${candidate.word}`,
        word: candidate.word,
        result,
      } satisfies AliasRoundEntry
    })
    .filter((entry): entry is AliasRoundEntry => entry !== null)
}

function normalizeState(savedState: AliasState): AliasState {
  const validThemeIds = new Set(aliasThemes.map((theme) => theme.id))
  const normalizedThemes = Array.isArray(savedState.settings?.themes)
    ? savedState.settings.themes.filter((theme): theme is AliasSettings['themes'][number] =>
        validThemeIds.has(theme),
      )
    : DEFAULT_SETTINGS.themes
  const roundEntries = normalizeEntries((savedState.round as Partial<AliasRoundState>).entries)
  const summaryEntries = normalizeEntries(savedState.lastRoundSummary?.entries)

  return {
    ...savedState,
    settings: {
      ...savedState.settings,
      themes: normalizedThemes.length > 0 ? normalizedThemes : DEFAULT_SETTINGS.themes,
    },
    round: {
      ...savedState.round,
      entries: roundEntries,
      remainingMs:
        typeof savedState.round.remainingMs === 'number' ? savedState.round.remainingMs : 0,
      startedAt:
        typeof savedState.round.startedAt === 'number' ? savedState.round.startedAt : null,
    },
    countdown: {
      remainingMs:
        typeof savedState.countdown?.remainingMs === 'number' ? savedState.countdown.remainingMs : 5000,
      startedAt:
        typeof savedState.countdown?.startedAt === 'number' ? savedState.countdown.startedAt : null,
    },
    lastRoundSummary: savedState.lastRoundSummary
      ? {
          entries: summaryEntries,
          isCommitted: Boolean(savedState.lastRoundSummary.isCommitted),
          pointsEarned: calculateRoundPoints(
            summaryEntries,
            savedState.settings.skipPenalty,
          ),
        }
      : null,
  }
}

function finalizeRound(state: AliasState, remainingMs = 0): AliasState {
  const pointsEarned = calculateRoundPoints(state.round.entries, state.settings.skipPenalty)

  return {
    ...state,
    status: 'results',
    round: {
      ...state.round,
      remainingMs,
      startedAt: null,
    },
    lastRoundSummary: {
      entries: [...state.round.entries],
      isCommitted: false,
      pointsEarned,
    },
  }
}

function hydrateState() {
  const savedState = readLocalStorage<AliasState>(STORAGE_KEY)

  if (!savedState) {
    return createInitialState()
  }

  const normalizedState = normalizeState(savedState)

  if (normalizedState.status === 'playing' && normalizedState.round.startedAt) {
    const elapsed = Date.now() - normalizedState.round.startedAt
    const remainingMs = Math.max(normalizedState.round.remainingMs - elapsed, 0)
    const hydratedState: AliasState = {
      ...normalizedState,
      round: {
        ...normalizedState.round,
        remainingMs,
        startedAt: remainingMs > 0 ? Date.now() : null,
      },
    }

    return remainingMs > 0 ? hydratedState : finalizeRound(hydratedState)
  }

  if (normalizedState.status === 'countdown' && normalizedState.countdown.startedAt) {
    const elapsed = Date.now() - normalizedState.countdown.startedAt
    const remainingMs = Math.max(normalizedState.countdown.remainingMs - elapsed, 0)

    if (remainingMs <= 0) {
      return {
        ...normalizedState,
        status: 'playing' as const,
        countdown: createCountdown(5000, null),
        round: {
          ...normalizedState.round,
          startedAt: Date.now(),
        },
      }
    }

    return {
      ...normalizedState,
      countdown: {
        remainingMs,
        startedAt: Date.now(),
      },
    }
  }

  return normalizedState
}

export function useAliasGame() {
  const [state, setState] = useState<AliasState>(() => hydrateState())

  useEffect(() => {
    writeLocalStorage(STORAGE_KEY, state)
  }, [state])

  useEffect(() => {
    if (state.status !== 'playing' || !state.round.startedAt) {
      return
    }

    const intervalId = window.setInterval(() => {
      setState((currentState) => {
        if (currentState.status !== 'playing' || !currentState.round.startedAt) {
          return currentState
        }

        const elapsed = Date.now() - currentState.round.startedAt
        const remainingMs = Math.max(currentState.round.remainingMs - elapsed, 0)

        if (remainingMs <= 0) {
          return finalizeRound(currentState)
        }

        return {
          ...currentState,
          round: {
            ...currentState.round,
            remainingMs,
            startedAt: Date.now(),
          },
        }
      })
    }, 250)

    return () => window.clearInterval(intervalId)
  }, [state.status, state.round.startedAt])

  useEffect(() => {
    if (state.status !== 'countdown' || !state.countdown.startedAt) {
      return
    }

    const intervalId = window.setInterval(() => {
      setState((currentState) => {
        if (currentState.status !== 'countdown' || !currentState.countdown.startedAt) {
          return currentState
        }

        const elapsed = Date.now() - currentState.countdown.startedAt
        const remainingMs = Math.max(currentState.countdown.remainingMs - elapsed, 0)

        if (remainingMs <= 0) {
          return {
            ...currentState,
            status: 'playing' as const,
            countdown: createCountdown(5000, null),
            round: {
              ...currentState.round,
              startedAt: Date.now(),
            },
          }
        }

        return {
          ...currentState,
          countdown: {
            remainingMs,
            startedAt: Date.now(),
          },
        }
      })
    }, 150)

    return () => window.clearInterval(intervalId)
  }, [state.status, state.countdown.startedAt])

  const currentTeam = state.teams[state.currentTeamIndex]
  const roundScore =
    state.status === 'results' && state.lastRoundSummary
      ? state.lastRoundSummary.pointsEarned
      : calculateRoundPoints(state.round.entries, state.settings.skipPenalty)

  const remainingSeconds = useMemo(
    () => Math.ceil(state.round.remainingMs / 1000),
    [state.round.remainingMs],
  )
  const countdownSeconds = useMemo(
    () => Math.ceil(state.countdown.remainingMs / 1000),
    [state.countdown.remainingMs],
  )

  function startGame(nextSettings: AliasSettings) {
    const deck = prepareDeck(nextSettings)

    setState({
      status: 'lobby',
      settings: nextSettings,
      teams: createTeams(nextSettings.teamNames),
      currentTeamIndex: 0,
      deck,
      nextWordIndex: 1,
      currentWord: deck[0] ?? null,
      round: createRound(nextSettings.roundDuration * 1000, null),
      countdown: createCountdown(5000, null),
      lastRoundSummary: null,
      winnerTeamId: null,
    })
  }

  function editSettings() {
    setState((currentState) => ({
      ...currentState,
      status: 'settings',
      countdown: createCountdown(5000, null),
      round: createRound(currentState.settings.roundDuration * 1000, null),
      lastRoundSummary: null,
    }))
  }

  function openRoundCountdown() {
    setState((currentState) => ({
      ...currentState,
      status: 'countdown',
      countdown: createCountdown(5000, Date.now()),
      round: {
        ...currentState.round,
        remainingMs: currentState.settings.roundDuration * 1000,
        startedAt: null,
      },
    }))
  }

  function registerGuess() {
    setState((currentState) => {
      if (!currentState.currentWord) {
        return currentState
      }

      const nextWordState = getNextWord(
        currentState.deck,
        currentState.nextWordIndex,
        currentState.settings,
      )

      return {
        ...currentState,
        deck: nextWordState.deck,
        nextWordIndex: nextWordState.nextWordIndex,
        currentWord: nextWordState.currentWord,
        round: {
          ...currentState.round,
          entries: [
            ...currentState.round.entries,
            {
              id: crypto.randomUUID(),
              word: currentState.currentWord.value,
              result: 'guessed',
            },
          ],
        },
      }
    })
  }

  function registerSkip() {
    setState((currentState) => {
      if (!currentState.currentWord) {
        return currentState
      }

      const nextWordState = getNextWord(
        currentState.deck,
        currentState.nextWordIndex,
        currentState.settings,
      )

      return {
        ...currentState,
        deck: nextWordState.deck,
        nextWordIndex: nextWordState.nextWordIndex,
        currentWord: nextWordState.currentWord,
        round: {
          ...currentState.round,
          entries: [
            ...currentState.round.entries,
            {
              id: crypto.randomUUID(),
              word: currentState.currentWord.value,
              result: 'skipped',
            },
          ],
        },
      }
    })
  }

  function pauseRound() {
    setState((currentState) => {
      if (currentState.status !== 'playing' || !currentState.round.startedAt) {
        return currentState
      }

      const elapsed = Date.now() - currentState.round.startedAt
      const remainingMs = Math.max(currentState.round.remainingMs - elapsed, 0)

      return {
        ...currentState,
        status: 'paused',
        round: {
          ...currentState.round,
          remainingMs,
          startedAt: null,
        },
      }
    })
  }

  function resumeRound() {
    setState((currentState) => ({
      ...currentState,
      status: 'playing',
      round: {
        ...currentState.round,
        startedAt: Date.now(),
      },
    }))
  }

  function goToNextTeam() {
    setState((currentState) => ({
      ...currentState,
      status: 'countdown',
      currentTeamIndex: (currentState.currentTeamIndex + 1) % currentState.teams.length,
      round: createRound(currentState.settings.roundDuration * 1000, null),
      countdown: createCountdown(5000, Date.now()),
      lastRoundSummary: null,
    }))
  }

  function updateRoundSummaryEntry(entryId: string, result: 'guessed' | 'skipped' | 'removed') {
    setState((currentState) => {
      if (!currentState.lastRoundSummary || currentState.lastRoundSummary.isCommitted) {
        return currentState
      }

      const nextEntries =
        result === 'removed'
          ? currentState.lastRoundSummary.entries.filter((entry) => entry.id !== entryId)
          : currentState.lastRoundSummary.entries.map((entry) =>
              entry.id === entryId ? { ...entry, result } : entry,
            )

      return {
        ...currentState,
        lastRoundSummary: {
          entries: nextEntries,
          isCommitted: false,
          pointsEarned: calculateRoundPoints(nextEntries, currentState.settings.skipPenalty),
        },
      }
    })
  }

  function commitRoundResults() {
    setState((currentState) => {
      if (!currentState.lastRoundSummary) {
        return currentState
      }

      const summary = currentState.lastRoundSummary
      const updatedTeams = currentState.teams.map((team, index) =>
        index === currentState.currentTeamIndex
          ? { ...team, score: team.score + summary.pointsEarned }
          : team,
      )
      const updatedCurrentTeam = updatedTeams[currentState.currentTeamIndex]
      const winnerTeamId =
        updatedCurrentTeam && updatedCurrentTeam.score >= currentState.settings.targetScore
          ? updatedCurrentTeam.id
          : null

      return {
        ...currentState,
        teams: updatedTeams,
        status: winnerTeamId ? 'winner' : 'results',
        lastRoundSummary: {
          ...summary,
          isCommitted: true,
        },
        winnerTeamId,
      }
    })
  }

  function playAgain() {
    startGame(state.settings)
  }

  function resetGame() {
    removeLocalStorage(STORAGE_KEY)
    setState(createInitialState(state.settings))
  }

  return {
    currentTeam,
    countdownSeconds,
    editSettings,
    openRoundCountdown,
    pauseRound,
    playAgain,
    registerGuess,
    registerSkip,
    remainingSeconds,
    resetGame,
    roundScore,
    resumeRound,
    startGame,
    state,
    commitRoundResults,
    goToNextTeam,
    updateRoundSummaryEntry,
  }
}
