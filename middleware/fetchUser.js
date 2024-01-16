const jwt = require('jsonwebtoken');
const JWT_SECRET = "I am Anup";
const fetchUser = (req, res, next) => {

    //get user from jwt token and add id to req object

    const token = req.header('authToken');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using valid token" })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using valid token" });
    }
}


module.exports = fetchUser;