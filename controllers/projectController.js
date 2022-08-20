const express = require('express');
const authMidleware = require('../controllers/midlewares/auth')

const router = express.Router();

router.use(authMidleware);

router.get('/', (req,res) => {
    res.send({ok: 'true'})
})


module.exports = app => app.use('/projects', router)