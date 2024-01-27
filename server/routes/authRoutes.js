const {Router} = require('express')
const {check} = require('express-validator')
const authController = require('../controllers/authController')


require('dotenv').config()


const authRouter = new Router();

authRouter.post(
    '/registration', 
    [
        check('email', 'Неверный email').isEmail(),
        check('password', 'Пароль должен быть не менее 5 и не более 15 символов').isLength({ min: 5, max: 15 }),
    ],
    authController.registration
)

authRouter.post('/', authController.auth)

authRouter.get('/currentUser', authController.getCurrentUser);

authRouter.get('/allUsers', authController.getAllUsers);

module.exports = authRouter