const express = require('express');
const nodemailer = require('nodemailer');
const formidable = require('formidable'); // 이 라우터 모듈은 req 객체를 파싱하는데 formidable 모듈을 사용함.
const jade = require('jade');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const device = require('express-device');
const cookieParser = require('cookie-parser');
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

// 이 라우터 모듈은 cookie-parser 모듈을 사용함.
router.use(cookieParser());

// 이 라우터 모듈은 접속한 사용자가 desktop 유저인지 phone 유저인지를 비교하는 모듈을 사용함.
router.use(device.capture());

// jade 파일 동기적으로 로드.
const registerJade = fs.readFileSync(path.join(__dirname, "../views/register.jade"), 'utf8');
const registerCompleteJade = fs.readFileSync(path.join(__dirname, "../views/register-complete.jade"), 'utf8');

// GET /auth/regsiter: 이미 로그인되었다는 정보가 세션에 있다면 메인화면으로 이동하고(나중에 수정), 아직 로그인이 안되었으면 사용하는 세션을 초기화하고 회원가입 화면을 보여준다.
router.get('/', (req, res) => {
    if (!req.session.login_id) {
        req.session.reg_mailleft = undefined; // 사용자가 이메일 인증을 받아놓고 다른 이메일로 변경해서 작성하는 경우를 방지하여 인증번호를 보냈던 이메일을 세션에 기억해둔다.
        req.session.reg_mailright = undefined;
        req.session.reg_certcode = undefined;
        req.session.reg_certified = undefined;
        res.status(200).send(jade.render(registerJade));
    } else {
        res.status(405).send('당신은 이미 로그인중인데 또 회원가입을?? ' + req.session.login_id + '님');
    }
});

