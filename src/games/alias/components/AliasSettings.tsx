import { useMemo, useState } from 'react'
import { Button } from '../../../components/Button/Button'
import { Card } from '../../../components/Card/Card'
import { aliasThemes } from '../data/words'
import type { AliasSettings } from '../types'
import styles from './AliasSettings.module.css'

interface AliasSettingsProps {
  initialSettings: AliasSettings
  onStartGame: (settings: AliasSettings) => void
}

export function AliasSettings({ initialSettings, onStartGame }: AliasSettingsProps) {
  const [teamCount, setTeamCount] = useState(initialSettings.teamNames.length)
  const [teamNames, setTeamNames] = useState(initialSettings.teamNames)
  const [roundDuration, setRoundDuration] = useState(initialSettings.roundDuration)
  const [targetScore, setTargetScore] = useState(initialSettings.targetScore)
  const [skipPenalty, setSkipPenalty] = useState(initialSettings.skipPenalty)
  const [themes, setThemes] = useState(initialSettings.themes)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const errors = useMemo(() => {
    const trimmedNames = teamNames.slice(0, teamCount).map((name) => name.trim())
    const isTeamCountValid = Number.isFinite(teamCount) && teamCount >= 2
    const isRoundDurationValid = Number.isFinite(roundDuration) && roundDuration >= 15
    const isTargetScoreValid = Number.isFinite(targetScore) && targetScore >= 5

    return {
      teamCount: !isTeamCountValid ? 'Нужно минимум 2 команды.' : '',
      teamNames:
        !isTeamCountValid || trimmedNames.some((name) => name.length === 0)
          ? 'Заполните названия всех команд.'
          : '',
      themes: themes.length === 0 ? 'Выберите хотя бы одну тему.' : '',
      roundDuration: !isRoundDurationValid ? 'Раунд должен длиться минимум 15 секунд.' : '',
      targetScore: !isTargetScoreValid ? 'Цель игры должна быть минимум 5 очков.' : '',
    }
  }, [roundDuration, targetScore, teamCount, teamNames, themes])

  const hasErrors = Object.values(errors).some(Boolean)

  function updateTeamCount(nextCount: number) {
    if (!Number.isFinite(nextCount)) {
      setTeamCount(0)
      return
    }

    setTeamCount(nextCount)
    setTeamNames((currentNames) => {
      const nextNames = [...currentNames]
      while (nextNames.length < nextCount) {
        nextNames.push(`Команда ${nextNames.length + 1}`)
      }
      return nextNames.slice(0, nextCount)
    })
  }

  function handleSubmit() {
    setSubmitAttempted(true)

    if (hasErrors) {
      return
    }

    onStartGame({
      teamNames: teamNames.slice(0, teamCount).map((name) => name.trim()),
      roundDuration,
      targetScore,
      skipPenalty,
      themes,
    })
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Настройки Alias</p>
          <h1>Подготовьте игру за минуту</h1>
        </div>
        <p className={styles.description}>
          Настройте команды, темп партии и правила пропуска. После этого можно сразу
          начинать раунд.
        </p>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Количество команд</span>
          <input
            min={2}
            onChange={(event) => updateTeamCount(Number(event.target.value))}
            type="number"
            value={teamCount}
          />
          {submitAttempted && errors.teamCount ? <small>{errors.teamCount}</small> : null}
        </label>

        <label className={styles.field}>
          <span>Длительность раунда (сек)</span>
          <input
            min={15}
            onChange={(event) => setRoundDuration(Number(event.target.value))}
            type="number"
            value={roundDuration}
          />
          {submitAttempted && errors.roundDuration ? <small>{errors.roundDuration}</small> : null}
        </label>

        <label className={styles.field}>
          <span>Целевой счет</span>
          <input
            min={5}
            onChange={(event) => setTargetScore(Number(event.target.value))}
            type="number"
            value={targetScore}
          />
          {submitAttempted && errors.targetScore ? <small>{errors.targetScore}</small> : null}
        </label>

        <label className={[styles.field, styles.switchField].join(' ')}>
          <span>Штраф за пропуск</span>
          <button
            aria-pressed={skipPenalty}
            className={[styles.toggle, skipPenalty ? styles.toggleOn : ''].filter(Boolean).join(' ')}
            onClick={() => setSkipPenalty((currentValue) => !currentValue)}
            type="button"
          >
            <span>{skipPenalty ? 'Включен' : 'Выключен'}</span>
          </button>
        </label>
      </div>

      <div className={styles.themes}>
        <div className={styles.teamHeader}>
          <h2>Темы слов</h2>
          <span>{themes.length} выбрано</span>
        </div>
        <div className={styles.themeGrid}>
          {aliasThemes.map((theme) => {
            const selected = themes.includes(theme.id)

            return (
              <button
                className={[styles.themeCard, selected ? styles.themeCardSelected : ''].filter(Boolean).join(' ')}
                key={theme.id}
                onClick={() =>
                  setThemes((currentThemes) =>
                    currentThemes.includes(theme.id)
                      ? currentThemes.filter((item) => item !== theme.id)
                      : [...currentThemes, theme.id],
                  )
                }
                type="button"
              >
                <strong>{theme.name}</strong>
                <span>{theme.description}</span>
              </button>
            )
          })}
        </div>
        {submitAttempted && errors.themes ? <small className={styles.error}>{errors.themes}</small> : null}
      </div>

      <div className={styles.teams}>
        <div className={styles.teamHeader}>
          <h2>Названия команд</h2>
          <span>{teamCount} команды</span>
        </div>
        <div className={styles.teamGrid}>
          {Array.from({ length: teamCount }).map((_, index) => (
            <label className={styles.field} key={`team-${index + 1}`}>
              <span>Команда {index + 1}</span>
              <input
                onChange={(event) =>
                  setTeamNames((currentNames) =>
                    currentNames.map((name, nameIndex) =>
                      nameIndex === index ? event.target.value : name,
                    ),
                  )
                }
                type="text"
                value={teamNames[index] ?? ''}
              />
            </label>
          ))}
        </div>
        {submitAttempted && errors.teamNames ? <small className={styles.error}>{errors.teamNames}</small> : null}
      </div>

      <Button fullWidth onClick={handleSubmit}>
        Начать игру
      </Button>
    </Card>
  )
}
