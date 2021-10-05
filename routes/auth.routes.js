const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const router = Router()
const config = require('config')


// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Not valid email').isEmail(),
        check('password', 'Minimum length for passs is 6 symbols')
            .isLength({min: 6})
    ],
    async (req, res) => {
    try {
        console.log('Body: ', req.body)
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: "This user already exist"})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword})

        await user.save()

        res.status(201).json({message: 'User created'})

    } catch(e) {
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {

    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})

        if(!user) {
            return res.status(400).json({message: 'Пользователь не найден'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )

        res.json({ token, userId: user.id })

    } catch(e) {
        res.status(500).json({message: 'Something went wrong, try again'})
    }
})

module.exports = router