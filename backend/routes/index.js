const router = require('express').Router();

router.use('/users', require('./users/users'));
router.use('/video-stream', require('./videos/video_stream'));

router.use('/push_notifications', require('./push_notifications/push_notifications'));
router.use('/paypal_payments', require('./paypal_payments/paypal_payments'));
router.use('/stripe_payments', require('./stripe_payments/stripe_payments'));

router.use('/blogpostings', require('./blogpost/blogpost'));
router.use('/videos', require('./videos/videos'));
router.use('/images', require('./images/images'));

// router.use('/avatar-uploads', require('./uploads/upload_user_avatar_image'));
router.use('/image-uploads', require('./uploads/upload_images_by_user'));
router.use('/video-uploads', require('./uploads/upload_video'));


router.use('/uploads', require('./uploads/bulk_blogpost_upload'));
router.use('/uploads', require('./uploads/bulk_video_upload'));
router.use('/uploads', require('./uploads/bulk_image_upload'));


router.use('/users', require('./users/sign_up'));

// router.use('/testing', require('./tests'))

module.exports = router;


