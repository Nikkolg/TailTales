const User = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')


class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Неверный запрос', errors });
            }

            const {
                name,
                email,
                password,
                animalType = 'other',
                age = null,
                gender = 'other',
            } = req.body;

            const userCheck = await User.findOne({ email });
            if (userCheck) {
                return res.status(400).json({
                    message: `Пользователь с email ${email} уже существует. Пожалуйста введите другой email или авторизируйтесь`,
                });
            }

            const hashPassword = await bcrypt.hash(password, 6);

            const user = new User({
                name,
                email,
                password: hashPassword,
                animalType,
                age,
                gender,
            });

            await user.save();

            return res.json({ message: 'Пользователь создан' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async auth(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }

            const isPassValid = bcrypt.compareSync(password, user.password);
            if (!isPassValid) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '2h' });
            console.log(`Создан токен ${token}`);
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    age: user.age,
                    animalType: user.animalType,
                    gender: user.gender,
                    avatar: user.avatar,
                },
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async getCurrentUser(req, res) {
        try {
            res.json(req.user);
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            res.status(500).json({ message: 'Сервер недоступен' });
        }
    }
}

module.exports = new AuthController()