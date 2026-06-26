import { Card } from '../../../components/Card/Card'
import { aliasThemes } from '../data/words'
import type { AliasSettings, AliasTeam } from '../types'
import styles from './AliasCountdown.module.css'

interface AliasCountdownProps {
  countdownSeconds: number
  currentTeam: AliasTeam
  settings: AliasSettings
}

export function AliasCountdown({
  countdownSeconds,
  currentTeam,
  settings,
}: AliasCountdownProps) {
  const selectedThemeNames = aliasThemes
    .filter((theme) => settings.themes.includes(theme.id))
    .map((theme) => theme.name)

  return (
    <Card className={styles.card}>
      <p className={styles.eyebrow}>Шаг 3 из 3</p>
      <h1>{currentTeam.name}, приготовьтесь</h1>
      <p className={styles.description}>
        Через несколько секунд начнется раунд. Передайте телефон объясняющему игроку.
      </p>

      <div className={styles.pulseWrap}>
        <div className={styles.pulseRing} />
        <div className={styles.counter}>{countdownSeconds}</div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <span>Тема</span>
          <strong>{selectedThemeNames.join(', ')}</strong>
        </div>
        <div className={styles.infoCard}>
          <span>Раунд</span>
          <strong>{settings.roundDuration} секунд</strong>
        </div>
        <div className={styles.infoCard}>
          <span>Цель игры</span>
          <strong>{settings.targetScore} очков</strong>
        </div>
      </div>
    </Card>
  )
}
