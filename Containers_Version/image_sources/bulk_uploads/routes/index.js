const router = require('express').Router();


router.use('/uploads', require('./uploads/bulk_blogpost_upload'));
router.use('/uploads', require('./uploads/bulk_video_upload'));
router.use('/uploads', require('./uploads/bulk_image_upload'));


module.exports = router;