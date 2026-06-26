import { Link } from 'react-router-dom'
import { Button } from '../../../components/Button/Button'
import { Card } from '../../../components/Card/Card'
import { Scoreboard } from '../../../components/Scoreboard/Scoreboard'
import type { AliasTeam } from '../types'
import styles from './AliasWinner.module.css'

interface AliasWinnerProps {
  teams: AliasTeam[]
  winner: AliasTeam
  onPlayAgain: () => void
}

export function AliasWinner({ onPlayAgain, teams, winner }: AliasWinnerProps) {
  return (
    <Card className={styles.card}>
      <p className={styles.eyebrow}>Победитель</p>
      <h1>{winner.name}</h1>
      <p className={styles.subtitle}>Побеждает и забирает титул главных мастеров объяснений.</p>
      <div className={styles.scoreWrap}>
        <Scoreboard currentTeamId={winner.id} items={teams} />
      </div>
      <div className={styles.actions}>
        <Button fullWidth onClick={onPlayAgain}>
          Играть снова
        </Button>
        <Link className={styles.homeLink} to="/">
          На главную
        </Link>
      </div>
    </Card>
  )
}
