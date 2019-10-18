const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jade = require('jade');
const nodemailer = require('nodemailer')
const fs = require('fs');
const path = require('path');
const crypto = require('crypto')
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
const usersearchJade = fs.readFileSync(path.join(__dirname, "../views/usersearch.jade"), 'utf8');
const newpasswordJade = fs.readFileSync(path.join(__dirname, "../views/usersearch-newpassword.jade"), 'utf8');
const newpasswordCompleteJade = fs.readFileSync(path.join(__dirname, "../views/usersearch-newpassword-complete.jade"), 'utf8');

// GET 접속하면 화면을 보여줌.
router.get('/', (req, res) => {
    req.session.search_userid = undefined;
    req.session.search_mailleft = undefined; // 사용자가 이메일 인증을 받아놓고 다른 이메일로 변경해서 작성하는 경우를 방지하여 인증번호를 보냈던 이메일을 세션에 기억해둔다.
    req.session.search_mailright = undefined;
    req.session.search_certcode = undefined;
    req.session.search_certified = undefined;
    res.status(200).send(jade.render(usersearchJade));
});

// 아이디 찾기의 양식을 입력후 버튼을 클릭하면 GET 요청으로 사용자가 가입한 아이디를 보여줌.
router.get('/id', (req, res) => {
    if (req.device.type == 'desktop') {
        if (req.query.username && req.query.mailleft && req.query.mailright) {
            var query = 'SELECT USER_ID FROM USER WHERE USER_NAME LIKE ';
            query += '"' + req.query.username + '" AND USER_MAIL_NAME LIKE ';
            query += '"' + req.query.mailleft + '" AND USER_MAIL_DOMAIN LIKE ';
            query += '"' + req.query.mailright + '"';
            db.query(query, (err, results) => {
                if (results.length > 0) {
                    res.status(200).send(jade.render(usersearchJade, {
                        direct: '/auth/user/search/id',
                        method: "GET",
                        message: "가입하신 ID: ",
                        id: results[0].USER_ID
                    }));
                } else {
                    res.status(200).send(jade.render(usersearchJade, {
                        direct: '/auth/user/search/id',
                        message: '가입하신 계정이 없습니다.'
                    }));
                }
            });
        }
    // 모바일
    } else if (req.device.type == 'phone') {
        var query = 'SELECT USER_ID FROM USER WHERE USER_NAME LIKE ';
        query += '"' + req.query.username + '" AND USER_MAIL_NAME LIKE ';
        query += '"' + req.query.mailleft + '" AND USER_MAIL_DOMAIN LIKE ';
        query += '"' + req.query.mailright + '"';
        db.query(query, (err, results) => {
            if (results.length > 0) {
                res.status(200).json({
                    HAVE_ACCOUNT: true,
                    id: results[0].USER_ID
                });
            } else {
                res.status(200).json({
                    HAVE_ACCOUNT: false
                });
            }
        });
    }
});

