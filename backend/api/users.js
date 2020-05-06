const bcrypt = require('bcrypt-nodejs')
module.exports = app => {

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const { existsOrError, notExistsOrError, equalsOrError, sixMoreOrError, emailOrError } = app.api.validation

    const save = async(req, res) => {
        const user = {...req.body }

        if (req.params.iduser) user.iduser = req.params.iduser


        try {
            existsOrError(user.logname, 'Usuário não informado')
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.lastname, 'Sobrenome não informado')
            existsOrError(user.email, 'E-mail não informado')
            emailOrError(user.email, 'Email inválido')
            existsOrError(user.tel, 'Telefone não informado')
            existsOrError(user.password, 'Senha não informada')
            sixMoreOrError(user.password, 'Senha muito pequena')
            existsOrError(user.confirmPassword, 'Confirme a senha digitada')
            equalsOrError(user.password, user.confirmPassword, 'Senhas digitadas não conferem')


            const emailFromDB = await app.db('users')
                .where({ email: user.email }).first()
                .catch(err => res.status(500).send(err))
            const userFromDB = await app.db('users')
                .where({ logname: user.logname }).first()
                .catch(err => res.status(500).send(err))
            if (!user.iduser) {
                notExistsOrError(emailFromDB, 'Email já cadastrado')
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword
        if (!user.iduser) {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users').update(user)
                .where({ iduser: user.iduser })
                .whereNull('deleteat')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    }

    const get = (req, res) => {
        app.db('users')
            .select('iduser', 'logname', 'name', 'lastname', 'email', 'tel', 'su', 'manager', 'application', 'cashier', 'waiter')
            .whereNull('deleteat')
            .then(users => res.json({ users, user: req.user }))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        const iduser = req.params.iduser
        app.db('users')
            .select('iduser', 'logname', 'name', 'lastname', 'email', 'tel', 'su', 'manager', 'application', 'cashier', 'waiter')
            .whereNull('deleteat')
            .where({ iduser }).first()
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const remove = async(req, res) => {

        try {
            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const rowsUpdate = await app.db('users')
                .update({ deleteat: date })
                .where({ iduser: req.params.iduser })
            existsOrError(rowsUpdate, 'Usuário não foi encontrado')
            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }

    }

    const getByJob = (req, res) => {
        const jobId = req.params.job
        let job = 0
        switch (jobId) {
            case "1":
                job = 'su'
                break
            case "2":
                job = 'manager'
                break
            case "3":
                job = 'application'
                break
            case "4":
                job = 'cashier'
                break
            case "5":
                job = 'waiter'
                break
            default:
                return res.status(400).send("Função não atribuida")
        }
        app.db('users')
            .select('iduser', 'logname', 'name', 'lastname', 'email', 'tel')
            .whereNull('deleteat')
            .where({
                [job]: 1
            })
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const update = async(req, res) => {
        const user = {...req.body }


        if (user.iduser) delete user.iduser

        if (user.logname && user.logname !== req.user.logname) {
            const userFromDB = await app.db('users')
                .where({ logname: user.logname }).first()
                .catch(err => res.status(500).send(err))
            if (userFromDB) return res.status(400).send('Já existe um usuário com esse Login')
        }
        if (user.email && user.email !== req.user.email) {
            const emailFromDB = await app.db('users')
                .where({ email: user.email }).first()
                .catch(err => res.status(500).send(err))
            if (emailFromDB) return res.status(400).send('Já existe um usuário com esse Email')

        }

        if (!user.oldPassword) return res.status(400).send('Informe a senha antiga!')

        var userFromDB = await app.db('users')
            .where({ iduser: req.user.iduser })
            .first()
        if (!userFromDB) return res.status(400).send('Usuário não encontrado')

        const isMatch = bcrypt.compareSync(user.oldPassword, userFromDB.password)
        if (!isMatch) return res.status(401).send('Senha antiga inválida')

        if (user.newPassword) {

            if (!user.confirmNewPassword) return res.status(400).send('Confirme a nova senha')

            if (user.newPassword !== user.confirmNewPassword) return res.status(400).send('Senhas diferentes')

            user.password = encryptPassword(user.newPassword)

            delete user.newPassword
            delete user.confirmNewPassword



        }
        delete user.oldPassword
        app.db('users').update(user)
            .where({ iduser: req.user.iduser })
            .whereNull('deleteat')
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))

    }


    return { save, get, getById, remove, getByJob, update }
}