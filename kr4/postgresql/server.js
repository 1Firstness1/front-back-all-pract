// kr4/practice 19/server.js
const express = require('express');
const sequelize = require('./db/connection');
const userRoutes = require('./routes/users');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Swagger
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Practice 19 API',
            version: '1.0.0',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./routes/*.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/users', userRoutes);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        // Создаст таблицы из моделей (в т.ч. users) в пустой БД.
        // ВНИМАНИЕ: force: true удалит таблицы и создаст заново (удалит данные).
        await sequelize.sync({ force: true });
        console.log('✅ Database synced (tables created)');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
        });
    } catch (err) {
        console.error('❌ Connection error:', err);
    }
})();
