import { Button } from '../../../components/Button/Button'
import { Card } from '../../../components/Card/Card'
import type { SpyfallPlayer } from '../types'
import styles from './RoleReveal.module.css'

interface RoleRevealProps {
  isRevealed: boolean
  player: SpyfallPlayer
  playerIndex: number
  secretWord: string
  totalPlayers: number
  onPassPhone: () => void
  onToggleReveal: () => void
}

export function RoleReveal({
  isRevealed,
  onPassPhone,
  onToggleReveal,
  player,
  playerIndex,
  secretWord,
  totalPlayers,
}: RoleRevealProps) {
  return (
    <Card className={styles.card}>
      <p className={styles.eyebrow}>Секретная выдача</p>
      <h1>
        {player.name} из {totalPlayers}
      </h1>

      {!isRevealed ? (
        <div className={styles.hiddenState}>
          <p>Передайте телефон игроку и нажмите, когда он будет готов увидеть карточку.</p>
          <Button fullWidth onClick={onToggleReveal}>
            Показать карточку
          </Button>
        </div>
      ) : (
        <div className={styles.revealCard}>
          {player.isSpy ? (
            <div className={styles.spyCard}>
              <span className={styles.spyBadge}>ШПИОН</span>
              <h2>Ты шпион</h2>
              <p>Все остальные знают секретное слово. Слушай вопросы и попытайся его вычислить.</p>
            </div>
          ) : (
            <div className={styles.roleCard}>
              <span className={styles.roleLabel}>Секретное слово</span>
              <strong className={styles.location}>{secretWord}</strong>
              <span className={styles.roleLabel}>Статус</span>
              <strong className={styles.role}>Ты знаешь слово</strong>
            </div>
          )}

          <Button fullWidth onClick={onPassPhone} variant={playerIndex + 1 === totalPlayers ? 'primary' : 'secondary'}>
            {playerIndex + 1 === totalPlayers ? 'Начать обсуждение' : 'Скрыть и передать телефон'}
          </Button>
        </div>
      )}
    </Card>
  )
}
