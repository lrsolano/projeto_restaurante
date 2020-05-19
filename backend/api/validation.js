module.exports = app => {
    function existsOrError(value, msg) {
        if (!value) throw msg
        if (Array.isArray(value) && value.length === 0) throw msg
        if (typeof value === 'string' && !value.trim()) throw msg
    }

    function notExistsOrError(value, msg) {
        try {
            existsOrError(value, msg)
        } catch (msg) {
            return
        }
        throw msg
    }

    function equalsOrError(valueA, valueB, msg) {
        if (valueA !== valueB) throw msg
    }

    function biggerOrErro(valueA, valueB, msg) {
        if (valueA < valueB) throw msg
    }

    function sixMoreOrError(value, msg) {
        if (value < 6) throw msg
    }

    function emailOrError(email, msg) {
        if ((email.length != 0) && ((email.indexOf("@") < 1) || (email.indexOf('.') < 7))) {
            throw msg
        }
    }

    function isNumberOrError(number, msg) {
        if (!(Number(number) === number)) throw msg
    }

    const getProductById = async(idproduct) =>
        await app.db('products')
        .select('idproduct', 'qcurrent', 'price', 'profit')
        .whereNull('deleteat')
        .where({ idproduct }).first()

    const getUserById = async(iduser) =>
        await app.db('users')
        .select('iduser', 'logname')
        .whereNull('deleteat')
        .where({ iduser }).first()

    const getAddById = async(idstock) =>
        await app.db('stocks')
        .select('iduser', 'idproduct', 'amount', 'NF')
        .whereNull('deleteat')
        .where({ idstock }).first()

    const getStockbyNF = async(NF) =>
        await app.db('stocks')
        .select('iduser', 'idproduct', 'amount', 'NF')
        .whereNull('deleteat')
        .where({ NF }).first()

    const getCategoryById = async(idcategory) =>
        await app.db('categories')
        .select('idcategory', 'name')
        .whereNull('deleteat')
        .where({ idcategory }).first()

    const getPlateById = async(idplate) =>
        await app.db('plates')
        .select('idplate', 'name', 'price', 'idcategory')
        .whereNull('deleteat')
        .where({ idplate }).first()

    const getOrderByTableOpen = async(table) =>
        await app.db('orders')
        .select('idorder', 'table', 'state', 'iduser', 'pay')
        .where({ table, state: false })
        .whereNull('deleteat').first()

    const getOrderByIdOpen = async(idorder) =>
        await app.db('orders')
        .select('idorder', 'table', 'state', 'iduser', 'pay')
        .where({ idorder, state: false })
        .whereNull('deleteat').first()



    return {
        existsOrError,
        notExistsOrError,
        equalsOrError,
        biggerOrErro,
        sixMoreOrError,
        emailOrError,
        isNumberOrError,
        getProductById,
        getUserById,
        getAddById,
        getStockbyNF,
        getCategoryById,
        getPlateById,
        getOrderByTableOpen,
        getOrderByIdOpen
    }
}