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

            console.log(user);

            await user.save();

            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                age: user.age,
                animalType: user.animalType,
                gender: user.gender,
                avatar: user.avatar,
                currentUser: false,
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

    async updateCurrentUser(req, res) {
        try {
            const currentUser = await User.findOne({ currentUser: true });

            if (!currentUser) {
                return res.status(400).json({ message: 'Текущий пользователь не найден' });
            }

            await User.updateOne({ _id: currentUser._id }, { ...req.body, currentUser: true });

            return res.json({ message: 'Данные пользователя успешно обновлены' });
        } catch (error) {
            console.error('Ошибка при обновлении данных пользователя на сервере:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async addFriend(req, res) {
        try {
            const currentUser = await User.findOne({ currentUser: true });
            const { friendId } = req.body;


            if (!currentUser) {
                return res.status(400).json({ message: 'Текущий пользователь не найден' });
            }

            const friendUser = await User.findOne({ _id: friendId });

            if (!friendUser) {
                return res.status(404).json({ message: 'Пользователь с указанным id не найден' });
            }

            if (currentUser.friends.includes(friendUser._id)) {
                return res.status(400).json({ message: 'Пользователь уже является вашим другом' });
            }

            await User.updateOne({ _id: currentUser._id }, { $push: { friends: friendUser._id } });

            return res.json({ message: 'Пользователь успешно добавлен в друзья' });
        } catch (error) {
                console.error('Ошибка при добавлении друга:', error);
                return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async removeFriend(req, res) {
        try {
            const currentUser = await User.findOne({ currentUser: true });
            const { friendId } = req.body;


            if (!currentUser) {
                return res.status(400).json({ message: 'Текущий пользователь не найден' });
            }

            const friendUser = await User.findOne({ _id: friendId });

            if (!friendUser) {
                return res.status(404).json({ message: 'Пользователь с указанным id не найден' });
            }


            await User.updateOne({ _id: currentUser._id }, { $pull: { friends: friendUser._id } });

            return res.json({ message: 'Пользователь успешно удален из друзей' });
        } catch (error) {
                console.error('Ошибка при удалении друга:', error);
                return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async createNewPost(req, res) {
        try {
            const currentUser = await User.findOne({ currentUser: true });

            console.log(currentUser);

            if (!currentUser) {
                return res.status(400).json({ message: 'Текущий пользователь не найден' });
            }

            const { title, text, visibility } = req.body;

            const newPost = {
                title,
                text,
                visibility,
            };

            currentUser.posts.push(newPost);

            await currentUser.save();

            return res.json({ message: 'Пост успешно добавлен' });
        } catch (error) {
            console.error('Ошибка при добавлении нового поста:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async deletePost(req, res) {
        try {
            const currentUser = await User.findOne({ currentUser: true });
            console.log('1234');
            if (!currentUser) {
                return res.status(400).json({ message: 'Текущий пользователь не найден' });
            }

            const { postId } = req.body;
            console.log(postId);

            if (!postId) {
                return res.status(400).json({ message: 'Пост для удаления не найден' });
            }

            await User.updateOne(
                { _id: currentUser._id },
                { $pull: { posts: { _id: postId } } }
            );

            return res.json({ message: 'Пост успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении поста:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async editPost(req, res) {
        try {
            const currentUser = await User.findOne({ currentUser: true });
    
            if (!currentUser) {
                return res.status(400).json({ message: 'Текущий пользователь не найден' });
            }

            const { _id, ...updatedFields } = req.body;


            await User.updateOne(
                { _id: currentUser._id, 'posts._id': _id },
                { $set: { 'posts.$': { ...currentUser.posts.id(_id)._doc, ...updatedFields } } }
            );
    
            await currentUser.save();

            return res.json({ message: 'Данные пользователя успешно обновлены' });
        } catch (error) {
            console.error('Ошибка при обновлении данных пользователя на сервере:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    
}

module.exports = new AuthController()