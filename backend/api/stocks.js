module.exports = app => {

    const { existsOrError, isNumberOrError, getProductById, getUserById, getAddById } = app.api.validation


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

            const productFromBD = await getProductById(product.idproduct)
            const userFromBD = await getUserById(product.iduser)



            existsOrError(productFromBD, 'Produto não cadastrado')
            existsOrError(userFromBD, 'Usuário não cadastrado')

            amount = productFromBD.qcurrent + product.amount

        } catch (msg) {
            return res.status(400).send(msg)
        }

        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        product.date = date
        app.db('products')
            .where({ idproduct: product.idproduct })
            .update('qcurrent', amount)
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

    const getAdd = (req, res) => {
        app.db.from('stocks as s')
            .select('idstock', 'u.logname as logname', 'p.product as product', 's.price as price', 's.amount as amount', 's.date as date', 'u.iduser as iduser', 'p.idproduct as idproduct')
            .innerJoin('users as u', 'u.iduser', 's.iduser')
            .innerJoin('products as p', 'p.idproduct', 's.idproduct')
            .whereNull('s.deleteat')
            .then(adds => res.json(adds))
            .catch(err => res.status(500).send(err))
    }

    return { addMount, remove, getAdd }
}