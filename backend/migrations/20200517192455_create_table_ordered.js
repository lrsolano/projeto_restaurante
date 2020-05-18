exports.up = function(knex) {
    return knex.schema.createTable('orders', table => {
        table.increments('idorder').primary()
        table.integer('table').notNull()
        table.integer('people').notNull()
        table.boolean('state').notNull().defaultTo(false)
        table.boolean('pay').notNull().defaultTo(false)
        table.integer('iduser').unsigned().references('iduser').inTable('users').notNull()
        table.datetime('date').notNull()
        table.datetime('deleteat')
    })

};

exports.down = function(knex) {
    return knex.schema.dropTable('orders')

};