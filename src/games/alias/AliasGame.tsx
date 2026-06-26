import { Button } from '../../components/Button/Button'
import { AliasCountdown } from './components/AliasCountdown'
import { AliasLobby } from './components/AliasLobby'
import { AliasRound } from './components/AliasRound'
import { AliasRoundResults } from './components/AliasRoundResults'
import { AliasSettings } from './components/AliasSettings'
import { AliasWinner } from './components/AliasWinner'
import { useAliasGame } from './hooks/useAliasGame'
import styles from './AliasGame.module.css'

export function AliasGame() {
  const {
    countdownSeconds,
    commitRoundResults,
    currentTeam,
    editSettings,
    goToNextTeam,
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
    updateRoundSummaryEntry,
  } = useAliasGame()

  const winner = state.teams.find((team) => team.id === state.winnerTeamId) ?? null

  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Игры для компании</p>
          <h1>Alias</h1>
        </div>
        <Button onClick={resetGame} variant="secondary">
          Сбросить игру
        </Button>
      </header>

      {state.status === 'settings' ? (
        <AliasSettings initialSettings={state.settings} onStartGame={startGame} />
      ) : null}

      {state.status === 'lobby' ? (
        <AliasLobby
          onEdit={editSettings}
          onStartRound={openRoundCountdown}
          settings={state.settings}
          teams={state.teams}
        />
      ) : null}

      {state.status === 'countdown' && currentTeam ? (
        <AliasCountdown
          countdownSeconds={countdownSeconds}
          currentTeam={currentTeam}
          settings={state.settings}
        />
      ) : null}

      {state.status === 'playing' && currentTeam ? (
        <AliasRound
          currentTeam={currentTeam}
          currentWord={state.currentWord}
          onGuess={registerGuess}
          onPause={pauseRound}
          onResume={resumeRound}
          onSkip={registerSkip}
          paused={false}
          remainingSeconds={remainingSeconds}
          roundScore={roundScore}
          scoreboard={state.teams}
        />
      ) : null}

      {state.status === 'paused' && currentTeam ? (
        <AliasRound
          currentTeam={currentTeam}
          currentWord={state.currentWord}
          onGuess={registerGuess}
          onPause={pauseRound}
          onResume={resumeRound}
          onSkip={registerSkip}
          paused
          remainingSeconds={remainingSeconds}
          roundScore={roundScore}
          scoreboard={state.teams}
        />
      ) : null}

      {state.status === 'results' && currentTeam && state.lastRoundSummary ? (
        <AliasRoundResults
          onConfirmRound={commitRoundResults}
          currentTeam={currentTeam}
          onNextTeam={goToNextTeam}
          onUpdateEntry={updateRoundSummaryEntry}
          summary={state.lastRoundSummary}
          teams={state.teams}
        />
      ) : null}

      {state.status === 'winner' && winner ? (
        <AliasWinner onPlayAgain={playAgain} teams={state.teams} winner={winner} />
      ) : null}
    </section>
  )
}
