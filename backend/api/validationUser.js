module.exports = (userRole, middleware) => {
    return (req, res, next) => {

        if (req.user[userRole]) {
            console.log(req.user[userRole])
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não tem permissão.')
        }
    }
}