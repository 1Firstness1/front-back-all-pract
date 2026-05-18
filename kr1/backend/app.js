const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API магазина соков "Добрый"',
            version: '1.0.0',
            description: 'API для управления товарами интернет-магазина соков "Добрый"',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID товара
 *         name:
 *           type: string
 *           description: Название сока
 *         category:
 *           type: string
 *           description: Категория (Соки, Нектары, Морсы)
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена в $
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *         rating:
 *           type: number
 *           description: Рейтинг (0-5)
 *         image:
 *           type: string
 *           description: URL изображения
 *       example:
 *         id: "abc123"
 *         name: "Сок Добрый Апельсиновый"
 *         category: "Соки"
 *         description: "Апельсиновый сок, 1л"
 *         price: 1.99
 *         stock: 45
 *         rating: 4.8
 *         image: "https://example.com/juice.jpg"
 */

let products = [
    { id: nanoid(6), name: 'Сок "Добрый" Апельсиновый', category: 'Соки', description: 'Апельсиновый сок, 1л', price: 1.99, stock: 45, rating: 5, image: 'data:image/jpeg;base64,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' },
    { id: nanoid(6), name: 'Сок "Добрый" Яблочный', category: 'Соки', description: 'Яблочный сок, 1л', price: 1.79, stock: 50, rating: 4.9, image: 'data:image/jpeg;base64,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' },
    { id: nanoid(6), name: 'Сок "Добрый" Вишневый', category: 'Соки', description: 'Вишневый сок, 1л', price: 2.29, stock: 30, rating: 4.4, image: 'https://halar.ru/wp-content/uploads/vishnevyj-1-1000x1000.png' },
    { id: nanoid(6), name: 'Сок "Добрый" Мультифрукт', category: 'Соки', description: 'Мультифруктовый сок, 1л', price: 2.19, stock: 35, rating: 4.8, image: 'https://halar.ru/wp-content/uploads/multifrukt.png' },
    { id: nanoid(6), name: 'Сок "Добрый" Томатный', category: 'Соки', description: 'Томатный сок, 1л', price: 1.89, stock: 25, rating: 4.2, image: 'data:image/jpeg;base64,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' },
    { id: nanoid(6), name: 'Сок "Добрый" Ананасовый', category: 'Соки', description: 'Ананасовый сок, 1л', price: 2.49, stock: 15, rating: 4.6, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1Jdm5CbCoWdekI1KVk_qBYhx8xXndFkRvyA&s' },
];

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3001" }));

// Логирование
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех соков
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get("/api/products", (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;
    res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создает новый товар (сок)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название сока
 *               category:
 *                 type: string
 *                 description: Категория
 *               description:
 *                 type: string
 *                 description: Описание
 *               price:
 *                 type: number
 *                 description: Цена
 *               stock:
 *                 type: integer
 *                 description: Количество на складе
 *               rating:
 *                 type: number
 *                 description: Рейтинг (0-5)
 *               image:
 *                 type: string
 *                 description: URL изображения
 *     responses:
 *       201:
 *         description: Товар создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в данных
 */
app.post("/api/products", (req, res) => {
    const { name, category, description, price, stock, rating, image } = req.body;

    if (!name?.trim() || !category?.trim() || !description?.trim()) {
        return res.status(400).json({ error: "Name, category and description are required" });
    }

    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        rating: Number(rating) || 0,
        image: image?.trim() || 'https://cleanshop.ru/i/no_image.gif'
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет данные товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обновленный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *       404:
 *         description: Товар не найден
 */
app.patch("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;

    const { name, category, description, price, stock, rating, image } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);
    if (image !== undefined) product.image = image.trim();

    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет тела ответа)
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const exists = products.some(p => p.id === id);
    if (!exists) return res.status(404).json({ error: "Product not found" });

    products = products.filter(p => p.id !== id);
    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger документация: http://localhost:${port}/api-docs`);
});