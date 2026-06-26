import { Link } from 'react-router-dom'
import { Button } from '../../../components/Button/Button'
import { Card } from '../../../components/Card/Card'
import type { SpyfallPlayer, SpyfallRoundResult } from '../types'
import styles from './WinnerScreen.module.css'

interface WinnerScreenProps {
  mostCommonWords: Array<[string, number]>
  onNewRound: () => void
  onPlayAgain: () => void
  players: SpyfallPlayer[]
  result: SpyfallRoundResult
  secretWord: string
  stats: {
    civilianWins: number
    gamesPlayed: number
    spyWins: number
    winRate: number
  }
}

export function WinnerScreen({
  mostCommonWords,
  onNewRound,
  onPlayAgain,
  players,
  result,
  secretWord,
  stats,
}: WinnerScreenProps) {
  const spies = players.filter((player) => player.isSpy)

  return (
    <Card className={styles.card}>
      <p className={styles.eyebrow}>Финальный отчет</p>
      <h1>{result.winner === 'spies' ? 'Победа шпионов' : 'Победа мирных'}</h1>
      <p className={styles.description}>{result.reason}</p>

      <div className={styles.topGrid}>
        <div className={styles.panel}>
          <span>Секретное слово</span>
          <strong>{secretWord}</strong>
        </div>
        <div className={styles.panel}>
          <span>Шпионы</span>
          <strong>{spies.length > 0 ? spies.map((player) => player.name).join(', ') : 'Шпионов не было'}</strong>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Игроки раунда</h2>
        <div className={styles.roles}>
          {players.map((player) => (
            <div className={styles.roleRow} key={player.id}>
              <strong>{player.name}</strong>
              <span>{player.isSpy ? 'Шпион' : 'Знал слово'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Статистика</h2>
        <div className={styles.statsGrid}>
          <div className={styles.panel}>
            <span>Сыграно</span>
            <strong>{stats.gamesPlayed}</strong>
          </div>
          <div className={styles.panel}>
            <span>Побед шпионов</span>
            <strong>{stats.spyWins}</strong>
          </div>
          <div className={styles.panel}>
            <span>Побед мирных</span>
            <strong>{stats.civilianWins}</strong>
          </div>
          <div className={styles.panel}>
            <span>Винрейт мирных</span>
            <strong>{stats.winRate}%</strong>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Частые слова</h2>
        <div className={styles.roles}>
          {mostCommonWords.length > 0 ? (
            mostCommonWords.map(([name, count]) => (
              <div className={styles.roleRow} key={name}>
                <strong>{name}</strong>
                <span>{count} раз</span>
              </div>
            ))
          ) : (
            <div className={styles.roleRow}>
              <strong>Пока пусто</strong>
              <span>Сыграйте первый раунд</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <Button fullWidth onClick={onPlayAgain}>
          Играть снова
        </Button>
        <Button fullWidth onClick={onNewRound} variant="secondary">
          Новый раунд
        </Button>
        <Link className={styles.homeLink} to="/">
          На главную
        </Link>
      </div>
    </Card>
  )
}
