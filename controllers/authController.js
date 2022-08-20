const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../controllers/config/auth')

const User = require('../models/User');

const router = express.Router();

function tokenGenerater(params = {}){
   return jwt.sign({id: User.id}, authConfig.secret, {
        expiresIn: 86400,
    } )
}

router.post('/register', async (req, res) => {
    try {

    if(await User.findOne( {email})){
        return res.status(400).send({error: 'Email já cadastrado!'})}
    

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({user, token: tokenGenerater({id: user.id})})

    }catch(err){
        return res.status(400).send({error: 'Falha ao cadastrar '})
    }
})

router.post('/authenticate', async (req, res) => {
    const  {email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        res.status(400).send({error: 'Usuário não encontrado'});
    }
    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({error: 'Senha inválida!'})
    }
    user.password = undefined;


    res.send({user, token: tokenGenerater({id: user.id})});
})

module.exports = app => app.use('/auth', router);