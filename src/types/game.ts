import type { ComponentType } from 'react'

export interface GameDefinition {
  id: string
  name: string
  description: string
  tagline: string
  accent: string
  icon?: string
  component: ComponentType
}
