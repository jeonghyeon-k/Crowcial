const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jade = require('jade');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const device = require('express-device');
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

// jade 파일 동기적으로 로드.
const jadeFile = fs.readFileSync(path.join(__dirname, "../views/login.jade"), 'utf8');

// 사용자에게 login.jade 파일을 보여준다.
router.get('/', (req, res) => {
    if (req.device.type == 'desktop') {
        if (!req.session.admin) {
            if (!req.session.login_id) {
                res.status(200).send(jade.render(jadeFile));
            }
            else {
                res.status(200).redirect('/project/list');
            }
        } else {
            req.session.login_id = undefined;
            req.session.login_usernum = undefined;
            req.session.admin = undefined;
            res.status(200).send(jade.render(jadeFile));
        }
    }
});

// 사용자가 로그인 화면에서 로그인 버튼을 누르면 동작
router.post('/', (req, res) => {
    if (req.device.type == 'desktop') {
        db.query('SELECT * FROM USER WHERE USER_ID LIKE ' + '"' + req.body.userid + '"', (err, results) => {
            if (results.length > 0) {
                var ci = crypto.createCipher('aes192', cryptoKey);
                var ciResult = ci.update(req.body.password, 'utf8', 'base64');
                ciResult += ci.final('base64');
                if (ciResult == results[0].USER_PASS) {
                    if (results[0].USER_STOP != 1) {
                        req.session.login_id = results[0].USER_ID;
                        req.session.login_usernum = results[0].USER_NUM;
                        res.status(200).redirect('/project/list');
                    } else {
                        res.status(200).send(jade.render(jadeFile, {
                            errorMsg: "정지된 계정입니다.",
                            userid: req.body.userid,
                            password: req.body.password
                        }));
                    }
                } else {
                    res.status(200).send(jade.render(jadeFile, {
                        errorMsg: "비밀번호가 틀렸습니다.",
                        userid: req.body.userid,
                        password: req.body.password
                    }));
                }
            } else {
                res.status(200).send(jade.render(jadeFile, {
                    errorMsg: "그런 ID는 없습니다.",
                    userid: req.body.userid,
                    password: req.body.password
                }));
            }
        });
    // 모바일
    } else if (req.device.type == 'phone') {
        db.query('SELECT * FROM USER WHERE USER_ID LIKE ' + '"' + req.body.userid + '"', (err, results) => {
            if (results.length > 0) {
                var ci = crypto.createCipher('aes192', cryptoKey);
                var ciResult = ci.update(req.body.password, 'utf8', 'base64');
                ciResult += ci.final('base64');
                if (results[0].USER_STOP != 1) {
                    if (ciResult == results[0].USER_PASS) {
                        var query = "INSERT INTO SESSION (SESSION_ID, LOGIN_ID, USER_NUM) VALUES (?, ?, ?)"
                        var params = [req.sessionID, req.body.userid, results[0].USER_NUM];
                        db.query(query, params, (err, rows) => {
                            console.log("로그인 성공!");
                            console.log(results[0].USER_NUM);
                            res.json({
                                sessionId: req.sessionID,
                                userid: req.body.userid,
                                username: results[0].USER_NAME,
                                usernum: results[0].USER_NUM,
                                imageName: results[0].USER_IMAGE,
                                LOGIN_COMPLETE: true,
                                WRONG_PASSWORD: false,
                                UNKNOWN_USERID: false
                            });
                        });
                    } else {
                        res.json({
                            LOGIN_COMPLETE: false,
                            WRONG_PASSWORD: true,
                            UNKNOWN_USERID: false
                        });
                    }
                } else {
                    res.json({
                        LOGIN_COMPLETE: false,
                        WRONG_PASSWORD: false,
                        UNKNOWN_USERID: false,
                        STOPPED_ID: true
                    });
                }
            } else {
                res.json({
                    LOGIN_COMPLETE: false,
                    WRONG_PASSWORD: false,
                    UNKNOWN_USERID: true
                });
            }
        });
    }
});

// 모바일에서 사용자의 돈정보를 가져옴
router.get('/money', (req, res) => {
    if (req.device.type == 'phone') {
        var query = 'SELECT * FROM USERMONEY WHERE USER_NUM=?';
        var params = [req.query.usernum];
        db.query(query, params, (err, rows) => {
            if (err) console.log(err);

            res.status(200).json({
                money: rows[0].USER_NOW
            });
        });
    }
});

module.exports = router;