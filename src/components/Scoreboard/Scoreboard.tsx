import styles from './Scoreboard.module.css'

interface ScoreboardItem {
  id: string
  name: string
  score: number
}

interface ScoreboardProps {
  items: ScoreboardItem[]
  currentTeamId?: string
}

export function Scoreboard({ currentTeamId, items }: ScoreboardProps) {
  return (
    <div className={styles.board}>
      {items.map((item, index) => (
        <div
          className={[styles.item, currentTeamId === item.id ? styles.active : ''].filter(Boolean).join(' ')}
          key={item.id}
        >
          <span className={styles.rank}>{index + 1}</span>
          <div>
            <strong className={styles.name}>{item.name}</strong>
            <span className={styles.caption}>
              {currentTeamId === item.id ? 'Сейчас играет' : 'Команда'}
            </span>
          </div>
          <span className={styles.score}>{item.score}</span>
        </div>
      ))}
    </div>
  )
}
