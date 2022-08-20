const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')

module.exports = (req,res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({error: 'O token não foi fornecido'});
    }

    const tokenParts = authHeader.split(' ');

    if(!tokenParts.length === 2){
        return res.status(401).send({error: 'Esse Token não é valido'});
    }

    const [ scheme, token ] = tokenParts;

    if(!/^Bearer$^/i.test(scheme)){
        return res.status(401).send({error: 'Token no formato errado!!!'})
    }

    jwt.verify(token, authConfig.secrete, (err, decoded) => {
        if(err){
            return res.status(401).send({error: 'Token Inválido!'})
        }

        req.userId = decoded.id;

        return next()
    })
}