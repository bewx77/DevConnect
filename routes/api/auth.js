const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');

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

module.exports = router;