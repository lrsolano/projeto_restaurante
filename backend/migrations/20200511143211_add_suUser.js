exports.up = function(knex) {
    const suUser = {
        name: 'Super',
        lastname: 'User',
        email: 'Super@lrsolano.com',
        tel: '(31)00000-0000',
        password: '$2a$10$DsXJFfaRXRRcQet6gWDIrewhmcG44T7R/WAMSZ66zh2Jb4grShZFS',
        su: true,
        logname: 'suUser'

    }
    return knex('users').insert(suUser)
};

exports.down = function(knex) {
    return knex('users')
        .where('logname', 'suUser')
        .del()
};