// 회원가입 창에서 전송 버튼을 누르면 GET으로 요청한다.
router.get('/mailsend', (req, res) => {
    if (req.device.type == 'desktop') {
        // 이메일 인증을 아직 안했으면 이메일을 전송해줌.
        if (req.session.search_certified != "on") {
            var query = 'SELECT * FROM USER WHERE USER_NAME LIKE ';
            query += '"' + req.query.username + '" AND USER_MAIL_NAME LIKE ';
            query += '"' + req.query.mailleft + '" AND USER_MAIL_DOMAIN LIKE ';
            query += '"' + req.query.mailright + '" AND USER_ID LIKE ';
            query += '"' + req.query.userid + '"';
            db.query(query, (err, results) => {
                if (results.length > 0) {
                    req.session.search_userid = req.query.userid;
                    req.session.search_mailleft = req.query.mailleft;
                    req.session.search_mailright = req.query.mailright;
                    req.session.search_certcode = String(Math.floor(Math.random() * (999999 - 100000)) + 100000);
            
                    console.log(req.session.search_certcode);
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'crowcial@gmail.com',
                            pass: 'crowding123'
                        }
                    });
                
                    var mailOptions = {
                        from: 'crowcial@gmail.com',
                        to: req.query.mailleft + '@' + req.query.mailright,
                        subject: 'Crowcial 인증번호입니다.',
                        text: '인증번호: ' + req.session.search_certcode
                    };
                
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (!err) {
                            console.log('Email Sent: ' + info.response);
                        } else {
                            console.log('nodemailer error: ' + err);
                        }
                    });

                    res.status(200).send(jade.render(usersearchJade, {
                        direct: '/auth/user/search/mailsend',
                        method: "GET",
                        message: '인증메일이 전송되었습니다.',
                        username: req.query.username,
                        userid: req.query.userid,
                        mailleft: req.query.mailleft,
                        mailright: req.query.mailright,
                        mailcert: req.query.mailcert
                    }));
                } else {
                    res.status(200).send(jade.render(usersearchJade, {
                        direct: '/auth/user/search/mailsend',
                        method: "GET",
                        message: '입력하신 정보로 가입된 계정이 없습니다.',
                        username: req.query.username,
                        userid: req.query.userid,
                        mailleft: req.query.mailleft,
                        mailright: req.query.mailright,
                        mailcert: req.query.mailcert
                    }));
                }
            });
        } else {
            res.status(200).send(jade.render(usersearchJade, {
                direct: '/auth/user/search/mailsend',
                method: "GET",
                username: req.query.username,
                userid: req.query.userid,
                mailleft: req.query.mailleft,
                mailright: req.query.mailright,
                mailcert: req.query.mailcert
            }));
        }
    // 모바일
    } else if (req.device.type == 'phone') {
        // 모바일에서 서버의 세션에 접근하는데 어려움을 겪어서 세션에 해당하는 정보를 저장소에서 가져옴
        var query = 'SELECT * FROM SESSION WHERE SESSION_ID=?';
        var params = [req.query.sessionid];
        db.query(query, params, (err, sessions) => {
            // 유효한 세션인지 확인
            if (sessions.length > 0) {
                // 이메일 인증을 아직 안했으면 이메일을 전송해줌.
                if (sessions[0].SEARCH_CERTIFIED != true) {
                    var query = 'SELECT * FROM USER WHERE USER_NAME LIKE ';
                    query += '"' + req.query.username + '" AND USER_MAIL_NAME LIKE ';
                    query += '"' + req.query.mailleft + '" AND USER_MAIL_DOMAIN LIKE ';
                    query += '"' + req.query.mailright + '" AND USER_ID LIKE ';
                    query += '"' + req.query.userid + '"';
                    db.query(query, (err, results) => {
                        if (results.length > 0) {
                            var certcode = String(Math.floor(Math.random() * (999999 - 100000)) + 100000);
                            console.log(certcode);
                            var query = 'UPDATE SESSION SET SEARCH_CERTCODE=?, SEARCH_USERID=?, SEARCH_MAILLEFT=?, SEARCH_MAILRIGHT=? WHERE SESSION_ID=?';
                            var params = [certcode, req.query.userid, req.query.mailleft, req.query.mailright, sessions[0].SESSION_ID];
                            db.query(query, params, (err, results) => {
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'crowcial@gmail.com',
                                        pass: 'crowding123'
                                    }
                                });
                            
                                var mailOptions = {
                                    from: 'crowcial@gmail.com',
                                    to: req.query.mailleft + '@' + req.query.mailright,
                                    subject: 'Crowcial 인증번호입니다.',
                                    text: '인증번호: ' + certcode
                                };
                            
                                transporter.sendMail(mailOptions, (err, info) => {
                                    if (!err) {
                                        console.log('Email Sent: ' + info.response);
                                    } else {
                                        console.log('nodemailer error: ' + err);
                                    }
                                });

                                res.status(200).json({
                                    MESSAGE: '인증메일이 전송되었습니다.'
                                });
                            });
                        } else {
                            res.status(200).json({
                                MESSAGE: '입력하신 정보로 가입된 계정이 없습니다.'
                            });
                        }
                    });
                } else {
                    res.status(200).json({
                        MESSAGE: '이미 인증되었습니다.'
                    });
                }
            } else {
                res.status(400).send();
            }
        });
    }
});

router.get('/mailcert', (req, res) => {
    if (req.device.type == 'desktop') {
        // 서버에서 인증번호를 생성하고 세션에 저장해둔 것과 사용자가 입력한 인증번호가 일치하면 인증되었음을 세션에 기록
        var message = undefined;
        if (!req.session.search_certified) {
            if (req.session.search_certcode) {
                if (req.session.search_certcode == req.query.mailcert) {
                    req.session.search_certified = "on";
                    message = "이메일 인증이 완료되었습니다."
                } else {
                    message = "인증번호가 틀렸습니다."
                }
            } else {
                message = "인증메일을 먼저 전송해주세요."
            }
        }
    
        res.status(200).send(jade.render(usersearchJade, {
            direct: '/auth/user/search/mailcert',
            method: "GET",
            message: message,
            username: req.query.username,
            userid: req.query.userid,
            mailleft: req.query.mailleft,
            mailright: req.query.mailright,
            mailcert: req.query.mailcert,
            certified: req.session.search_certified
        }));
    // 모바일
    } else if (req.device.type == 'phone') {
        // 모바일에서 서버의 세션에 접근하는데 어려움을 겪어서 세션에 해당하는 정보를 저장소에서 가져옴
        var query = 'SELECT * FROM SESSION WHERE SESSION_ID=?';
        var params = [req.query.sessionid];
        db.query(query, params, (err, sessions) => {
            // 유효한 세션인지 확인
            if (sessions.length > 0) {
                if (sessions[0].SEARCH_CERTIFIED != true) {
                    if (sessions[0].SEARCH_CERTCODE != null) {
                        if (req.query.mailcert == sessions[0].SEARCH_CERTCODE) {
                            var query = 'UPDATE SESSION SET SEARCH_CERTIFIED=true WHERE SESSION_ID=?';
                            var params = [req.query.sessionid];
                            db.query(query, params, (err, rows) => {
                                res.status(200).json({
                                    MESSAGE: '이메일 인증이 완료되었습니다.'
                                });
                            });
                        } else {
                            res.status(200).json({
                                MESSAGE: '인증번호가 틀렸습니다.'
                            });
                        }
                    } else {
                        res.status(200).json({
                            MESSAGE: '인증메일을 먼저 전송해주세요.'
                        });
                    }
                } else {
                    res.status(200).json({
                        MESSAGE: '이미 인증되었습니다.'
                    });
                }
            } else {
                res.status(400).send();
            }
        });
    }
});

