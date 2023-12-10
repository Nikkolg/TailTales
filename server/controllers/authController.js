const User = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')


class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Uncorrect request', errors})
            }
            const {email, password} = req.body
            const userCheck = await User.findOne({email})

            if (userCheck) {
                return res.status(400).json({message: `The user with email ${email} already exists. Please use a different email or log in`})
            }

            const hashPassword = await bcrypt.hash(password, 20)
            const user = new User({email, password: hashPassword})
            await user.save()
            return res.json({message: 'User was created'})
        } catch (e) {
            console.log(e)
            res.send({message: 'Server error'})
        }
    }
}

module.exports = new AuthController()