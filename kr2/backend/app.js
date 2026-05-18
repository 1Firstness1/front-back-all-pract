const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

const JWT_SECRET = 'secret_key';
const REFRESH_SECRET = 'refresh_secret_key';

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

let refreshTokens = new Set();

app.use(express.json());

let users = [];

let products = [];

async function initializeUsers() {
    const adminPassword = await hashPassword('123');
    const sellerPassword = await hashPassword('123');
    const userPassword = await hashPassword('123');

    users.push(
        {
            id: nanoid(),
            email: 'admin@gmail.com',
            first_name: 'Admin',
            last_name: 'User',
            password: adminPassword,
            role: 'admin',
            isBlocked: false
        },
        {
            id: nanoid(),
            email: 'seller@gmail.com',
            first_name: 'Seller',
            last_name: 'User',
            password: sellerPassword,
            role: 'seller',
            isBlocked: false
        },
        {
            id: nanoid(),
            email: 'user@gmail.com',
            first_name: 'Regular',
            last_name: 'User',
            password: userPassword,
            role: 'user',
            isBlocked: false
        }
    );
}

initializeUsers();


function initializeProducts() {
    const seller = users.find((u) => u.role === 'seller');
    const admin = users.find((u) => u.role === 'admin');
    const createdBy = (seller || admin)?.id || 'system';

    const now = new Date().toISOString();

    products.push(
        {
            id: nanoid(),
            title: 'Iphone 17 Pro',
            category: 'Смартфоны',
            description: 'Полная фигня, не советую',
            price: 100000,
            image: 'data:image/jpeg;base64,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',
            createdBy,
            createdAt: now
        },
        {
            id: nanoid(),
            title: 'Xiaomi 17 Pro',
            category: 'Смартфоны',
            description: 'Имбина полная, всем советую',
            price: 70000,
            image: 'data:image/jpeg;base64,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',
            createdBy,
            createdAt: now
        },
        {
            id: nanoid(),
            title: 'Poco x3 Pro',
            category: 'Смартфоны и Пиротехника',
            description: 'Хорошая взрывчатка с умным экраном',
            price: 20000,
            image: 'data:image/jpeg;base64,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',
            createdBy,
            createdAt: now
        }
    );
}

initializeProducts();


async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}

function generateAccessToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role
        },
        REFRESH_SECRET,
        { expiresIn: REFRESH_EXPIRES_IN }
    );
}

function authMiddleware(req, res, next) {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function roleMiddleware(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const user = users.find(u => u.id === req.user.sub);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ error: 'User is blocked' });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }

        next();
    };
}

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API AUTH and PRODUCTS with RBAC',
            version: '1.0.0',
            description: 'API с системой ролей (RBAC)',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: ['./app.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
console.log(`Swagger UI доступен по адресу http://localhost:${port}/api-docs`);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя (доступно гостям)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 */
app.post('/api/auth/register', async (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    if (!email || !first_name || !last_name || !password) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    try {
        const hashedPassword = await hashPassword(password);

        const newUser = {
            id: nanoid(),
            email: email,
            first_name: first_name,
            last_name: last_name,
            password: hashedPassword,
            role: 'user',
            isBlocked: false
        };

        users.push(newUser);

        const userForResponse = { ...newUser };
        delete userForResponse.password;
        res.status(201).json(userForResponse);

    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя (доступно гостям)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная авторизация
 */
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    if (user.isBlocked) {
        return res.status(403).json({ error: 'Пользователь заблокирован' });
    }

    try {
        const isPasswordCorrect = await verifyPassword(password, user.password);

        if (isPasswordCorrect) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            refreshTokens.add(refreshToken);

            res.status(200).json({
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ error: 'Неверные учетные данные' });
        }
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Обновление пары токенов (доступно гостям)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешное обновление токенов
 */
app.post('/api/auth/refresh', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            error: "refreshToken is required"
        });
    }

    if (!refreshTokens.has(refreshToken)) {
        return res.status(401).json({
            error: "Invalid refresh token"
        });
    }

    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);

        const user = users.find((u) => u.id === payload.sub);
        if (!user) {
            return res.status(401).json({
                error: "User not found"
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({ error: 'User is blocked' });
        }

        refreshTokens.delete(refreshToken);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        refreshTokens.add(newRefreshToken);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });

    } catch (err) {
        return res.status(401).json({
            error: "Invalid or expired refresh token"
        });
    }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить данные текущего пользователя (доступно пользователям, продавцам, админам)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя
 */