// 회원가입 창에서 가입 버튼을 누르면 POST로 요청한다.
router.post('/', (req, res) => {
    if (req.device.type == "desktop") {
        var form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../public/images/profiles");
        form.parse(req, function(err, body, files) {
            var file = files.profile; // input(type="file", name="profile")에서 보내온 파일
    
            // 이메일 인증이 확인되었을때
            if (req.session.reg_certified) {
                // 패스워드 암호화
                var ci = crypto.createCipher('aes192', cryptoKey);
                var ciResult = ci.update(body.password, 'utf8', 'base64');
                ciResult += ci.final('base64');
    
                // DB에 이미 아이디가 겹치는게 존재하는지 체크함.
                db.query('SELECT * FROM USER WHERE USER_ID LIKE ' + '"' + body.userid + '"', (err, results) => {
    
                    // 이미 겹치는게 존재하면 회원가입 화면에서 alert할 수 있게 alreadyid를 on으로 설정후 사용자가 다시 입력하도록 보여줌.
                    if (results.length > 0) {
                        fs.unlink(file.path, (err) => {
                            console.log("삭제: " + file.path);
                        });
    
                        res.status(200).send(jade.render(registerJade, {
                            direct: "/auth/register",
                            method: "POST",
                            certcode: req.session.reg_certcode,
                            certified: req.session.reg_certified,
                            mailleft: req.session.reg_mailleft,
                            mailright: req.session.reg_mailright,
                            username: body.username,
                            userid: body.userid,
                            password: body.password,
                            password2: body.password2,
                            mailcert: body.mailcert,
                            bank: body.bank,
                            bankaccount: body.bankaccount,
                            checkbox1: body.checkbox1,
                            checkbox2: body.checkbox2,
                            alreadyid: "on"
                        }));
                    
                    // 겹치는게 존재하지 않으면 db에 INSERT
                    } else {
                        // 파일 이름을 현재시간.jpg or 현재시간.png로 변경
                        var date = Date.now();
                        var newPath = form.uploadDir + "/" + date + path.extname(file.name);
                        fs.rename(file.path, newPath, (err) => {
                            console.log("파일명 변경!");
                        });
    
                        // USER 테이블에 INSERT
                        var query = "INSERT INTO USER (USER_NAME, USER_ID, USER_PASS, USER_MAIL_NAME, USER_MAIL_DOMAIN, USER_BANK, USER_ACCOUNT, USER_IMAGE, USER_EXIT, USER_STOP) ";
                        query += "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        var params = [body.username, body.userid, ciResult, req.session.reg_mailleft, req.session.reg_mailright, body.bank, body.bankaccount, date, 0, 0];
                        db.query(query, params, (err, rows, fields) => {
                            // USERMONEY 테이블에 INSERT
                            var query = "INSERT INTO USERMONEY (USER_NUM, USER_NOW, USER_TOTAL, USER_PSEND) VALUES (?, ?, ?, ?)";
                            var params = [rows.insertId, 0, 0, 0];
                            db.query(query, params, (err, rows, fields) => {
                                // 회원가입 완료 화면을 보여줌.
                                res.status(200).send(jade.render(registerCompleteJade, {
                                    userid: body.userid
                                }));
                            });
                        });
                    }
                });
            }
            // 이메일 인증이 아직 확인 안되었으면 자동으로 저장된 image file을 삭제하고 화면을 다시 보여줌.
            else {
                fs.unlink(file.path, (err) => {
                    console.log("삭제: " + file.path);
                });
    
                res.status(200).send(jade.render(registerJade, {
                    direct: "/auth/register",
                    method: "POST",
                    certcode: req.session.reg_certcode,
                    certified: req.session.reg_certified,
                    username: body.username,
                    userid: body.userid,
                    password: body.password,
                    password2: body.password2,
                    mailleft: body.mailleft,
                    mailright: body.mailright,
                    mailcert: body.mailcert,
                    bank: body.bank,
                    bankaccount: body.bankaccount,
                    checkbox1: body.checkbox1,
                    checkbox2: body.checkbox2
                }));
            }
        });
    // 모바일
    } else if (req.device.type == "phone") {
        console.log('phone POST /auth/register');
        var form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../public/images/profiles");
        form.parse(req, function(err, body, files) {
            var file = files.upload; // 모바일에서 보내온 이미지 파일

            // 모바일에서 서버의 세션에 접근하는데 어려움을 겪어서 세션에 해당하는 정보를 저장소에서 가져옴
            var query = 'SELECT * FROM SESSION WHERE SESSION_ID=?';
            var params = [body.sessionid];
            db.query(query, params, (err, sessions) => {
                // 세션처럼 사용할 정보가 DB에 있는지 확인
                if (sessions.length > 0) {
                    // 이메일 인증이 확인되었을때
                    if (sessions[0].REG_CERTIFIED) {
                        var ci = crypto.createCipher('aes192', cryptoKey);
                        var ciResult = ci.update(body.password, 'utf8', 'base64');
                        ciResult += ci.final('base64');
            
                        // DB에 이미 아이디가 겹치는게 존재하는지 체크함.
                        db.query('SELECT * FROM USER WHERE USER_ID LIKE ' + '"' + body.userid + '"', (err, results) => {
                            // 이미 겹치는게 존재하면 사용자가 다시 입력하도록 메시지를 보내줌
                            if (results.length > 0) {
                                fs.unlink(file.path, (err) => {
                                    console.log("삭제: " + file.path);
                                });

                                res.json({
                                    MESSAGE: '이미 존재하는 ID입니다.'
                                });
                            // 겹치는게 존재하지 않으면 db에 INSERT
                            } else {
                                // 파일 이름을 현재시간.jpg or 현재시간.png로 변경
                                var date = Date.now();
                                var newPath = form.uploadDir + "/" + date + '.jpg';
                                fs.rename(file.path, newPath, (err) => {
                                    console.log("파일명 변경!");
                                });
            
                                // USER 테이블에 INSERT
                                var query = "INSERT INTO USER (USER_NAME, USER_ID, USER_PASS, USER_MAIL_NAME, USER_MAIL_DOMAIN, USER_BANK, USER_ACCOUNT, USER_IMAGE, USER_EXIT, USER_STOP) ";
                                query += "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                var params = [body.username, body.userid, ciResult, sessions[0].REG_MAILLEFT, sessions[0].REG_MAILRIGHT, body.bank, body.bankaccount, date, 0, 0];
                                db.query(query, params, (err, rows, fields) => {
                                    // USERMONEY 테이블에 INSERT
                                    var query = "INSERT INTO USERMONEY (USER_NUM, USER_NOW, USER_TOTAL, USER_PSEND) VALUES (?, ?, ?, ?)";
                                    var params = [rows.insertId, 0, 0, 0];
                                    db.query(query, params, (err, rows, fields) => {
                                        // 회원가입이 완료되었음을 사용자에게 알려줌
                                        res.json({
                                            USERID: body.userid,
                                            REG_COMPLETE: true
                                        });
                                    });
                                });
                            }
                        });
                    }
                    // 이메일 인증이 아직 확인 안되었으면 자동으로 저장된 image file을 삭제함
                    else {
                        fs.unlink(file.path, (err) => {
                            console.log("삭제: " + file.path);
                        });
                        res.json({
                            MESSAGE: "이메일 인증이 필요합니다."
                        });
                    }
                } else {
                    // 해당 세션id에 해당하는 데이터가 DB에 없으면 400 상태코드로 클라이언트에 응답함.
                    res.status(400).send();
                }
            });
        });
    }
});

