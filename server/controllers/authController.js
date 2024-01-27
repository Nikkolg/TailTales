const User = require('../models/UserModel')
const bcrypt = require('bcryptjs')
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

            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                age: user.age,
                animalType: user.animalType,
                gender: user.gender,
                avatar: user.avatar,
            };

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

            await User.updateOne({ _id: user._id }, { currentUser: true });

            return res.json({
                message: 'Аутентификация успешна',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    age: user.age,
                    animalType: user.animalType,
                    gender: user.gender,
                    avatar: user.avatar,
                    currentUser: true,
                },
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async getCurrentUser(req, res) {
        try {
            const user = await User.findOne({ currentUser: true }, '-password');
            if (!user) {
                console.log('Пользователь не найден');
            }
            return res.json({ user });
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.find({}, '-password');
            return res.json({ users });
        } catch (error) {
            console.error('Ошибка при получении списка пользователей:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async logout(req, res) {
    try {
        const currentUser = await User.findOne({ currentUser: true });

        if (currentUser) {
            await User.updateOne({ _id: currentUser._id }, { currentUser: false });
            return res.json({ message: 'Выход выполнен успешно' });
        }

        return res.status(400).json({ message: 'Текущий пользователь не найден' });
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        res.status(500).json({ message: 'Сервер недоступен' });
    }
}
}

module.exports = new AuthController()