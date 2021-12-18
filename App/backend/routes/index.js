const router = require('express').Router();

router.use('/users', require('./users/users_routes'));

router.use('/push_notifications', require('./push_notifications/push_notifications'));

router.use('/blogpostings', require('./blogpost/blogpost'));
router.use('/video', require('./video_routes/videos'));
router.use('/video', require('./video_routes/video_stream'));
router.use('/image', require('./image_routes/image'));



router.use('/uploads', require('./uploads/bulk_blogpost_upload'));
router.use('/uploads', require('./uploads/bulk_video_upload'));
router.use('/uploads', require('./uploads/bulk_image_upload'));


router.use('/users', require('./users/sign_up'));

// router.use('/testing', require('./tests'))

module.exports = router;


