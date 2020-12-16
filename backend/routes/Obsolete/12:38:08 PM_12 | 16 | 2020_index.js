const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/video_stream', require('./video_stream'));
router.use('/push_notifications', require('./push_notifications'));
router.use('/paypal_payments', require('./paypal_payments'));
router.use('/stripe_payments', require('./stripe_payments'));

router.use('/blogposts', require('./blogposts'));
router.use('/videos', require('./videos'));
router.use('/images', require('./images'));
module.exports = router;


module.exports = router