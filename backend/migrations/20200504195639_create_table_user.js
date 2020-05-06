exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('iduser').primary()
        table.string('name').notNull()
        table.string('lastname').notNull()
        table.string('email').notNull().unique()
        table.string('tel').notNull()
        table.string('password').notNull()
        table.datetime('deleteat')
        table.boolean('su').notNull().defaultTo(false)
        table.boolean('manager').notNull().defaultTo(false)
        table.boolean('application').notNull().defaultTo(false)
        table.boolean('cashier').notNull().defaultTo(false)
        table.boolean('waiter').notNull().defaultTo(false)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};