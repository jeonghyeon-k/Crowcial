const express = require('express');
const device = require('express-device');
const formidable = require('formidable'); // 이 라우터 모듈은 req 객체를 파싱하는데 formidable 모듈을 사용함.
const mysql = require('mysql');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const cryptoKey = "Crowcial만 알 수 있는 비밀 키";

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

// 이 라우터 모듈은 req 객체를 파싱하는데 body-parser를 사용함.
router.use(bodyParser.urlencoded({ extended: false }));

// 모바일에 사용자의 정보들을 보내줌.
router.get('/', (req, res) => {
    if (req.device.type == 'phone') {

        // 해당 사용자의 정보를 USER 테이블에서 읽어서 반환해줌
        var query = 'SELECT * FROM USER WHERE USER_NUM=?';
        var params = [req.query.usernum];
        db.query(query, params, (err, rows) => {
            res.status(200).json({
                username: rows[0].USER_NAME,
                userbank: rows[0].USER_BANK,
                userbankaccount: rows[0].USER_ACCOUNT
            });
        });
    }
});

// 사용자의 정보를 업데이트함
router.post('/', (req, res) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "../public/images/profiles");
    form.parse(req, function(err, body, files) {
        var file = files.upload; // 모바일에서 보내온 이미지 파일

        // 받아온 비밀번호를 암호화
        var ci = crypto.createCipher('aes192', cryptoKey);
        var ciResult = ci.update(body.password, 'utf8', 'base64');
        ciResult += ci.final('base64');

        // 받아온 이미지 파일의 이름을 변경 (현재 Date값으로 지정)
        var date = Date.now();
        var newPath = form.uploadDir + "/" + date + '.jpg';
        fs.rename(file.path, newPath, (err) => {
            console.log("파일명 변경!");
        });

        // DB의 유저 정보를 변경
        var query = 'UPDATE USER SET USER_NAME=?, USER_PASS=?, USER_BANK=?, USER_ACCOUNT=?, USER_IMAGE=? WHERE USER_NUM=?';
        var params = [body.username, ciResult, body.userbank, body.userbankaccount, date, body.usernum];
        db.query(query, params, (err, rows) => {
            if (err) console.log(err);

            res.status(200).json({
                imagename: date,
                COMPLETE: true
            });
        });
    });
});

// 회원 탈퇴 신청을 함
router.post('/exit', (req, res) => {
    console.log(req.body);

    if (req.device.type == 'phone') {
        var query = 'UPDATE USER SET USER_EXIT=1 WHERE USER_NUM=?';
        var params = [req.body.usernum];
        db.query(query, params, (err, rows) => {
            if (err) console.log(err);

            console.log("회원 탈퇴 신청 완료");
            res.status(200).json({
                COMPLETE: true
            });
        });
    }
});



module.exports = router;