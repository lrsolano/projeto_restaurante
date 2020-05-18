exports.up = function(knex) {
    return knex.schema.alterTable('takes', (table) => {
        table.integer('idplate').unsigned().references('idplate').inTable('plates').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('takes', (table) => {
        table.dropForeign('idplate')
    })
};