app.get('/api/auth/me', authMiddleware, (req, res) => {
    const userId = req.user.sub;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (user.isBlocked) {
        return res.status(403).json({ error: 'User is blocked' });
    }

    res.json({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
    });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список всех пользователей (только для админа)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 */
app.get('/api/users', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получить пользователя по ID (только для админа)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Данные пользователя
 */
app.get('/api/users/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Обновить информацию пользователя (только для админа)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, seller, admin]
 *     responses:
 *       200:
 *         description: Пользователь обновлен
 */
app.put('/api/users/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, role } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (email && email !== users[userIndex].email) {
        const existingUser = users.find(u => u.email === email && u.id !== userId);
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }
    }

    users[userIndex] = {
        ...users[userIndex],
        first_name: first_name || users[userIndex].first_name,
        last_name: last_name || users[userIndex].last_name,
        email: email || users[userIndex].email,
        role: role || users[userIndex].role
    };

    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Заблокировать пользователя (только для админа)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь заблокирован
 */
app.delete('/api/users/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    const userId = req.params.id;

    // Нельзя заблокировать самого себя
    if (userId === req.user.sub) {
        return res.status(400).json({ error: 'Нельзя заблокировать самого себя' });
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    users[userIndex].isBlocked = true;
    res.json({ message: 'Пользователь заблокирован' });
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар (только для продавца и админа)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Товар успешно создан
 */
app.post('/api/products', authMiddleware, roleMiddleware(['seller', 'admin']), (req, res) => {
    const { title, category, description, price, image } = req.body;

    if (!title || !category || !description || price === undefined) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Поле price должно быть неотрицательным числом' });
    }

    const newProduct = {
        id: nanoid(),
        title,
        category,
        description,
        price,
        image: image || 'https://avatars.mds.yandex.net/get-mpic/11722550/2a0000019aa32d8e2d8b53732afd2b09c2fe/orig',
        createdBy: req.user.sub,
        createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров (доступно всем авторизованным пользователям)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список товаров
 */
app.get('/api/products', authMiddleware, roleMiddleware(['user', 'seller', 'admin']), (req, res) => {
    res.status(200).json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID (доступно всем авторизованным пользователям)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар найден
 */
app.get('/api/products/:id', authMiddleware, roleMiddleware(['user', 'seller', 'admin']), (req, res) => {
    const productId = req.params.id;
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    res.status(200).json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновить товар по ID (только для продавца и админа)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Товар обновлен
 */
app.put('/api/products/:id', authMiddleware, roleMiddleware(['seller', 'admin']), (req, res) => {
    const productId = req.params.id;
    const { title, category, description, price, image } = req.body;

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    const updatedProduct = {
        ...products[productIndex],
        title: title || products[productIndex].title,
        category: category || products[productIndex].category,
        description: description || products[productIndex].description,
        price: price !== undefined ? price : products[productIndex].price,
        image: image || products[productIndex].image,
        updatedAt: new Date().toISOString()
    };

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ error: 'Поле price должно быть неотрицательным числом' });
    }

    products[productIndex] = updatedProduct;
    res.status(200).json(updatedProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар по ID (только для админа)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар успешно удален
 */
app.delete('/api/products/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    products.splice(productIndex, 1);
    res.status(200).json({ message: 'Товар успешно удален' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});