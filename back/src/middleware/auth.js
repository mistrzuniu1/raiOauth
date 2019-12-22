const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async(req, res, next) => {
    //const token = req.header('Authorization').replace('Bearer ', '');
    console.log(req.headers.authorization)
    var token = req.headers.authorization.split(' ')[1];
    console.log(token)
    const data = jwt.verify(token, "SECRET_JWT");
    //console.log(token);
    //console.log(data);
    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token });
        if (!user) {
            throw new Error()
        }
        req.user = user;
        req.token = token;
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

};
module.exports = auth;