module.exports = app => {

    const { existsOrError, notExistsOrError, isNumberOrError, getProductById } = app.api.validation

    const saveProduct = async(req, res) => {
        const product = {...req.body }

        if (req.params.idproduct) product.idproduct = req.params.idproduct
        try {
            existsOrError(product.product, 'Produto não informado')
            existsOrError(product.price, 'Preço não informado')
            isNumberOrError(product.price, 'Preço não numérico')
            existsOrError(product.profit, 'Lucro não informado')
            isNumberOrError(product.profit, 'Lucro não numérico')
            product.qcurrent = 0
            const productFromDB = await app.db('products')
                .where({ product: product.product }).first()
                .catch(err => res.status(500).send(err))
            if (!product.idproduct) {
                notExistsOrError(productFromDB, 'Produto já cadastrado')
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (!product.idproduct) {
            app.db('products')
                .insert(product)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('products').update(product)
                .where({ idproduct: product.idproduct })
                .whereNull('deleteat')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }


    }

    const get = (req, res) => {
        app.db('products')
            .select('idproduct', 'product', 'price', 'profit', 'qcurrent')
            .whereNull('deleteat')
            .then(products => res.json(products))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('products')
            .select('idproduct', 'product', 'price', 'profit', 'qcurrent')
            .whereNull('deleteat')
            .where({ idproduct: req.params.idproduct }).first()
            .then(product => res.json(product))
            .catch(err => res.status(500).send(err))
    }

    const remove = async(req, res) => {

        try {
            const stock = await getProductById(req.params.idproduct)
            existsOrError(stock, 'Produto não foi encontrado')
            if (stock.qcurrent > 0) throw ('Ainda tem deste produto no estoque')

            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await app.db('products')
                .update({ deleteat: date })
                .where({ idproduct: req.params.idproduct })
                .then(_ => res.status(204).send())



        } catch (msg) {
            res.status(400).send(msg)
        }

    }



    return { saveProduct, get, getById, remove }
}