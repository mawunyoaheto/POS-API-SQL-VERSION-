require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next){

    const authHeader = req.headers['authorization']
    console.log('Auth-Header', authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    console.log('print-token', token)
    if (token == null){ 
        
        console.log('token','Token returned null')

        return res.sendStatus(401)
    }

    const user = process.env.API_USER
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user )=>{

        if (err){ 
            
            console.log('verify','verification failed')
            return res.sendStatus(403)
        }

        req.user = user
        next()
    })
}

module.exports={
    authenticateToken
}