import type { GameDefinition } from '../types/game'
import { AliasGame } from './alias/AliasGame'
import { SpyfallGame } from './spyfall/SpyfallGame'

// Register future games in this array.
// Any entry added here automatically appears on the home page and becomes routable.
export const games: GameDefinition[] = [
  {
    id: 'alias',
    name: 'Alias',
    description: 'Объясняйте слова, зарабатывайте очки и побеждайте своей командой.',
    tagline: 'Классическая словесная игра прямо в браузере',
    accent: 'linear-gradient(135deg, #7c3aed 0%, #facc15 100%)',
    icon: '🗣️',
    component: AliasGame,
  },
  {
    id: 'spyfall',
    name: 'Spyfall',
    description: 'Найдите шпиона раньше, чем он раскроет локацию.',
    tagline: 'Допросы, подозрения и тайные роли на одном устройстве',
    accent: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
    icon: '🕵️',
    component: SpyfallGame,
  },
]

export function getGameById(gameId: string) {
  return games.find((game) => game.id === gameId)
}
