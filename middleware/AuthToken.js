const jwt = require('jsonwebtoken');

const mid = (req, res, next) => {
    const token = req.body.token
    if (!token) {
        res.json({logado: false, mensagem: 'Token não foi enviado.'})
    }
    jwt.verify(token, "sdsdjshkgbvgz", (err, decoded) => {
        if (err) {
            console.log(err)
            res.json({locado: false, mensagem: 'Falha na autenticação'})
        }
    })
    next()
}

module.exports = mid;