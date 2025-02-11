const dayjs = require('dayjs');

module.exports = (req, res, next) => {
    const day = dayjs().day(); 
    if (day === 0 || day === 6) {
        return res.status(403).send("Acesso permitido apenas de segunda a sexta.");
    }
    next();
};
