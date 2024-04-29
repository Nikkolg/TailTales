const User = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const checkUserAndPost = async (userId, postId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("Пользователь не найден");
    }

    const owner = await User.findOne({ 'posts._id': postId });
    if (!owner) {
        throw new Error("Пост не найден");
    }

    const post = owner.posts.find(p => p._id.toString() === postId);
    if (!post) {
        throw new Error("Пост не найден");
    }

    return { user, post };
};

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

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '3h' }
            );

            return res.json({
                message: 'Аутентификация успешна',
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
            const user = await User.findById(req.userId);   
            
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

    async getFriends(req, res) {
        try {
            const { friendId } = req.body;
            const friendsData = await User.find({ _id: { $in: friendId } }, '-password');
            return res.json({ friendsData });
        } catch (error) {
            console.error('Ошибка при получении данных о друзьях:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async getUserById(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId, '-password');
            
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
    
            return res.json({ user });
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async logout(req, res) {
    try {
        res.setHeader('Authorization', '');
        return res.json({ message: 'Выход выполнен успешно' });
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        res.status(500).json({ message: 'Сервер недоступен' });
    }
}

    async updateCurrentUser(req, res) {
        try {
            const userId = req.userId;
            await User.updateOne({ _id: userId }, { ...req.body });
            return res.json({ message: 'Данные пользователя успешно обновлены' });
        } catch (error) {
            console.error('Ошибка при обновлении данных пользователя на сервере:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async addFriend(req, res) {
        try {
            const userId = req.userId;
            const { friendId } = req.body;
            const friendUser = await User.findOne({ _id: friendId });

            if (!friendUser) {
                return res.status(404).json({ message: 'Пользователь с указанным id не найден' });
            }

            const currentUser = await User.findById(userId);
            
            if (!currentUser) {
                return res.status(400).json({ message: 'Текущий пользователь не найден' });
            }

            if (currentUser.friends.includes(friendUser._id)) {
                return res.status(400).json({ message: 'Пользователь уже является вашим другом' });
            }

            await User.updateOne({ _id: userId }, { $push: { friends: friendUser._id } });

            return res.json({ message: 'Пользователь успешно добавлен в друзья' });
        } catch (error) {
            console.error('Ошибка при добавлении друга:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async removeFriend(req, res) {
        try {
            const userId = req.userId;
            const { friendId } = req.body;

            const friendUser = await User.findOne({ _id: friendId });

            if (!friendUser) {
                return res.status(404).json({ message: 'Пользователь с указанным id не найден' });
            }

            await User.updateOne({ _id: userId }, { $pull: { friends: friendUser._id } });

            return res.json({ message: 'Пользователь успешно удален из друзей' });
        } catch (error) {
                console.error('Ошибка при удалении друга:', error);
                return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async createNewPost(req, res) {
        try {
            const userId = req.userId;
            const { title, text, visibility } = req.body;

            const newPost = {
                title,
                text,
                visibility,
            };

            await User.updateOne({ _id: userId }, { $push: { posts: newPost } });

            return res.json({ message: 'Пост успешно добавлен' });
        } catch (error) {
            console.error('Ошибка при добавлении нового поста:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async deletePost(req, res) {
        try {
            const userId = req.userId;
            const { postId } = req.body;

            if (!postId) {
                return res.status(400).json({ message: 'Пост для удаления не найден' });
            }

            await User.updateOne({ _id: userId }, { $pull: { posts: { _id: postId } } });

            return res.json({ message: 'Пост успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении поста:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async editPost(req, res) {
        try {
            const userId = req.userId;
            const {_id, ...updatedFields } = req.body;

            await User.updateOne(
                { _id: userId, 'posts._id': _id },
                { $set: { 'posts.$.title': updatedFields.title, 'posts.$.text': updatedFields.text, 'posts.$.visibility': updatedFields.visibility } }
            );

            return res.json({ message: 'Пост успешно обновлен' });
        } catch (error) {
            console.error('Ошибка при обновлении поста на сервере:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async likedPost(req, res) {
        try {
            const { postId, userId } = req.body;

            const { user, post } = await checkUserAndPost(userId, postId);

            if (post.dislikes.includes(userId)) {
                return res.status(400).json({ message: 'Пользователь уже поставил "Dislike", нельзя поставить "Like"' });
            }

            const isLiked = post.likes.includes(userId);

            if (isLiked) {
                await User.updateOne(
                    { 'posts._id': postId },
                    { $pull: { 'posts.$.likes': userId } }
                );
                return res.json({ message: 'Лайк успешно удален с поста' });
            } else {
                await User.updateOne(
                    { 'posts._id': postId },
                    { $push: { 'posts.$.likes': userId } }
                );
                return res.json({ message: 'Лайк успешно добавлен к посту' });
            }
        } catch (error) {
            console.error('Ошибка при лайке поста:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

    async dislikedPost(req, res) {
        try {
            const { postId, userId } = req.body;

            const { user, post } = await checkUserAndPost(userId, postId);

            if (post.likes.includes(userId)) {
                return res.status(400).json({ message: 'Пользователь уже поставил "Like", нельзя поставить "Dislike"' });
            }

            const isDisliked = post.dislikes.includes(userId);

            if (isDisliked) {
                await User.updateOne(
                    { 'posts._id': postId },
                    { $pull: { 'posts.$.dislikes': userId } }
                );
                return res.json({ message: 'Dislike успешно удален с поста' });
            } else {
                await User.updateOne(
                    { 'posts._id': postId },
                    { $push: { 'posts.$.dislikes': userId } }
                );
                return res.json({ message: 'Dislike успешно добавлен к посту' });
            }
        } catch (error) {
            console.error('Ошибка при отправке dislike:', error);
            return res.status(500).json({ message: 'Сервер недоступен' });
        }
    }

}

module.exports = new AuthController()