const {Router} = require('express')
const authController = require('../controllers/authController')
const {check} = require('express-validator')

require('dotenv').config()


const authRouter = new Router();

authRouter.post(
    '/registration', 
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password', 'Password must be longer than 5 and shorter than 15').isLength({ min: 5, max: 15 }),
    ],
    authController.registration
)

authRouter.post(
    '/login', 
    authController.auth
)

module.exports = authRouter