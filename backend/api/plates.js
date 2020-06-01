module.exports = app => {


    const { existsOrError, notExistsOrError, isNumberOrError, getPlateById, getCategoryById } = app.api.validation

    const save = async(req, res) => {
        const plate = {...req.body }

        if (req.params.idplate) plate.idplate = req.params.idplate
        try {
            existsOrError(plate.name, 'Prato não informado')
            existsOrError(plate.price, 'Preço não informado')
            existsOrError(plate.desc, 'Descrição não informada')
            isNumberOrError(plate.price, 'Preço não numérico')
            existsOrError(plate.idcategory, 'Categoria não informada')

            const category = await getCategoryById(plate.idcategory)
            existsOrError(category, 'Categoria não cadastrada')


            if (!plate.idplate) {
                const plateFromDB = await app.db('plates')
                    .where({ name: plate.name }).first()
                    .whereNull('deleteat')
                    .catch(err => res.status(500).send(err))
                notExistsOrError(plateFromDB, 'Prato já cadastrado')
            } else {
                const oldName = await app.db('plates')
                    .where({ idplate: plate.idplate }).first()
                    .whereNull('deleteat')
                    .catch(err => res.status(500).send(err))
                if (!(plate.name === oldName.name)) {
                    const plateFromDB = await app.db('plates')
                        .where({ name: plate.name }).first()
                        .whereNull('deleteat')
                        .catch(err => res.status(500).send(err))
                    notExistsOrError(plateFromDB, 'Prato já cadastrado')

                }
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (!plate.idplate) {
            app.db('plates')
                .insert(plate)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('plates').update(plate)
                .where({ idplate: plate.idplate })
                .whereNull('deleteat')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }


    }

    const remove = async(req, res) => {

        try {
            const plate = await getPlateById(req.params.idplate)
            existsOrError(plate, 'Prato não foi encontrado')

            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await app.db('plates')
                .update({ deleteat: date })
                .where({ idplate: req.params.idplate })
                .then(_ => res.status(204).send())



        } catch (msg) {
            res.status(400).send(msg)
        }

    }

    const getByCategory = (req, res) => {
        app.db('plates')
            .select('idplate', 'name', 'price', 'desc')
            .whereNull('deleteat')
            .where({ idcategory: req.params.idcategory })
            .then(plates => res.json(plates))
            .catch(err => res.status(500).send(err))
    }


    const get = (req, res) => {
        app.db('plates')
            .select('idplate', 'name', 'price', 'desc', 'idcategory')
            .whereNull('deleteat')
            .then(plates => res.json(plates))
            .catch(err => res.status(500).send(err))
    }




    return { save, get, remove, getByCategory }
}