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
        .put(app.api.users.save)
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



}