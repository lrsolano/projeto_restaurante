exports.up = function(knex) {
    return knex.schema.alterTable('takes', (table) => {
        table.integer('iduser').unsigned().references('iduser').inTable('users').notNull()
        table.integer('idproduct').unsigned().references('idproduct').inTable('products')
        table.integer('idplate').unsigned().references('idplate').inTable('plates')
        table.integer('idorder').unsigned().references('idorder').inTable('orders').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('takes', (table) => {
        table.dropForeign('iduser')
        table.dropForeign('idproduct')
        table.dropForeign('idplate')
        table.dropForeign('idorder')
    })
};