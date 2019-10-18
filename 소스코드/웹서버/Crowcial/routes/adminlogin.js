const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jade = require('jade');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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

// 이 라우터 모듈은 req 객체를 파싱하는데 body-parser를 사용함.
router.use(bodyParser.urlencoded({ extended: false }));

// jade 파일 비동기적으로 로드.
const jadeFile = fs.readFileSync(path.join(__dirname, "../views/adminlogin.jade"), 'utf8');
const loginsuccessJade = fs.readFileSync(path.join(__dirname, "../views/adminlogin-success.jade"), 'utf8');

// 사용자에게 adminlogin.jade 파일을 보여준다.
router.get('/', (req, res) => {
    if (!req.session.admin) {
        res.status(200).send(jade.render(jadeFile));
    }
    else {
        var usernum = 0;
        var usermoney = 0;
        var projectnum = 0;
        var doingprojectnum = 0;
        var endprojectnum = 0;
        var query = "SELECT * FROM USER";
        db.query(query, (err, rows) => {
            usernum = rows.length;
            var query = "SELECT * FROM PROJECT";
            db.query(query, (err, rows) => {
                projectnum = rows.length;
                var query = "SELECT * FROM PROJECT WHERE DATE(PROJECT_DUE) > NOW()";
                db.query(query, (err, rows) => {
                    doingprojectnum = rows.length;
                    var query = "SELECT * FROM PROJECT WHERE DATE(PROJECT_DUE) <= NOW()";
                    db.query(query, (err, rows) => {
                        endprojectnum = rows.length;
                        var query = 'SELECT SUM(USER_NOW) AS SUMMONEY FROM USERMONEY;';
                        db.query(query, (err, rows) => {
                            usermoney = rows[0].SUMMONEY;
                            res.status(200).send(jade.render(loginsuccessJade, {
                                usernum: usernum,
                                usermoney: usermoney,
                                projectnum: projectnum,
                                doingprojectnum: doingprojectnum,
                                endprojectnum: endprojectnum
                            }));
                        });
                    });
                });
            });
        });
        
    }
});

// 사용자가 로그인 화면에서 로그인 버튼을 누르면 동작
router.post('/', (req, res) => {
    var ci = crypto.createCipher('aes192', cryptoKey);
    var id = ci.update(req.body.userid, 'utf8', 'base64');
    id += ci.final('base64');
    var ci = crypto.createCipher('aes192', cryptoKey);
    var password = ci.update(req.body.password, 'utf8', 'base64');
    password += ci.final('base64');

    // 관리자ID: crowcialman 관리자PW: asdfghjkl;'
    if (id == 'nvA5Nx9Vgzd+Pxhk24P0aA==' && password == "49rpbEGbaqPIFwRhcPZACA==") {
        req.session.login_id = "admin";
        req.session.admin = "on";

        var usernum = 0;
        var usermoney = 0;
        var projectnum = 0;
        var doingprojectnum = 0;
        var endprojectnum = 0;
        var query = "SELECT * FROM USER";
        db.query(query, (err, rows) => {
            usernum = rows.length;
            var query = "SELECT * FROM PROJECT";
            db.query(query, (err, rows) => {
                projectnum = rows.length;
                var query = "SELECT * FROM PROJECT WHERE DATE(PROJECT_DUE) > NOW()";
                db.query(query, (err, rows) => {
                    doingprojectnum = rows.length;
                    var query = "SELECT * FROM PROJECT WHERE DATE(PROJECT_DUE) <= NOW()";
                    db.query(query, (err, rows) => {
                        endprojectnum = rows.length;
                        var query = 'SELECT SUM(USER_NOW) AS SUMMONEY FROM USERMONEY;';
                        db.query(query, (err, rows) => {
                            usermoney = rows[0].SUMMONEY;
                            res.status(200).send(jade.render(loginsuccessJade, {
                                usernum: usernum,
                                usermoney: usermoney,
                                projectnum: projectnum,
                                doingprojectnum: doingprojectnum,
                                endprojectnum: endprojectnum
                            }));
                        });
                    });
                });
            });
        });
    } else {
        res.status(403).send(jade.render(jadeFile, {
            errorMsg: "올바른 관리자 정보를 입력하십시오."
        }));
    }
});

module.exports = router;