// 회원가입 창에서 전송 버튼을 누르면 POST로 요청한다.
router.post('/mailsend', (req, res) => {
    // 데스크탑 전용
    if (req.device.type == 'desktop') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, body, files) {
            // 중복된 이메일이 이미 가입되어있는지 확인
            var query = 'SELECT USER_NUM FROM USER WHERE USER_MAIL_NAME=? AND USER_MAIL_DOMAIN=?';
            var params = [body.mailleft, body.mailright];
            db.query(query, params, (err, rows, fields) => {
                if (rows.length > 0) {
                    res.status(200).send(jade.render(registerJade, {
                        direct: "/auth/register/mailsend",
                        method: "POST",
                        message: "이미 가입된 이메일입니다",
                        certcode: req.session.reg_certcode,
                        certified: req.session.reg_certified,
                        username: body.username,
                        userid: body.userid,
                        password: body.password,
                        password2: body.password2,
                        mailleft: body.mailleft,
                        mailright: body.mailright,
                        mailcert: body.mailcert,
                        bank: body.bank,
                        bankaccount: body.bankaccount,
                        checkbox1: body.checkbox1,
                        checkbox2: body.checkbox2
                    }));
                } else {
                    // 이메일 인증을 아직 안했으면 이메일을 전송해줌.
                    if (req.session.reg_certified != "on") {
                        req.session.reg_mailleft = body.mailleft;
                        req.session.reg_mailright = body.mailright;
                        req.session.reg_certcode = String(Math.floor(Math.random() * (999999 - 100000)) + 100000);
                        console.log(req.session.reg_certcode);
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'crowcial@gmail.com',
                                pass: 'crowding123'
                            }
                        });
                    
                        var mailOptions = {
                            from: 'crowcial@gmail.com',
                            to: body.mailleft + '@' + body.mailright,
                            subject: 'Crowcial 인증번호입니다.',
                            text: '인증번호: ' + req.session.reg_certcode
                        };
                    
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (!err) {
                                console.log('Email Sent: ' + info.response);
                            } else {
                                console.log('nodemailer error: ' + err);
                            }
                        });
                    }
            
                    // 화면을 보여줌.
                    res.status(200).send(jade.render(registerJade, {
                        direct: "/auth/register/mailsend",
                        method: "POST",
                        certcode: req.session.reg_certcode,
                        certified: req.session.reg_certified,
                        username: body.username,
                        userid: body.userid,
                        password: body.password,
                        password2: body.password2,
                        mailleft: body.mailleft,
                        mailright: body.mailright,
                        mailcert: body.mailcert,
                        bank: body.bank,
                        bankaccount: body.bankaccount,
                        checkbox1: body.checkbox1,
                        checkbox2: body.checkbox2
                    }));
                }
            });
        });
    // 모바일 전용
    } else if (req.device.type == 'phone') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, body, files) {
            // 모바일에서 서버의 세션에 접근하는데 어려움을 겪어서 세션에 해당하는 정보를 저장소에서 가져옴
            var query = 'SELECT * FROM SESSION WHERE SESSION_ID=?';
            var params = [body.sessionid];
            db.query(query, params, (err, sessions) => {
                if (sessions.length > 0) {
                    // 중복된 이메일이 이미 가입되어있는지 확인
                    var query = 'SELECT USER_NUM FROM USER WHERE USER_MAIL_NAME=? AND USER_MAIL_DOMAIN=?';
                    var params = [body.mailleft, body.mailright];
                    db.query(query, params, (err, rows, fields) => {
                        if (rows.length > 0) {
                            res.json({
                                ALREADY_MAIL: true
                            });
                        } else {
                            console.log("certified여부: " + sessions[0].REG_CERTIFIED);
                            // 이메일 인증을 아직 안했으면 이메일을 전송해줌.
                            if (sessions[0].REG_CERTIFIED == null) {
                                var certcode = String(Math.floor(Math.random() * (999999 - 100000)) + 100000);
                                var query = 'UPDATE SESSION SET REG_CERTCODE=?, REG_MAILLEFT=?, REG_MAILRIGHT=? WHERE SESSION_ID=?'
                                var params = [certcode, body.mailleft, body.mailright, sessions[0].SESSION_ID];
                                db.query(query, params, (err, rows) => {
                                    console.log(certcode);
                                    
                                    var transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: 'crowcial@gmail.com',
                                            pass: 'crowding123'
                                        }
                                    });
                                
                                    var mailOptions = {
                                        from: 'crowcial@gmail.com',
                                        to: body.mailleft + '@' + body.mailright,
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

                                    res.json({
                                        MESSAGE: '인증메일이 전송되었습니다.',
                                        CERTIFIED: false
                                    });
                                });
                            } else {
                                res.json({
                                    CERTIFIED: true
                                });
                            }
                        }
                    });
                } else {
                    res.status(400).send();
                }
            });
        });
    }
});

