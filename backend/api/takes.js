module.exports = app => {

    const { existsOrError, isNumberOrError, getProductById, getUserById, biggerOrErro, getPlateById, getOrderByIdOpen, notExistsOrError } = app.api.validation
    const takeProduct = async(req, res) => {
        try {
            var take = {...req.body }


            existsOrError(take.iduser, 'Usuário não informado')
            const user = await getUserById(take.iduser)
            existsOrError(user, 'Usuário não cadastrado')

            existsOrError(take.idorder, 'Usuário não informado')
            const order = await getOrderByIdOpen(take.idorder)
            existsOrError(order, 'Não existe esta comanda ou ela já está fechada.')


            if (take.idproduct) {
                existsOrError(take.idproduct, 'Produto não informado')
                var product = await getProductById(take.idproduct)
                existsOrError(product, 'Produto não cadastrado')
                existsOrError(take.amount, 'Quantidade não informada')
                isNumberOrError(take.amount, 'Quantidade não numérica')
                biggerOrErro(product.qcurrent, take.amount, 'Valor superior ao estoque')
                take.price = product.price
                amount = (product.qcurrent + (take.amount * -1))
                app.db('products')
                    .where({ idproduct: product.idproduct })
                    .update('qcurrent', amount)
                    .catch(err => res.status(500).send(err))

            } else if (take.idplate) {
                existsOrError(take.idplate, 'Produto não informado')
                var plate = await getPlateById(take.idplate)
                existsOrError(plate, 'Prato não cadastrado')
                take.price = plate.price
            } else {
                throw ('Informe o prato ou produto')
            }



        } catch (msg) {
            return res.status(400).send(msg)
        }

        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        take.date = date

        app.db('takes')
            .insert(take)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }


    const get = (req, res) => {
        app.db.from('takes as t')
            .select('idtake', 'u.logname as logname', 'p.product as product', 't.amount as amount', 't.date as date', 'u.iduser as iduser', 'p.idproduct as idproduct', 'pl.idplate', 'pl.name')
            .innerJoin('users as u', 'u.iduser', 't.iduser')
            .leftJoin('products as p', 'p.idproduct', 't.idproduct')
            .leftJoin('plates as pl', 'pl.idplate', 't.idplate')
            .then(adds => res.json(adds))
            .catch(err => res.status(500).send(err))

    }

    const remove = async(req, res) => {
        const idtake = req.params.idtake
        try {
            const takeFromBD = await app.db('takes')
                .where({ idtake }).first()
                .whereNull('deleteat')
                .catch(err => res.status(500).send(err))
            existsOrError(takeFromBD, 'Retirada não encontrada')

            const order = await getOrderByIdOpen(takeFromBD.idorder)
            existsOrError(order, 'Comanda não encontrada')
            if (order.pay == 1) throw ('Comanda já está paga')

            if (takeFromBD.idproduct !== null) {
                var product = await getProductById(takeFromBD.idproduct)
                amount = (product.qcurrent + takeFromBD.amount)
                app.db('products')
                    .where({ idproduct: product.idproduct })
                    .update('qcurrent', amount)
                    .catch(err => res.status(500).send(err))
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        await app.db('takes')
            .update({ deleteat: date })
            .where({ idtake })
            .then(_ => res.status(204).send())


    }

    const getByUser = (req, res) => {

        iduser = req.params.iduser
        app.db.from('takes as t')
            .select('idtake', 'u.logname as logname', 'p.product as product', 't.amount as amount', 't.date as date', 'u.iduser as iduser', 'p.idproduct as idproduct', 'pl.idplate', 'pl.name')
            .innerJoin('users as u', 'u.iduser', 't.iduser')
            .leftJoin('products as p', 'p.idproduct', 't.idproduct')
            .leftJoin('plates as pl', 'pl.idplate', 't.idplate')
            .where({ 't.iduser': iduser })
            .whereNull('t.deleteat')
            .then(adds => res.json(adds))
            .catch(err => res.status(500).send(err))

    }


    const getByOrder = (req, res) => {

        idorder = req.params.idorder
        app.db.from('takes as t')
            .select('idtake', 'u.logname as logname', 'p.product as product', 't.amount as amount', 't.date as date', 'u.iduser as iduser', 'p.idproduct as idproduct', 'pl.idplate', 'pl.name')
            .innerJoin('users as u', 'u.iduser', 't.iduser')
            .leftJoin('products as p', 'p.idproduct', 't.idproduct')
            .leftJoin('plates as pl', 'pl.idplate', 't.idplate')
            .where({ idorder })
            .whereNull('t.deleteat')
            .then(adds => res.json(adds))
            .catch(err => res.status(500).send(err))

    }


    return { takeProduct, get, remove, getByUser, getByOrder }
}