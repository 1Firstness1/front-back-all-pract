# KR3

Приложение заметок в реальном времени на Socket.IO с push-уведомлениями.

## Что включено
- Backend на Express с Socket.IO и web-push
- Статический frontend с service worker
- Заметки и напоминания с откладыванием на 5 минут

## Запуск backend
```zsh
cd "/Users/artem/WebstormProjects/front-back all-pract/kr3/backend"
npm install
npm start
```

## Запуск frontend
```zsh
cd "/Users/artem/WebstormProjects/front-back all-pract/kr3/frontend"
npm install
npm start
```

## Порты
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Эндпоинты backend
- POST /subscribe
- POST /unsubscribe
- POST /snooze?reminderId=ID

## Примечания
- Push-уведомления работают на localhost (или по HTTPS). Разрешите уведомления в браузере.
- VAPID-ключи захардкожены в backend (как в учебном проекте).

## Вспомогательные скрипты
В корне репозитория есть два shell-скрипта:
- kr3_back.sh
- kr3_front.sh

Они используют абсолютные пути, поэтому при другой директории проекта их нужно обновить.
