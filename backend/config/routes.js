const role = require('../api/validationUser')
const rateLimit = require('express-rate-limit')

const createLimit = rateLimit({ windowMs: 2 * 60 * 1000, max: 10, message: 'Limite atingido' })
module.exports = app => {

    const verify = app.api.auth.verify

    app.post('/login', app.api.auth.signin)
    app.post('/validate', app.api.auth.validateToken)

    app.route('/users')
        .all(verify)
        .post(createLimit, role('manager', app.api.users.save))
        .get(app.api.users.get)

    app.route('/users/job/:job')
        .all(verify)
        .get(app.api.users.getByJob)

    app.route('/users/update')
        .all(verify)
        .put(app.api.users.update)
    app.route('/users/:iduser')
        .all(verify)
        .get(app.api.users.getById)
        .put(role('manager', app.api.users.save))
        .delete(app.api.users.remove)

    app.route('/products')
        .all(verify)
        .post(app.api.products.saveProduct)
        .get(app.api.products.get)

    app.route('/products/:idproduct')
        .all(verify)
        .get(app.api.products.getById)
        .delete(app.api.products.remove)
        .put(app.api.products.saveProduct)


    app.route('/stocks/:idstock')
        .all(verify)
        .delete(app.api.stocks.remove)

    app.route('/stocks')
        .all(verify)
        .post(app.api.stocks.addMount)
        .get(app.api.stocks.getAdd)

    app.route('/takes')
        .all(verify)
        .post(role('waiter', app.api.takes.takeProduct))
        .get(app.api.takes.get)


    app.route('/takes/user/:iduser')
        .all(verify)
        .get(app.api.takes.getByUser)

    app.route('/takes/order/:idorder')
        .all(verify)
        .get(app.api.takes.getByOrder)

    app.route('/takes/:idtake')
        .all(verify)
        .delete(app.api.takes.remove)

    app.route('/categories')
        .all(verify)
        .post(role('manager', app.api.category.save))
        .get(app.api.category.get)

    app.route('/categories/products/:idcategory')
        .all(verify)
        .get(app.api.products.getByCategory)
    app.route('/categories/plates/:idcategory')
        .all(verify)
        .get(app.api.plates.getByCategory)

    app.route('/categories/:idcategory')
        .all(verify)
        .delete(app.api.category.remove)
        .put(role('manager', app.api.category.save))

    app.route('/plates')
        .all(verify)
        .post(app.api.plates.save)
        .get(app.api.plates.get)

    app.route('/plates/:idplate')
        .all(verify)
        .delete(app.api.plates.remove)
        .put(app.api.plates.save)


    app.route('/orders')
        .all(verify)
        .post(app.api.orders.save)
        .get(app.api.orders.getByQuery)

    app.route('/orders/user/:iduser')
        .all(verify)
        .get(app.api.orders.getByUser)
    app.route('/orders/:idorder')
        .all(verify)
        .put(app.api.orders.save)
        .get(app.api.orders.getByID)

    app.route('/stateorder')
        .all(verify)
        .post(role('waiter', app.api.orders.closeOpen))

    app.route('/payorder')
        .all(verify)
        .post(role('cashier', app.api.orders.pay))

}