router.get('/pw', (req, res) => {
    // 이메일 인증이 확인되었을때에만 새로운 비밀번호 입력화면을 띄워줌.
    if (req.session.search_certified) {
        var query = 'SELECT * FROM USER WHERE USER_ID LIKE ';
        query += '"' + req.session.search_userid + '" AND USER_MAIL_NAME LIKE ';
        query += '"' + req.session.search_mailleft + '" AND USER_MAIL_DOMAIN LIKE ';
        query += '"' + req.session.search_mailright + '"';

        db.query(query, (err, results) => {
            if (results.length > 0) {
                res.status(200).send(jade.render(usersearchJade, {
                    direct: '/auth/user/search/pw',
                    method: "GET",
                    username: req.query.username,
                    userid: req.query.userid,
                    mailleft: req.query.mailleft,
                    mailright: req.query.mailright,
                    mailcert: req.query.mailcert,
                    tonewpassword: "on"
                }));
            } else {
                res.status(200).send(jade.render(usersearchJade, {
                    direct: '/auth/user/search/pw',
                    method: "GET",
                    message: '입력하신 정보로 가입된 계정이 없습니다.',
                    username: req.query.username,
                    userid: req.query.userid,
                    mailleft: req.query.mailleft,
                    mailright: req.query.mailright,
                    mailcert: req.query.mailcert
                }));
            }
        });
    } else {
        res.status(200).send(jade.render(usersearchJade, {
            direct: '/auth/user/search/pw',
            method: 'GET',
            message: '이메일 인증이 필요합니다.',
            username: req.query.username,
            userid: req.query.userid,
            mailleft: req.query.mailleft,
            mailright: req.query.mailright,
            mailcert: req.query.mailcert
        }));
    }
});

router.get('/pw/new', (req, res) => {
    // 데스크탑
    if (req.device.type == 'desktop') {
        if (req.session.search_userid) {
            res.status(200).send(jade.render(newpasswordJade, {
                userid: req.session.search_userid
            }));
        } else {
            res.status(200).send("부적절한 접근");
        }
    // 모바일
    } else if (req.device.type == 'phone') {
        // 모바일에서 서버의 세션에 접근하는데 어려움을 겪어서 세션에 해당하는 정보를 저장소에서 가져옴
        var query = 'SELECT * FROM SESSION WHERE SESSION_ID=?';
        var params = [req.query.sessionid];
        db.query(query, params, (err, sessions) => {
            if (sessions.length > 0) {
                if (sessions[0].SEARCH_CERTIFIED == true) {
                    res.status(200).json({
                        CERTIFIED: true,
                        USER_ID: sessions[0].SEARCH_USERID
                    });
                } else {
                    res.status(200).json({
                        CERTIFIED: false
                    });
                }
            } else {
                res.status(400).send();
            }
        });
    }
});

router.post('/pw/new', (req, res) => {
    // 데스크탑
    if (req.device.type == 'desktop') {
        var ci = crypto.createCipher('aes192', cryptoKey);
        var ciResult = ci.update(req.body.password, 'utf8', 'base64');
        ciResult += ci.final('base64');
        var query = "UPDATE USER SET USER_PASS=? WHERE USER_ID=?";
        var params = [ciResult, req.session.search_userid]
        db.query(query, params, (err, rows, fields) => {
            if (!err) {
                res.status(200).send(jade.render(newpasswordCompleteJade));
            } else {
                res.status(200).send("비밀번호 변경 실패");
            }
        });
    // 모바일
    } else if (req.device.type == 'phone') {
        // 모바일에서 서버의 세션에 접근하는데 어려움을 겪어서 세션에 해당하는 정보를 저장소에서 가져옴
        var query = 'SELECT * FROM SESSION WHERE SESSION_ID=?';
        var params = [req.body.sessionid];
        db.query(query, params, (err, sessions) => {
            if (sessions.length > 0) {
                var ci = crypto.createCipher('aes192', cryptoKey);
                var ciResult = ci.update(req.body.password, 'utf8', 'base64');
                ciResult += ci.final('base64');
                var query = "UPDATE USER SET USER_PASS=? WHERE USER_ID=?";
                var params = [ciResult, sessions[0].SEARCH_USERID];
                db.query(query, params, (err) => {
                    res.status(200).json({
                        PASS_CHANGED: true
                    });
                });
            } else {
                res.status(400).send();
            }
        });
    }
});

module.exports = router;