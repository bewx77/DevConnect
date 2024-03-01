const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {

    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) { // if no token
        return res.status(401).json( { msg: 'No token, authorisation denied'});
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        
        // decoded.user assigned to new 'user' property of req
        // The 'user' property in the request (req.user) is specifically set within this middleware
        // Before this middleware is executed, the req object doesn't inherently have a user property
        // Middleware functions in Express are responsible for modifying the req and res objects as needed 
        // before passing control to the next middleware or the route handler.
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid'});
    }
}