exports.up = function(knex) {
    return knex.schema.createTable('stocks', table => {
        table.increments('idstock').primary()
        table.float('price', 8, 2).notNull()
        table.integer('amount').notNull().defaultTo(0)
        table.datetime('date').notNull()
        table.integer('idproduct').unsigned().references('idproduct').inTable('products').notNull()
        table.integer('iduser').unsigned().references('iduser').inTable('users').notNull()
        table.datetime('deleteat')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('stocks')
};