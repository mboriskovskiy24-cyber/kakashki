import { Button } from '../../../components/Button/Button'
import { Card } from '../../../components/Card/Card'
import { Scoreboard } from '../../../components/Scoreboard/Scoreboard'
import type { AliasRoundSummary, AliasTeam } from '../types'
import styles from './AliasRoundResults.module.css'

interface AliasRoundResultsProps {
  currentTeam: AliasTeam
  onConfirmRound: () => void
  onNextTeam: () => void
  onUpdateEntry: (entryId: string, result: 'guessed' | 'skipped' | 'removed') => void
  summary: AliasRoundSummary
  teams: AliasTeam[]
}

export function AliasRoundResults({
  onConfirmRound,
  currentTeam,
  onNextTeam,
  onUpdateEntry,
  summary,
  teams,
}: AliasRoundResultsProps) {
  const entries = Array.isArray(summary.entries) ? summary.entries : []
  const guessedWords = entries.filter((entry) => entry.result === 'guessed')
  const skippedWords = entries.filter((entry) => entry.result === 'skipped')

  return (
    <div className={styles.layout}>
      <Card className={styles.summaryCard}>
        <p className={styles.eyebrow}>Результаты раунда</p>
        <h1>{currentTeam.name} завершила раунд</h1>
        <p className={styles.helper}>
          Если во время таймера нажали не на ту кнопку, исправьте слова ниже, а потом
          подтвердите очки.
        </p>
        <div className={styles.metrics}>
          <div>
            <span>Угадано</span>
            <strong>{guessedWords.length}</strong>
          </div>
          <div>
            <span>Пропущено</span>
            <strong>{skippedWords.length}</strong>
          </div>
          <div>
            <span>Очки за раунд</span>
            <strong>{summary.pointsEarned > 0 ? `+${summary.pointsEarned}` : summary.pointsEarned}</strong>
          </div>
        </div>
        <div className={styles.editor}>
          <h2>Проверьте слова раунда</h2>
          <div className={styles.entryList}>
            {entries.length === 0 ? (
              <p className={styles.empty}>В этом раунде пока нет отмеченных слов.</p>
            ) : null}
            {entries.map((entry) => (
              <div className={styles.entryCard} key={entry.id}>
                <div className={styles.entryTop}>
                  <strong>{entry.word}</strong>
                  <span
                    className={[
                      styles.entryBadge,
                      entry.result === 'guessed' ? styles.guessed : styles.skipped,
                    ].join(' ')}
                  >
                    {entry.result === 'guessed' ? 'Угадано' : 'Пропущено'}
                  </span>
                </div>
                <div className={styles.entryActions}>
                  <Button
                    className={styles.entryButton}
                    disabled={summary.isCommitted}
                    onClick={() => onUpdateEntry(entry.id, 'guessed')}
                    variant={entry.result === 'guessed' ? 'primary' : 'secondary'}
                  >
                    В угаданные
                  </Button>
                  <Button
                    className={styles.entryButton}
                    disabled={summary.isCommitted}
                    onClick={() => onUpdateEntry(entry.id, 'skipped')}
                    variant={entry.result === 'skipped' ? 'ghost' : 'secondary'}
                  >
                    В пропущенные
                  </Button>
                  <Button
                    className={styles.entryButton}
                    disabled={summary.isCommitted}
                    onClick={() => onUpdateEntry(entry.id, 'removed')}
                    variant="danger"
                  >
                    Убрать
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.actions}>
          {!summary.isCommitted ? (
            <Button fullWidth onClick={onConfirmRound}>
              Подтвердить очки
            </Button>
          ) : null}
          {summary.isCommitted ? (
            <Button fullWidth onClick={onNextTeam}>
              Следующая команда
            </Button>
          ) : null}
        </div>
      </Card>

      <Card className={styles.scoreCard}>
        <h2>Общий счет</h2>
        <Scoreboard currentTeamId={currentTeam.id} items={teams} />
      </Card>
    </div>
  )
}
