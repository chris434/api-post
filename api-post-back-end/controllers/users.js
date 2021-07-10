const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db/db-config')
require('dotenv').config()

exports.signup = async(req, res) => {
    const { name, email, password } = req.body
    console.log(req.body)
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await pool.query(`INSERT INTO users (name, email, user_password) VALUES($1,$2,$3)`, [name, email, hashedPassword])
        return res.status(200).json('user created')
    } catch (e) {
        if (e.constraint === 'users_email_key') {
            return res.status(401).json('email already exists')
        }
        console.log(error)
    }
}
exports.login = async(req, res) => {
    const { email, password } = req.body
    try {
        const user = await pool.query('SELECT * FROM users WHERE email=$1', [email])
        if (!user.rows[0]) throw new Error('email not regressed')

        const comperedPassword = await bcrypt.compare(password, user.rows[0].user_password)
        if (!comperedPassword) throw new Error('email or password incorrect')

        const payLoad = { id: user.rows[0].id }
        const token = jwt.sign(payLoad, process.env.SECRET_TOKEN, { expiresIn: '24h' })
        res.status(200).json({ token: token })

    } catch (error) {
        res.status(401).json(error.message)
    }
}