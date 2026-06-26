import { Link, Navigate, useParams } from 'react-router-dom'
import { getGameById } from '../games'
import styles from './GamePage.module.css'

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>()

  if (!gameId) {
    return <Navigate replace to="/" />
  }

  const game = getGameById(gameId)

  if (!game) {
    return <Navigate replace to="/" />
  }

  const GameComponent = game.component

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <Link className={styles.backLink} to="/">
          Ко всем играм
        </Link>
      </div>
      <GameComponent />
    </main>
  )
}
