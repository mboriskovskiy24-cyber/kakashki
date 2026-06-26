import { Button } from '../../../components/Button/Button'
import { Card } from '../../../components/Card/Card'
import { aliasThemes } from '../data/words'
import type { AliasSettings, AliasTeam } from '../types'
import styles from './AliasLobby.module.css'

interface AliasLobbyProps {
  onEdit: () => void
  onStartRound: () => void
  settings: AliasSettings
  teams: AliasTeam[]
}

export function AliasLobby({ onEdit, onStartRound, settings, teams }: AliasLobbyProps) {
  const selectedThemes = aliasThemes.filter((theme) => settings.themes.includes(theme.id))

  return (
    <Card className={styles.card}>
      <p className={styles.eyebrow}>Шаг 2 из 3</p>
      <h1>Проверьте правила перед стартом</h1>
      <p className={styles.description}>
        Все готово. На следующем экране команда увидит короткий анимированный отсчет, и
        раунд начнется автоматически.
      </p>

      <div className={styles.summaryGrid}>
        <div className={styles.panel}>
          <span>Команд</span>
          <strong>{teams.length}</strong>
        </div>
        <div className={styles.panel}>
          <span>Раунд</span>
          <strong>{settings.roundDuration} сек</strong>
        </div>
        <div className={styles.panel}>
          <span>Цель</span>
          <strong>{settings.targetScore} очков</strong>
        </div>
        <div className={styles.panel}>
          <span>Штраф</span>
          <strong>{settings.skipPenalty ? 'Включен' : 'Выключен'}</strong>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Темы</h2>
        <div className={styles.themeList}>
          {selectedThemes.map((theme) => (
            <div className={styles.themeChip} key={theme.id}>
              <strong>{theme.name}</strong>
              <span>{theme.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Команды</h2>
        <div className={styles.teamList}>
          {teams.map((team, index) => (
            <div className={styles.teamRow} key={team.id}>
              <span>{index + 1}</span>
              <strong>{team.name}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <Button fullWidth onClick={onStartRound}>
          К экрану старта
        </Button>
        <Button fullWidth onClick={onEdit} variant="secondary">
          Изменить настройки
        </Button>
      </div>
    </Card>
  )
}
