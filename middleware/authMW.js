const jwt = require('jsonwebtoken');
const config = require('config')


module.exports = (req, res, next) => {

    const secretKey = config.get('secretKey')

    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401).json({message: 'Token not provided'});
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        jwt.verify(token, secretKey);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            res.status(401).json({message: 'Invalid token!'})
        }
    }
    next()
}