module.exports = app => {

    const { existsOrError, isNumberOrError, getProductById, getUserById, biggerOrErro } = app.api.validation
    const takeProduct = async(req, res) => {
        try {
            var take = {...req.body }
            if (req.user.iduser) take.iduser = req.user.iduser

            existsOrError(take.iduser, 'Usuário não informado')
            const user = await getUserById(take.iduser)
            existsOrError(user, 'Usuário não cadastrado')
            existsOrError(take.idproduct, 'Produto não informado')
            var product = await getProductById(take.idproduct)
            existsOrError(product, 'Produto não cadastrado')
            existsOrError(take.amount, 'Quantidade não informada')
            isNumberOrError(take.amount, 'Quantidade não numérica')
            biggerOrErro(product.qcurrent, take.amount, 'Valor superior ao estoque')

        } catch (msg) {
            return res.status(400).send(msg)
        }

        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        take.date = date
        take.price = product.price
        take.profit = product.profit
        amount = (product.qcurrent + (take.amount * -1))
        app.db('products')
            .where({ idproduct: product.idproduct })
            .update('qcurrent', amount)
            .catch(err => res.status(500).send(err))
        app.db('takes')
            .insert(take)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))


    }


    const get = (req, res) => {
        app.db.from('takes as t')
            .select('u.logname as logname', 'p.product as product', 't.amount as amount', 't.date as date', 'u.iduser as iduser', 'p.idproduct as idproduct')
            .innerJoin('users as u', 'u.iduser', 't.iduser')
            .innerJoin('products as p', 'p.idproduct', 't.idproduct')
            .then(adds => res.json(adds))
            .catch(err => res.status(500).send(err))

    }

    return { takeProduct, get }
}