import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../../components/Button/Button'
import { Card } from '../../../components/Card/Card'
import { spyfallCategoryOptions } from '../data/locations'
import type { SpyfallSettings } from '../types'
import { playMysteryActionSound } from '../../../utils/uiFeedback'
import styles from './SpyfallSettings.module.css'

interface SpyfallSettingsProps {
  customWords: string[]
  initialSettings: SpyfallSettings
  onAddCustomWord: (name: string) => void
  onRemoveCustomWord: (name: string) => void
  onResetSettings: () => void
  onStartGame: (settings: SpyfallSettings) => void
}

export function SpyfallSettings({
  customWords,
  initialSettings,
  onAddCustomWord,
  onRemoveCustomWord,
  onResetSettings,
  onStartGame,
}: SpyfallSettingsProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [customWordInput, setCustomWordInput] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)

  useEffect(() => {
    setSettings(initialSettings)
  }, [initialSettings])

  const errors = useMemo(
    () => ({
      categories:
        settings.enabledCategories.length === 0 ? 'Выберите хотя бы одну категорию.' : '',
    }),
    [settings.enabledCategories.length],
  )

  const hasErrors = Object.values(errors).some(Boolean)

  function toggleArrayValue<T extends string>(items: T[], value: T) {
    return items.includes(value) ? items.filter((item) => item !== value) : [...items, value]
  }

  function handleSubmit() {
    setSubmitAttempted(true)
    if (hasErrors) {
      return
    }

    onStartGame(settings)
  }

  return (
    <Card className={styles.card}>
      <p className={styles.eyebrow}>Spyfall</p>
      <h1>Настройте раунд перед показом слова</h1>
      <p className={styles.description}>
        Есть только две стороны: игроки, которые знают слово, и шпионы, которые слова не знают.
      </p>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Игроков</span>
          <select
            onChange={(event) =>
              setSettings((currentState) => ({
                ...currentState,
                playerCount: Number(event.target.value),
              }))
            }
            value={settings.playerCount}
          >
            {Array.from({ length: 10 }, (_, index) => index + 3).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Режим шпионов</span>
          <select
            onChange={(event) =>
              setSettings((currentState) => ({
                ...currentState,
                spyMode: event.target.value === 'random' ? 'random' : 'fixed',
              }))
            }
            value={settings.spyMode}
          >
            <option value="fixed">Фиксированное число</option>
            <option value="random">Случайное число</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Количество шпионов</span>
          <select
            disabled={settings.spyMode === 'random'}
            onChange={(event) =>
              setSettings((currentState) => ({
                ...currentState,
                spyCount: Number(event.target.value),
              }))
            }
            value={settings.spyCount}
          >
            {Array.from({ length: settings.playerCount + 1 }, (_, index) => index).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.infoField}>
          <span>Темп раунда</span>
          <strong>Без таймера</strong>
          <small>Обсуждайте столько, сколько нужно, и завершайте раунд вручную.</small>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Категории</h2>
          <span>{settings.enabledCategories.length} выбрано</span>
        </div>
        <div className={styles.optionsGrid}>
          {spyfallCategoryOptions.map((category) => {
            const selected = settings.enabledCategories.includes(category.id)
            return (
              <button
                className={[styles.optionCard, selected ? styles.optionCardSelected : ''].filter(Boolean).join(' ')}
                key={category.id}
                onClick={() =>
                  setSettings((currentState) => ({
                    ...currentState,
                    enabledCategories: toggleArrayValue(currentState.enabledCategories, category.id),
                  }))
                }
                type="button"
              >
                <strong>{category.name}</strong>
                <span>{category.description}</span>
              </button>
            )
          })}
        </div>
        {submitAttempted && errors.categories ? <small className={styles.error}>{errors.categories}</small> : null}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Свои слова</h2>
          <span>{customWords.length} добавлено</span>
        </div>
        <div className={styles.customRow}>
          <input
            onChange={(event) => setCustomWordInput(event.target.value)}
            placeholder="Например: Марсианин"
            type="text"
            value={customWordInput}
          />
          <Button
            onClick={() => {
              onAddCustomWord(customWordInput)
              setCustomWordInput('')
            }}
            variant="secondary"
          >
            Добавить
          </Button>
        </div>
        {customWords.length > 0 ? (
          <div className={styles.customList}>
            {customWords.map((word) => (
              <div className={styles.customItem} key={word}>
                <span>{word}</span>
                <Button onClick={() => onRemoveCustomWord(word)} variant="danger">
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Собственные слова пока не добавлены.</p>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          fullWidth
          onClick={() => {
            playMysteryActionSound()
            handleSubmit()
          }}
        >
          Начать игру
        </Button>
        <Button fullWidth onClick={onResetSettings} variant="ghost">
          Сбросить настройки
        </Button>
      </div>
    </Card>
  )
}
