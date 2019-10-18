const express = require('express');
const jade = require('jade');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// jade 파일 비동기적으로 로드.
const jadeFile = fs.readFileSync(path.join(__dirname, "../views/adminlogin.jade"), 'utf8');

// 사용자에게 adminlogin.jade 파일을 보여준다.
router.get('/', (req, res) => {
    req.session.login_id = undefined;
    req.session.admin = undefined;
    res.status(200).send(jade.render(jadeFile));
});


module.exports = router;