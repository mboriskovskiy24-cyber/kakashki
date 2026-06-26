# Party Games

Современная браузерная платформа для игр в компании. Сейчас в проекте уже есть:

- `Alias`
- `Spyfall`

Проект построен на `React + TypeScript + Vite` и подготовлен к расширению через модульную архитектуру `src/games/*`.

## Локальный запуск

```bash
npm install
npm run dev
```

Сборка production-версии:

```bash
npm run build
```

Проверка линтера:

```bash
npm run lint
```

## Деплой на GitHub Pages

В проект уже добавлен workflow:

- [.github/workflows/deploy.yml](C:/Users/Zalman/Documents/New%20project/.github/workflows/deploy.yml)

Что нужно сделать:

1. Залить проект в репозиторий GitHub.
2. Убедиться, что основная ветка называется `main`.
3. Открыть `Settings -> Pages`.
4. В блоке `Build and deployment` выбрать `Source: GitHub Actions`.
5. Запушить изменения в `main`.

После этого GitHub сам:

- установит зависимости
- соберёт проект
- опубликует папку `dist` в GitHub Pages

## Почему сайт будет работать на GitHub Pages

- в проекте используется `HashRouter`, поэтому маршруты не ломаются на статическом хостинге
- в `vite.config.ts` уже включён `base: './'`, поэтому ассеты корректно подгружаются даже без отдельной настройки имени репозитория

## Структура игр

Новые игры добавляются через папку в `src/games/` и регистрацию в `src/games/index.ts`.
