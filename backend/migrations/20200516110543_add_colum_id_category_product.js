exports.up = function(knex) {
    return knex.schema.alterTable('products', (table) => {
        table.integer('idcategory').unsigned().references('idcategory').inTable('categories').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('products', (table) => {
        table.dropForeign('idcategory')
    })
};