const {Router} = require('express')
const {check} = require('express-validator')
const authController = require('../controllers/authController')
const jwt = require('jsonwebtoken');

require('dotenv').config()

const authRouter = new Router();

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token || token === 'Bearer null') {
        return next();
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        return res.status(401).json({ message: 'Не авторизован' });
    }
};

authRouter.post(
    '/registration', 
    [
        check('email', 'Неверный email').isEmail(),
        check('password', 'Пароль должен быть не менее 5 и не более 15 символов').isLength({ min: 5, max: 15 }),
    ],
    authController.registration
)

authRouter.post('/', authController.auth);
authRouter.post('/addFriend', verifyToken, authController.addFriend);
authRouter.post('/removeFriend', verifyToken, authController.removeFriend);
authRouter.post('/newPost', verifyToken, authController.createNewPost);
authRouter.post('/deletePost', verifyToken, authController.deletePost);
authRouter.post('/getFriendsData', verifyToken, authController.getFriends);
authRouter.post('/likedPost', verifyToken, authController.likedPost);
authRouter.post('/dislikedPost', verifyToken, authController.dislikedPost);

authRouter.get('/currentUser', verifyToken, authController.getCurrentUser);
authRouter.get('/allUsers', verifyToken, authController.getAllUsers);
authRouter.get('/logout', verifyToken, authController.logout);
authRouter.get('/user/:userId', verifyToken, authController.getUserById);

authRouter.put('/updateCurrentUser', verifyToken, authController.updateCurrentUser);
authRouter.put('/editedPost', verifyToken, authController.editPost);

module.exports = authRouter;