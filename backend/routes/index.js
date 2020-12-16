const router = require('express').Router();

router.use('/users', require('./users/users'));
router.use('/video_stream', require('./videos/video_stream'));
router.use('/push_notifications', require('./push_notifications/push_notifications'));
router.use('/paypal_payments', require('./paypal_payments/paypal_payments'));
router.use('/stripe_payments', require('./stripe_payments/stripe_payments'));

router.use('/blogposts', require('./blogposts/blogposts'));
router.use('/videos', require('./videos/videos'));
router.use('/images', require('./images/images'));

router.use('/avatar-uploads', require('./uploads/upload_user_avatar_image'));
router.use('/content-uploads', require('./uploads/upload_images_by_user'));

router.use('/uploads-video', require('./uploads/upload_video'));


module.exports = router;