exports.up = function(knex) {
    return knex.schema.alterTable('users', (table) => {
        table.string('logname').notNull().unique()
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('users', (table) => {
        table.dropColumn('logname')
    })
};