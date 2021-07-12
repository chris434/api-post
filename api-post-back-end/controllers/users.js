const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db/db-config')
require('dotenv').config()

exports.signup = async(req, res) => {
    const { name, email, password } = req.body
    console.log(req.body)
    try {
        if (!req.body.password) throw new Error('password is required')

        const hashedPassword = await bcrypt.hash(password, 10)
        const id = await pool.query(`INSERT INTO users (name, email, user_password) VALUES($1,$2,$3) RETURNING (user_id)`, [name, email, hashedPassword])
        const payLoad = { id: id.rows[0].id }
        const token = jwt.sign(payLoad, process.env.SECRET_TOKEN, { expiresIn: '24h' })
        return res.status(200).json({ token, message: 'user created' })
    } catch (e) {

        if (e.constraint === 'users_email_key') return res.status(401).json({ errorType: 'email', message: 'email already exists' })

        if (e.column === 'name') return res.status(401).json({ errorType: 'name', message: 'name is required' })

        return res.status(401).json(e.message)
    }
}
exports.login = async(req, res) => {
    const { email, password } = req.body
    try {
        console.log(req.body)
        const user = await pool.query('SELECT * FROM users WHERE email=$1', [email])
        if (!user.rows[0]) throw new Error(JSON.stringify({ errorType: 'email', message: 'email not regressed' }))

        const comperedPassword = await bcrypt.compare(password, user.rows[0].user_password)
        if (!comperedPassword) throw new Error(JSON.stringify({ errorType: 'password', message: 'email or password incorrect' }))

        const payLoad = { id: user.rows[0].id }
        const token = jwt.sign(payLoad, process.env.SECRET_TOKEN, { expiresIn: '24h' })
        res.status(200).json({ token })

    } catch (error) {
        res.status(401).json(JSON.parse(error.message))
    }
}