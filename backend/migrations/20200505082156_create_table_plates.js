exports.up = function(knex) {
    return knex.schema.createTable('plates', table => {
        table.increments('idplate').primary()
        table.string('name')
        table.float('price', 8, 2).notNull()
        table.text('desc').notNull()
        table.datetime('deleteat')


    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('plates')
};