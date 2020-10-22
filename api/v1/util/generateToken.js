require('dotenv').config();
const jwt = require('jsonwebtoken');

function generateToken(req, res) {

    const username = req.body.username;

    const user = {
        name: username
    }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({
        accessToken: accessToken
    })
}

module.exports = {
    generateToken
}