import { Button } from '../../components/Button/Button'
import { Card } from '../../components/Card/Card'
import { GameScreen } from './components/GameScreen'
import { RoleReveal } from './components/RoleReveal'
import { RoundResult } from './components/RoundResult'
import { SpyfallSettings } from './components/SpyfallSettings'
import { WinnerScreen } from './components/WinnerScreen'
import { useSpyfallGame } from './hooks/useSpyfallGame'
import styles from './SpyfallGame.module.css'

export function SpyfallGame() {
  const {
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
  } = useSpyfallGame()
  const round = state.round

  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Игры для компании</p>
          <h1>Spyfall</h1>
        </div>
        <Button onClick={resetGame} variant="secondary">
          Сбросить игру
        </Button>
      </header>

      {state.status === 'settings' ? (
        <SpyfallSettings
          customWords={state.customWords}
          initialSettings={state.settings}
          onAddCustomWord={addCustomWord}
          onRemoveCustomWord={removeCustomWord}
          onResetSettings={resetSettings}
          onStartGame={startGame}
        />
      ) : null}

      {state.status === 'reveal' && round && currentRevealPlayer ? (
        <RoleReveal
          isRevealed={round.revealOpened}
          onPassPhone={passPhone}
          onToggleReveal={toggleReveal}
          player={currentRevealPlayer}
          playerIndex={round.revealIndex}
          secretWord={round.secretWord}
          totalPlayers={round.players.length}
        />
      ) : null}

      {state.status === 'playing' && round ? (
        <GameScreen
          onFinishDiscussion={openDecision}
          onRestartRound={restartRound}
          playerCount={round.players.length}
          spyLabel={
            state.settings.spyMode === 'random'
              ? `Случайно 0-${state.settings.playerCount}`
              : String(state.settings.spyCount)
          }
        />
      ) : null}

      {state.status === 'decision' && round ? (
        <Card className={styles.card}>
          <p className={styles.eyebrow}>Итог обсуждения</p>
          <h1>
            {round.actualSpyCount === 0
              ? 'В этом раунде не было шпионов'
              : 'Кто победил в этом раунде?'}
          </h1>
          <p className={styles.description}>
            {round.actualSpyCount === 0
              ? 'Можно сразу завершить раунд победой мирных.'
              : 'Вы уже поговорили и проголосовали вживую. Отметьте только итог раунда.'}
          </p>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span>Игроков</span>
              <strong>{round.players.length}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span>Шпионов</span>
              <strong>{round.actualSpyCount}</strong>
            </div>
          </div>
          <div className={styles.actions}>
            {round.actualSpyCount === 0 ? (
              <Button
                fullWidth
                onClick={() =>
                  decideWinner('civilians', 'В этом раунде шпионов не было. Мирные побеждают.', false)
                }
              >
                Завершить раунд
              </Button>
            ) : null}
            {round.actualSpyCount > 0 ? (
              <Button
                fullWidth
                onClick={() =>
                  decideWinner(
                    'civilians',
                    round.actualSpyCount === 1
                      ? 'Игроки вычислили шпиона во время живого голосования.'
                      : 'Игроки вычислили всех шпионов во время живого голосования.',
                    false,
                  )
                }
              >
                Мирные нашли шпионов
              </Button>
            ) : null}
            {round.actualSpyCount > 0 ? (
              <Button
                fullWidth
                onClick={() =>
                  decideWinner('spies', 'Шпионы пережили живое голосование и не были раскрыты.', null)
                }
                variant="secondary"
              >
                Шпионы не раскрыты
              </Button>
            ) : null}
            {round.actualSpyCount > 0 ? (
              <Button
                fullWidth
                onClick={() =>
                  decideWinner('spies', 'Шпион сумел угадать секретное слово.', true)
                }
                variant="ghost"
              >
                Шпионы угадали слово
              </Button>
            ) : null}
            <Button fullWidth onClick={returnToDiscussion} variant="danger">
              Вернуться к обсуждению
            </Button>
          </div>
        </Card>
      ) : null}

      {state.status === 'round-result' && round?.result ? (
        <RoundResult onContinue={openWinnerScreen} players={round.players} result={round.result} />
      ) : null}

      {state.status === 'winner' && round?.result ? (
        <WinnerScreen
          mostCommonWords={mostCommonWords}
          onNewRound={newRound}
          onPlayAgain={playAgain}
          players={round.players}
          result={round.result}
          secretWord={round.secretWord}
          stats={{
            civilianWins: state.stats.civilianWins,
            gamesPlayed: state.stats.gamesPlayed,
            spyWins: state.stats.spyWins,
            winRate,
          }}
        />
      ) : null}
    </section>
  )
}
