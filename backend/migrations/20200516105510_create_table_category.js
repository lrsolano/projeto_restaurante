exports.up = function(knex) {
    return knex.schema.createTable('categories', table => {
        table.increments('idcategory').primary()
        table.string('name')
        table.datetime('deleteat')
    })

};

exports.down = function(knex) {
    return knex.schema.dropTable('categories')

};