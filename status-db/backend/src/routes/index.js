const express = require('express');

async function index(req, res, next) {
    res.render('index', { title: 'Express' });
}

const router = express.Router();

router.get('/', index);

module.exports = router;
