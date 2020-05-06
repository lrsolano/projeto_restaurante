exports.up = function(knex) {
    return knex.schema.createTable('products', table => {
        table.increments('idproduct').primary()
        table.string('product').notNull().unique()
        table.float('price', 8, 2).notNull()
        table.float('profit', 8, 2).notNull()
        table.integer('qcurrent').notNull().defaultTo(0)
        table.datetime('deleteat')

    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('products')
};