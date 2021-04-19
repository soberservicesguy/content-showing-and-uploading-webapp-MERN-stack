const router = require('express').Router();

router.use('/users', require('./users/users'));
router.use('/users', require('./users/sign_up'));
router.use('/push_notifications', require('./push_notifications/push_notifications'));


module.exports = router;