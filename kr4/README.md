# Практическая работа №19
API для управления списком пользователей с использованием PostgreSQL и Swagger.
## Стек
- Node.js + Express
- PostgreSQL + Sequelize
- Swagger UI
## Установка и запуск
npm install
npm start
## API эндпоинты
| Метод | Адрес | Описание |
|---|---|---|
| POST | /api/users | Создать пользователя |
| GET | /api/users | Список пользователей |
| GET | /api/users/:id | Пользователь по ID |
| PATCH | /api/users/:id | Обновить пользователя |
| DELETE | /api/users/:id | Удалить пользователя |
## Скриншоты

### POST /api/users

<img width="954" height="852" alt="Снимок экрана 2026-05-07 в 14 13 19" src="https://github.com/user-attachments/assets/1082d456-ca94-48b4-a415-4583817beb34" />

### GET /api/users

<img width="950" height="643" alt="Снимок экрана 2026-05-07 в 14 21 21" src="https://github.com/user-attachments/assets/51390abd-6e94-4201-a5ee-998e38b63d57" />

### GET /api/users/:id

<img width="950" height="690" alt="Снимок экрана 2026-05-07 в 14 24 41" src="https://github.com/user-attachments/assets/b34c7394-eca7-4001-9728-fba16d1aba83" />

### PATCH /api/users/:id

<img width="712" height="755" alt="Снимок экрана 2026-05-07 в 14 26 04" src="https://github.com/user-attachments/assets/14e48ce7-c176-4a74-9e90-a617de615429" />

### DELETE /api/users/:id

<img width="1066" height="730" alt="Снимок экрана 2026-05-07 в 14 27 22" src="https://github.com/user-attachments/assets/e71fad53-2a41-4840-8a98-9b78b4b94031" />

# Практическая работа №20

API для управления списком пользователей с использованием MongoDB и Swagger.

## Стек

- Node.js + Express
- MongoDB + Mongoose
- Swagger UI

## Установка и запуск

npm install
npm start

Сервер: http://localhost:3000
Swagger: http://localhost:3000/api-docs

## База данных

MongoDB, коллекция `users`:

| Поле | Тип | Описание |
|---|---|---|
| _id | ObjectId | Уникальный идентификатор |
| first_name | String | Имя |
| last_name | String | Фамилия |
| age | Number | Возраст |
| created_at | Date | Время создания |
| updated_at | Date | Время обновления |

## API эндпоинты

| Метод | Адрес | Описание |
|---|---|---|
| POST | /api/users | Создать пользователя |
| GET | /api/users | Список пользователей |
| GET | /api/users/:id | Пользователь по ID |
| PATCH | /api/users/:id | Обновить пользователя |
| DELETE | /api/users/:id | Удалить пользователя |

## Скриншоты

### POST /api/users

<img width="608" height="801" alt="Снимок экрана 2026-05-11 в 15 47 10" src="https://github.com/user-attachments/assets/17125ca6-e7ee-43c7-9859-3b6ec77f5520" />

### GET /api/users

<img width="945" height="652" alt="Снимок экрана 2026-05-11 в 15 49 03" src="https://github.com/user-attachments/assets/57cdc90a-02c8-464f-b912-56fcf3b504ae" />

### GET /api/users/:id

<img width="823" height="610" alt="Снимок экрана 2026-05-11 в 15 51 34" src="https://github.com/user-attachments/assets/fe24bcc4-b01c-4145-b808-6fb650326a84" />

### PATCH /api/users/:id

<img width="550" height="586" alt="Снимок экрана 2026-05-11 в 15 52 51" src="https://github.com/user-attachments/assets/29d9fdc6-0df1-44c0-aebb-2aee9e425fac" />

### DELETE /api/users/:id

<img width="1099" height="742" alt="Снимок экрана 2026-05-11 в 15 53 40" src="https://github.com/user-attachments/assets/8abbba97-50e9-4937-9b5a-be44343ef5fa" />

# Практические работы №22-23

Балансировка нагрузки с Nginx, HAProxy и Docker Compose.

## Стек

- Node.js + Express
- Nginx (балансировщик)
- HAProxy (альтернативный балансировщик)
- Docker + Docker Compose

## Структура проекта

practices22-23/
├── docker-compose.yml
├── nginx.conf
├── backend/
│ ├── Dockerfile
│ ├── package.json
│ └── server.js
└── haproxy/
└── haproxy.cfg

## Установка и запуск

bash
docker compose up --build

## Backend серверы

Сервер	
Статус
backend1:3000	Основной
backend2:3000	Основной

## Проверка балансировки

curl http://localhost/
{"message":"Response from backend server","server":"backend-1","timestamp":"..."}

curl http://localhost/
{"message":"Response from backend server","server":"backend-2","timestamp":"..."}

curl http://localhost/
{"message":"Response from backend server","server":"backend-1","timestamp":"..."}

## Проверка отказоустойчивости

Остановить backend1

docker compose stop backend1

Запросы идут только на backend2

curl http://localhost/

{"server":"backend-2"}

curl http://localhost/

{"server":"backend-2"}

Вернуть backend1

docker compose start backend1

# Тестирование HAProxy
docker run -d --name haproxy \
  --network practices22-23_app-network \
  -p 8080:80 \
  -v $(pwd)/haproxy/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg \
  haproxy:latest

curl http://localhost:8080/
