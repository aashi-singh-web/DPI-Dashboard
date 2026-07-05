const express = require('express');
const { download } = require('../controllers/downloadController');

const router = express.Router();

router.get('/:filename', download);

module.exports = router;
