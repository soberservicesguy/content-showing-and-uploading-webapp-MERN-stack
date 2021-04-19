const router = require('express').Router();


router.use('/image', require('./image_routes/image'));


module.exports = router;