module.exports = app => {

    const { existsOrError, isNumberOrError, getProductById, getUserById, getAddById, getStockbyNF, notExistsOrError } = app.api.validation


    const addMount = async(req, res) => {
        const product = {...req.body }
        let amount = 0
        if (req.user.iduser) product.iduser = req.user.iduser
        try {
            existsOrError(product.idproduct, 'Produto não informado')
            existsOrError(product.iduser, 'Usuário não informado')
            existsOrError(product.price, 'Preço não informado')
            isNumberOrError(product.price, 'Preço não numérico')
            existsOrError(product.amount, 'Quantidade não informado')
            isNumberOrError(product.amount, 'Quantidade não numérica')
            existsOrError(product.NF, 'Nota Fiscal não informado')
            const productFromBD = await getProductById(product.idproduct)
            const userFromBD = await getUserById(product.iduser)
            const NFFromBD = await getStockbyNF(product.NF)



            existsOrError(productFromBD, 'Produto não cadastrado')
            existsOrError(userFromBD, 'Usuário não cadastrado')
            notExistsOrError(NFFromBD, 'Nota Fiscal já Cadastrada')

            amount = productFromBD.qcurrent + product.amount
            pricePerProduct = product.price / product.amount

        } catch (msg) {
            return res.status(400).send(msg)
        }

        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        product.date = date
        app.db('products')
            .where({ idproduct: product.idproduct })
            .update('qcurrent', amount)
            .update('price', pricePerProduct)
            .catch(err => res.status(500).send(err))

        app.db('stocks')
            .insert(product)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))



    }


    const remove = async(req, res) => {
        const data = await getAddById(req.params.idstock)
        const productFromBD = await getProductById(data.idproduct)

        try {
            existsOrError(data, 'Entrada não localizada')
            if ((productFromBD.qcurrent - data.amount) < 0) throw ('Entrda já está em uso.')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        amount = (productFromBD.qcurrent - data.amount)
        app.db('products')
            .where({ idproduct: productFromBD.idproduct })
            .update('qcurrent', amount)
            .catch(err => res.status(500).send(err))

        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        app.db('stocks')
            .update({ deleteat: date })
            .where({ idstock: req.params.idstock })
            .catch(err => res.status(500).send(err))
        res.status(204).send()

    }
    const limit = 30
    const getAdd = async(req, res) => {
        const all = req.query.all || false
        const s = req.query.start
        const e = req.query.end
        if (s) { var start = new Date(req.query.start).toISOString().slice(0, 19).replace('T', ' '); }
        if (e) { var end = new Date(req.query.end).toISOString().slice(0, 19).replace('T', ' '); }
        const page = req.query.page || 1
        const result = await app.db('stocks').count('idstock as count').first()
        const count = parseInt(result.count)
        if (s && e) {
            app.db.from('stocks as s')
                .select('idstock', 'u.logname as logname', 'p.product as product', 's.price as price', 's.amount as amount', 's.date as date', 'u.iduser as iduser', 'p.idproduct as idproduct', 's.NF as NF')
                .innerJoin('products as p', 'p.idproduct', 's.idproduct')
                .innerJoin('users as u', 'u.iduser', 's.iduser')
                .whereNull('s.deleteat')
                .where('date', '>=', start)
                .where('date', '<', end)
                .then(adds => res.json({ data: adds, count, limit }))
                .catch(err => res.status(500).send(err))
        } else {
            if (all) {
                app.db.from('stocks as s')
                    .select('idstock', 'u.logname as logname', 'p.product as product', 's.price as price', 's.amount as amount', 's.date as date', 'u.iduser as iduser', 'p.idproduct as idproduct', 's.NF as NF')
                    .innerJoin('users as u', 'u.iduser', 's.iduser')
                    .innerJoin('products as p', 'p.idproduct', 's.idproduct')
                    .whereNull('s.deleteat')
                    .then(adds => res.json({ data: adds, count, limit }))
                    .catch(err => res.status(500).send(err))
            } else if (!all) {
                app.db.from('stocks as s')
                    .select('idstock', 'u.logname as logname', 'p.product as product', 's.price as price', 's.amount as amount', 's.date as date', 'u.iduser as iduser', 'p.idproduct as idproduct', 's.NF as NF')
                    .innerJoin('users as u', 'u.iduser', 's.iduser')
                    .innerJoin('products as p', 'p.idproduct', 's.idproduct')
                    .whereNull('s.deleteat')
                    .limit(limit).offset(page * limit - limit)
                    .then(adds => res.json({ data: adds, count, limit }))
                    .catch(err => res.status(500).send(err))
            }
        }

    }

    return { addMount, remove, getAdd }
}