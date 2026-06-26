import { Button } from '../../../components/Button/Button'
import { Card } from '../../../components/Card/Card'
import { Modal } from '../../../components/Modal/Modal'
import { Scoreboard } from '../../../components/Scoreboard/Scoreboard'
import { formatDuration } from '../../../utils/format'
import type { AliasTeam, AliasWord } from '../types'
import styles from './AliasRound.module.css'

interface AliasRoundProps {
  currentTeam: AliasTeam
  currentWord: AliasWord | null
  onGuess: () => void
  onPause: () => void
  onResume: () => void
  onSkip: () => void
  remainingSeconds: number
  roundScore: number
  scoreboard: AliasTeam[]
  paused: boolean
}

export function AliasRound({
  currentTeam,
  currentWord,
  onGuess,
  onPause,
  onResume,
  onSkip,
  paused,
  remainingSeconds,
  roundScore,
  scoreboard,
}: AliasRoundProps) {
  return (
    <>
      <div className={styles.layout}>
        <Card className={styles.stage}>
          <div className={styles.stageTop}>
            <div>
              <p className={styles.eyebrow}>Ход команды</p>
              <h1>{currentTeam.name}</h1>
            </div>
            <div className={styles.timer}>{formatDuration(remainingSeconds)}</div>
          </div>

          <div className={styles.wordWrap}>
            <p className={styles.wordLabel}>Слово</p>
            <div className={styles.word}>{currentWord?.value ?? 'Готово'}</div>
          </div>

          <div className={styles.stats}>
            <div>
              <span>Общий счет</span>
              <strong>{currentTeam.score}</strong>
            </div>
            <div>
              <span>Очки за раунд</span>
              <strong>{roundScore > 0 ? `+${roundScore}` : roundScore}</strong>
            </div>
          </div>

          <div className={styles.actions}>
            <Button className={styles.action} onClick={onGuess}>
              Угадали
            </Button>
            <Button className={styles.action} onClick={onSkip} variant="secondary">
              Пропустить
            </Button>
            <Button className={styles.action} onClick={onPause} variant="ghost">
              Пауза
            </Button>
          </div>
        </Card>

        <Card className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Счет команд</h2>
            <span>Следите за гонкой до победы</span>
          </div>
          <Scoreboard currentTeamId={currentTeam.id} items={scoreboard} />
        </Card>
      </div>

      <Modal isOpen={paused} title="Пауза">
        <p className={styles.pauseCopy}>
          Таймер остановлен. Продолжайте, когда команда снова готова.
        </p>
        <Button fullWidth onClick={onResume}>
          Продолжить
        </Button>
      </Modal>
    </>
  )
}
