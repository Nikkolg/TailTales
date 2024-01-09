const {Router} = require('express')
const authController = require('../controllers/authController')
const {check} = require('express-validator')

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

authRouter.post(
    '/', 
    authController.auth
)

module.exports = authRouter