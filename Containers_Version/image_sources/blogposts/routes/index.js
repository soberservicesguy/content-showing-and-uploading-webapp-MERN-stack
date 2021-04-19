const router = require('express').Router();

router.use('/blogpostings', require('./blogpost/blogpost'));

module.exports = router;


