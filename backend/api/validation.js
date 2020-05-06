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
        .select('iduser', 'idproduct', 'amount')
        .whereNull('deleteat')
        .where({ idstock }).first()


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
        getAddById
    }
}