const router = require('express').Router();

router.use('/users', require('./users/sign_up'));
router.use('/users', require('./users/users'));
router.use('/push_notifications', require('./push_notifications/push_notifications'));

router.use('/video', require('./video_routes/videos'));
router.use('/video', require('./video_routes/video_stream'));

module.exports = router;