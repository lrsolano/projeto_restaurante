exports.up = function(knex) {
    return knex.schema.createTable('takes', table => {
        table.integer('idproduct').unsigned().references('idproduct').inTable('products').notNull()
        table.integer('iduser').unsigned().references('iduser').inTable('users').notNull()
        table.integer('amount').notNull()
        table.float('price', 8, 2).notNull()
        table.float('profit', 8, 2).notNull()
        table.datetime('date').notNull()


    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('takeouts')
};