exports.up = function(knex) {
    return knex.schema.createTable('manualin', table => {
        table.increments('idmanualout').primary()
        table.integer('idproduct').unsigned().references('idproduct').inTable('products').notNull()
        table.text('reason').notNull()
        table.datetime('date').notNull()


    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('manualin')
};