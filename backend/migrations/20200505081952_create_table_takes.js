exports.up = function(knex) {
    return knex.schema.createTable('takes', table => {
        table.increments('idtake').primary()
        table.integer('amount').defaultTo(0)
        table.float('price', 8, 2).notNull()
        table.datetime('date').notNull()
        table.datetime('deleteat')


    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('takes')
};