module.exports = app => {
    const { existsOrError, getCategoryById, notExistsOrError } = app.api.validation

    const save = async(req, res) => {
        const category = {...req.body }
        if (req.params.idcategory) category.idcategory = req.params.idcategory
        try {
            existsOrError(category.name, 'Informe o nome da categoria')

            const categoryFromBD = await app.db('categories')
                .where({ name: category.name }).first()
                .whereNull('deleteat')
                .catch(err => res.status(500).send(err))



            if (!category.idcategory) {
                const categoryFromBD = await app.db('categories')
                    .where({ name: category.name }).first()
                    .whereNull('deleteat')
                    .catch(err => res.status(500).send(err))
                notExistsOrError(categoryFromBD, 'Categoria já cadastrada')
            } else {
                const oldName = await app.db('categories')
                    .where({ idcategory: category.idcategory }).first()
                    .whereNull('deleteat')
                    .catch(err => res.status(500).send(err))
                if (!(category.name === oldName.name)) {
                    const categoryFromBD = await app.db('categories')
                        .where({ name: category.name }).first()
                        .whereNull('deleteat')
                        .catch(err => res.status(500).send(err))
                    notExistsOrError(categoryFromBD, 'Categoria já cadastrada')

                }
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (!category.idcategory) {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('categories').update(category)
                .where({ idcategory: category.idcategory })
                .whereNull('deleteat')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }


    }

    const get = async(req, res) => {
        app.db('categories')
            .select('idcategory', 'name')
            .whereNull('deleteat')
            .then(categories => res.json(categories))
            .catch(err => res.status(500).send(err))
    }

    const remove = async(req, res) => {

        try {
            const category = await getCategoryById(req.params.idcategory)

            existsOrError(category, 'Categoria não foi encontrada')

            const plateCategory = await app.db('plates')
                .where({ idcategory: req.params.idcategory }).first()
                .catch(err => res.status(500).send(err))
            notExistsOrError(plateCategory, 'Categoria tem um prato assimilado')

            const productCategory = await app.db('products')
                .where({ idcategory: req.params.idcategory }).first()
                .catch(err => res.status(500).send(err))
            notExistsOrError(productCategory, 'Categoria tem um prato assimilado')



            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

            await app.db('categories')
                .update({ deleteat: date })
                .where({ idcategory: req.params.idcategory })
                .then(_ => res.status(204).send())

        } catch (msg) {
            res.status(400).send(msg)
        }

    }



    return { save, remove, get }
}