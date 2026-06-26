import { createHashRouter } from 'react-router-dom'
import { GamePage } from '../pages/GamePage'
import { HomePage } from '../pages/HomePage'

export const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/games/:gameId',
    element: <GamePage />,
  },
])
