const express = require('express');
const jade = require('jade');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const device = require('express-device');
const router = express.Router();

// 이 라우터 모듈은 db를 사용함.
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: '4team',
    password: 'gachon654321',
    database: '4team'
});

// 이 라우터 모듈은 접속한 사용자가 desktop 유저인지 phone 유저인지를 비교하는 모듈을 사용함.
router.use(device.capture());

// jade 파일 동기적으로 로드.
const jadeFile = fs.readFileSync(path.join(__dirname, "../views/login.jade"), 'utf8');

// 사용자에게 login.jade 파일을 보여준다.
router.get('/', (req, res) => {
    if (req.device.type == 'desktop') {
        req.session.login_id = undefined;
        req.session.login_usernum = undefined;
        req.session.admin = undefined;
        res.redirect('/auth/userlogin');
    } else if (req.device.type == 'phone') {
        if (req.query.sessionid) {
            var query = 'DELETE FROM SESSION WHERE SESSION_ID=?';
            var params = [req.query.sessionid];
            db.query(query, params, (err, rows) => {
                if (err) console.log(err);
                res.json({});
            });
        }
    }
});


module.exports = router;