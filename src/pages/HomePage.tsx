import { Link } from 'react-router-dom'
import { Card } from '../components/Card/Card'
import { games } from '../games'
import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Игры для компании</p>
          <h1 className={styles.title}>Весёлые игры для друзей и семьи</h1>
          <p className={styles.subtitle}>
            Современный сайт с браузерными играми для вечеринок. Сейчас доступен Alias,
            а архитектура уже готова к новым играм без больших переделок.
          </p>
        </div>
        <div className={styles.orb} aria-hidden="true" />
      </section>

      <section className={styles.grid} aria-label="Доступные игры">
        {games.map((game) => (
          <Card className={styles.gameCard} key={game.id}>
            <div className={styles.cardGlow} style={{ background: game.accent }} />
            <div className={styles.cardContent}>
              <span className={styles.tag}>Доступно сейчас</span>
              <h2>
                {game.icon ? <span className={styles.icon}>{game.icon}</span> : null}
                {game.name}
              </h2>
              <p>{game.description}</p>
              <p className={styles.tagline}>{game.tagline}</p>
              <Link className={styles.playLink} to={`/games/${game.id}`}>
                Играть
              </Link>
            </div>
          </Card>
        ))}
      </section>
    </main>
  )
}
