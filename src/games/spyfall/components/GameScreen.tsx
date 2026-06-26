import { Button } from '../../../components/Button/Button'
import { Card } from '../../../components/Card/Card'
import styles from './GameScreen.module.css'

interface GameScreenProps {
  spyLabel: string
  playerCount: number
  onFinishDiscussion: () => void
  onRestartRound: () => void
}

export function GameScreen({
  onFinishDiscussion,
  onRestartRound,
  playerCount,
  spyLabel,
}: GameScreenProps) {
  return (
    <div className={styles.layout}>
      <Card className={styles.mainCard}>
        <p className={styles.eyebrow}>Обсуждение</p>
        <h1>Играйте в своем темпе</h1>
        <p className={styles.description}>
          Секретное слово скрыто. Задавайте вопросы друг другу и ищите несостыковки в ответах.
        </p>

        <div className={styles.metaGrid}>
          <div className={styles.metaCard}>
            <span>Игроков</span>
            <strong>{playerCount}</strong>
          </div>
          <div className={styles.metaCard}>
            <span>Шпионов</span>
            <strong>{spyLabel}</strong>
          </div>
        </div>

        <div className={styles.actions}>
          <Button fullWidth onClick={onFinishDiscussion}>
            Завершить обсуждение
          </Button>
          <Button fullWidth onClick={onRestartRound} variant="secondary">
            Перезапустить раунд
          </Button>
        </div>
      </Card>
    </div>
  )
}
