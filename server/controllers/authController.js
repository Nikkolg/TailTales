const User = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')


class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Uncorrect request', errors });
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
                    message: `The user with email ${email} already exists. Please use a different email or log in`,
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

            return res.json({ message: 'User was created' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async auth(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            const isPassValid = bcrypt.compareSync(password, user.password);
            if (!isPassValid) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '2h' });

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
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new AuthController()