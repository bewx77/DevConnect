const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const jwt = require('jsonwebtoken');
const config = require('config')
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// @route   GET api/auth
// @desc    Test route
// @access  Public (do not need token)
router.get('/', auth, async (req, res) => {
    try {
        // req.user.id because of payload structure defined
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public (do not need token)
router.post(
    '/', 
    [
        check('email', 'Please include valid email').isEmail(),
        check('password', 'Password is required')
        .exists()
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() }); // Bad request 
        }
        
        const { email, password} = req.body;
        
        try {
            // See if user exists
            let user = await User.findOne( { email });
            
            if (!user) {
                return res.status(400).json({ errors: [ { msg: 'Invalid Credentials' }] });
            }
            
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [ { msg: 'Invalid Credentials' }] });
            }

            const payload = {
                user: {
                    id : user.id
                }
            }

            // jwt.sign => function used to sign the payload and create a JWT token
            jwt.sign(payload, config.get('jwtSecret'),
            { expiresIn: 360000 }, // optional parameter specifying expiration time of the token in ms
            (err, token) => { // callback function execuated once token is generated or if error occurs
                if (err) throw err;
                res.json({ token }); // send a JSON response containing the generated token to the client 
                // respond looks sth like:
                // { "token" : "abcdefghijklmnop" }
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});

module.exports = router;