module.exports = (userRole, middleware) => {
    return (req, res, next) => {

        if (req.user[userRole] || req.user.su) {
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não tem permissão.')
        }
    }
}