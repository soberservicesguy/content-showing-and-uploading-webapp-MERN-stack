const router = require('express').Router();

router.use('/video', require('./video_routes/videos'));
router.use('/video', require('./video_routes/video_stream'));

module.exports = router;