module.exports = app => {

    const save = async(req, res) => {
        const { existsOrError, notExistsOrError, isNumberOrError, getOrderByTableOpen, getUserById } = app.api.validation
        const order = {...req.body }

        if (req.params.idorder) order.idorder = req.params.idorder
        if (req.user.iduser) order.iduser = req.user.iduser
        try {
            existsOrError(order.table, 'Numero da mesa não informado')
            isNumberOrError(order.table, 'Mesa não numérica')
            existsOrError(order.people, 'Numero da pessoas não informado')
            isNumberOrError(order.people, 'Pessoas não numérica')
            existsOrError(order.iduser, 'Usuário não informado')

            const isUser = await getUserById(order.iduser)
            existsOrError(isUser, 'Usuario não cadastrado')



            if (!order.idorder) {
                const isOpen = await getOrderByTableOpen(order.table)
                notExistsOrError(isOpen, 'Há uma comanda aberta para essa mesa')
                const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                order.date = date

            } else {
                const oldTable = await app.db('orders')
                    .where({ idorder: order.idorder }).first()
                    .whereNull('deleteat')
                    .catch(err => res.status(500).send(err))
                if (!(order.table === oldTable.table)) {
                    const isOpen = await getOrderByTableOpen(order.table)
                    notExistsOrError(isOpen, 'Há uma comanda aberta para essa mesa, não foi possivel alterar.')

                }
                if (!(order.iduser === oldTable.iduser)) {
                    const user = await getUserById(order.iduser)
                    existsOrError(user, 'Usuário invalido, não foi possivel atualizar.')
                }

            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (order.state) delete order.state
        if (order.pay) delete order.pay

        if (!order.idorder) {
            app.db('orders')
                .insert(order)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('orders').update(order)
                .where({ idorder: order.idorder })
                .whereNull('deleteat')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }


    }

    const getByUser = (req, res) => {

        iduser = req.params.iduser
        app.db.from('orders as o')
            .select('idorder', 'table', 'people', 'state', 'pay', 'u.logname', 'o.date')
            .innerJoin('users as u', 'u.iduser', 'o.iduser')
            .whereNull('o.deleteat')
            .where({ 'o.iduser': iduser })
            .then(ordered => res.json(ordered))
            .catch(err => res.status(500).send(err))

    }

    const getByID = (req, res) => {

        idorder = req.params.idorder
        app.db.from('orders as o')
            .select('idorder', 'table', 'people', 'state', 'pay', 'u.logname', 'o.date')
            .innerJoin('users as u', 'u.iduser', 'o.iduser')
            .whereNull('o.deleteat')
            .where({ 'o.idorder': idorder })
            .then(ordered => res.json(ordered))
            .catch(err => res.status(500).send(err))

    }

    const getByQuery = (req, res) => {
        if (req.query.pay !== undefined) var pay = req.query.pay
        if (req.query.state !== undefined) var state = req.query.state
        if (pay && state) {
            app.db.from('orders as o')
                .select('idorder', 'table', 'people', 'state', 'pay', 'u.logname', 'o.date')
                .innerJoin('users as u', 'u.iduser', 'o.iduser')
                .whereNull('o.deleteat')
                .where({ pay, state })
                .then(ordered => res.json(ordered))
                .catch(err => res.status(500).send(err))
        } else if (pay) {
            app.db.from('orders as o')
                .select('idorder', 'table', 'people', 'state', 'pay', 'u.logname', 'o.date')
                .innerJoin('users as u', 'u.iduser', 'o.iduser')
                .whereNull('o.deleteat')
                .where({ pay })
                .then(ordered => res.json(ordered))
                .catch(err => res.status(500).send(err))
        } else if (state) {
            app.db.from('orders as o')
                .select('idorder', 'table', 'people', 'state', 'pay', 'u.logname as user', 'o.date as date')
                .innerJoin('users as u', 'u.iduser', 'o.iduser')
                .whereNull('o.deleteat')
                .where({ state })
                .then(ordered => res.json(ordered))
                .catch(err => res.status(500).send(err))
        } else {
            app.db.from('orders as o')
                .select('idorder', 'table', 'people', 'state', 'pay', 'u.logname', 'o.date')
                .innerJoin('users as u', 'u.iduser', 'o.iduser')
                .whereNull('o.deleteat')
                .then(ordered => res.json(ordered))
                .catch(err => res.status(500).send(err))
        }


    }

    const closeOpen = async(req, res) => {
        if (req.query.state !== undefined) {
            var state = req.query.state
        } else {
            return res.status(500).send('Passe o estado da mesa')
        }

        idorder = req.body.idorder

        const table = await app.db('orders')
            .where({ idorder }).first()
            .whereNull('deleteat')
            .catch(err => res.status(500).send(err))

        if (state == 0 && table.pay == 1) {
            return res.status(400).send('A comanda já está paga')
        }


        app.db('orders').update({ state })
            .where({ idorder })
            .whereNull('deleteat')
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))

    }

    const pay = async(req, res) => {
        if (req.query.pay !== undefined) {
            var pay = req.query.pay
        } else {
            return res.status(400).send('Passe o estado da mesa')
        }

        idorder = req.body.idorder
        const table = await app.db('orders')
            .where({ idorder }).first()
            .whereNull('deleteat')
            .catch(err => res.status(500).send(err))

        if (pay == 1 && table.state == 0) {
            return res.status(400).send('A comanda encontra-se aberta')
        }

        app.db('orders').update({ pay })
            .where({ idorder })
            .whereNull('deleteat')
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }


    return { save, getByUser, getByQuery, closeOpen, pay, getByID }
}