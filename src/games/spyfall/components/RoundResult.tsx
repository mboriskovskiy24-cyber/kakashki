import { Button } from '../../../components/Button/Button'
import { Card } from '../../../components/Card/Card'
import type { SpyfallPlayer, SpyfallRoundResult } from '../types'
import styles from './RoundResult.module.css'

interface RoundResultProps {
  players: SpyfallPlayer[]
  result: SpyfallRoundResult
  onContinue: () => void
}

export function RoundResult({ onContinue, players, result }: RoundResultProps) {
  const accusedNames = result.accusedPlayerIds
    .map((playerId) => players.find((player) => player.id === playerId)?.name)
    .filter(Boolean)

  return (
    <Card className={styles.card}>
      <p className={styles.eyebrow}>Итог раунда</p>
      <h1>{result.winner === 'spies' ? 'Шпионы победили' : 'Мирные победили'}</h1>
      <p className={styles.description}>{result.reason}</p>

      {accusedNames.length > 0 ? (
        <div className={styles.infoCard}>
          <span>Под подозрением</span>
          <strong>{accusedNames.join(', ')}</strong>
        </div>
      ) : null}

      {result.spyGuessSuccess === true ? (
        <div className={styles.voteList}>
          <div className={styles.voteRow}>
            <span>Финал раунда</span>
            <strong>Шпион угадал секретное слово</strong>
          </div>
        </div>
      ) : null}

      {result.spyGuessSuccess === false ? (
        <div className={styles.detailList}>
          <div className={styles.detailRow}>
            <span>Финал раунда</span>
            <strong>Слово осталось секретом для шпиона</strong>
          </div>
        </div>
      ) : null}

      <Button fullWidth onClick={onContinue}>
        Показать итог и статистику
      </Button>
    </Card>
  )
}
