const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const fs = require('fs')

module.exports = app => {

    const publicKey = fs.readFileSync('./public.key', 'utf8');
    const privateKey = fs.readFileSync('./private.key', 'utf8');

    const signin = async(req, res) => {

        if (!req.body.user || !req.body.password) {
            return res.status(400).send('Informe um usuário e senha!')
        }

        if ((req.body.user != 0) && ((req.body.user.indexOf("@") < 1) || (req.body.user.indexOf('.') < 7))) {

            var user = await app.db('users')
                .where({ logname: req.body.user })
                .first()
            if (!user) return res.status(400).send('Usuário não encontrado')

            const isMatch = bcrypt.compareSync(req.body.password, user.password)

            if (!isMatch) return res.status(401).send('Usuário/senha inválidos')
        } else {
            var user = await app.db('users')
                .where({ email: req.body.user })
                .first()
            if (!user) return res.status(400).send('Email não encontrado')

            const isMatch = bcrypt.compareSync(req.body.password, user.password)
            if (!isMatch) return res.status(401).send('Email/senha inválidos')
        }

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            iduser: user.iduser,
            name: user.name,
            logname: user.logname,
            email: user.email,
            su: user.su,
            manager: user.manager,
            cashier: user.cashier,
            waiter: user.waiter,
            application: user.application
        }

        const token = jwt.sign({...payload }, privateKey, {
            algorithm: "RS256",
            expiresIn: 60 * 60 * 24 * 3
        });
        res.status(200).send({ auth: true, token: token });

    }


    const logout = (req, res) => {
        res.status(200).send({ auth: false, token: null });
    }

    const verify = (req, res, next) => {
        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).send("Token de validação não encontrado");


        jwt.verify(token, publicKey, { algorithm: ["RS256"] }, function(err, decoded) {
            if (err) return res.status(500).send("Token de validação inválido/expirado");

            req.user = {...decoded };
            next();
        });
    }

    const validateToken = (req, res) => {
        const token = req.body.token
        jwt.verify(token, publicKey, { algorithm: ["RS256"] }, function(err, decoded) {
            if (err) {
                return res.status(500).send(false);
            } else
                return res.status(200).send(true)



        });

    }


    return { signin, logout, verify, validateToken }
}