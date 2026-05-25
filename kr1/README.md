# KR1

Frontend + backend for a small "Dobry" juice store demo.

## What is included
- Express API with in-memory products list and Swagger UI
- React frontend that loads products from the API

## Run backend
```zsh
cd "/Users/artem/WebstormProjects/front-back all-pract/kr1/backend"
npm install
node app.js
```

## Run frontend
```zsh
cd "/Users/artem/WebstormProjects/front-back all-pract/kr1/frontend"
npm install
PORT=3001 npm start
```

## Ports
- Backend: http://localhost:3000
- Frontend: http://localhost:3001 (backend CORS expects this origin)

## API
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PATCH /api/products/:id
- DELETE /api/products/:id
- Swagger UI: http://localhost:3000/api-docs

## Helper scripts
There are two shell scripts in the repo root:
- kr1_back.sh
- kr1_front.sh

They use absolute paths, so update them if your workspace is elsewhere.