// 회원가입 창에서 인증 버튼을 누르면 POST로 요청한다.
router.post('/mailcert', (req, res) => {
    // 데스크탑 전용
    if (req.device.type == 'desktop') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, body, files) {
            // 서버에서 인증번호를 생성하고 세션에 저장해둔 것과 사용자가 입력한 인증번호가 일치하면 인증되었음을 세션에 기록
            if (req.session.reg_certcode && !req.session.reg_certified && req.session.reg_certcode == body.mailcert) {
                req.session.reg_certified = "on";
            }
    
            // 화면을 보여줌
            res.status(200).send(jade.render(registerJade, {
                direct: "/auth/register/mailcert",
                method: "POST",
                certcode: req.session.reg_certcode,
                certified: req.session.reg_certified,
                username: body.username,
                userid: body.userid,
                password: body.password,
                password2: body.password2,
                mailleft: body.mailleft,
                mailright: body.mailright,
                mailcert: body.mailcert,
                bank: body.bank,
                bankaccount: body.bankaccount,
                checkbox1: body.checkbox1,
                checkbox2: body.checkbox2
            }));
        });
    // 모바일 전용
    } else if (req.device.type == 'phone') {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, body, files) {
            // 모바일에서 서버의 세션에 접근하는데 어려움을 겪어서 세션에 해당하는 정보를 저장소에서 가져옴
            var query = 'SELECT * FROM SESSION WHERE SESSION_ID=?';
            var params = [body.sessionid];
            db.query(query, params, (err, sessions) => {
                if (sessions.length > 0) {
                    // 서버에서 인증번호를 생성하고 세션에 저장해둔 것과 사용자가 입력한 인증번호가 일치하면 인증되었음을 세션에 기록
                    if (!sessions[0].REG_CERTIFIED) {
                        if (sessions[0].REG_CERTCODE != null) {
                            if (sessions[0].REG_CERTCODE == body.mailcert) {
                                var query = 'UPDATE SESSION SET REG_CERTIFIED=true'
                                db.query(query, (err) => {
                                    res.json({
                                        CERTIFIED: true,
                                        MESSAGE: "인증되었습니다."
                                    });
                                });
                            } else {
                                res.json({
                                    MESSAGE: "인증번호를 올바르게 입력해주세요."
                                });
                            }
                        } else {
                            res.json({
                                MESSAGE: "인증메일을 먼저 발송해주세요."
                            });
                        }
                    } else {
                        res.json({
                            MESSAGE: "이미 인증되었습니다."
                        });
                    }
                } else {
                    res.status(400).send();
                }
            });
        });
    }
});

module.exports = router;