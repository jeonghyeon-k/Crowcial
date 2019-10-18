const express = require('express');
const mysql = require('mysql');
const jade = require('jade');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const router = express.Router();

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
const jadeFile = fs.readFileSync(path.join(__dirname, "../views/adminproject.jade"), 'utf8');

// 사용자에게 jade 파일을 보여준다.
router.get('/', (req, res) => {
    if (req.session.admin) {
        var query = 'SELECT * FROM PROJECT WHERE PROJECT_DUE > NOW()';
        db.query(query, (err, rows1) => {
            if (err) console.log(err);
            var query = 'SELECT * FROM PROJECT WHERE PROJECT_DUE < NOW() AND PROJECT_STATE=0';
            db.query(query, (err, rows2) => {
                if (err) console.log(err);
                var query = 'SELECT * FROM PROJECT WHERE PROJECT_STATE=1';
                db.query(query, (err, rows3) => {
                    if (err) console.log(err);
                    console.log("adminproject.js");
                    console.log(rows1);
                    res.status(200).send(jade.render(jadeFile, {
                        rows1: rows1,
                        rows2: rows2,
                        rows3: rows3
                    }));
                });
            });
        });
    }
});

// 모금 환급
router.post('/payment', (req, res) => {
    if (req.session.admin) {
        if (req.body.progress > 100.0) {
            var query = "UPDATE PROJECT SET PROJECT_STATE=? WHERE PROJECT_NUM=?";
            var params = [1, req.body.projectnum];
            db.query(query, params, (err, rows) => {
                if (!err) {
                    var query = 'SELECT * FROM PROJECT WHERE PROJECT_NUM=?';
                    var params = [req.body.projectnum];
        
                    // rows1은 진행중인 프로젝트들의 정보, rows2는 완료된 프로젝트들의 정보, row3은 모금 환급 완료된 프로젝트들의 정보이다.
                    var query = 'SELECT * FROM PROJECT WHERE PROJECT_DUE > NOW()';
                    db.query(query, (err, rows1) => {
                        var query = 'SELECT * FROM PROJECT WHERE PROJECT_DUE < NOW() AND PROJECT_STATE=0';
                        db.query(query, (err, rows2) => {
                            var query = 'SELECT * FROM PROJECT WHERE PROJECT_STATE=1';
                            db.query(query, (err, rows3) => {
                                res.status(200).send(jade.render(jadeFile, {
                                    rows1: rows1,
                                    rows2: rows2,
                                    rows3: rows3
                                }));
                            });
                        });
                    });
                } else {
                    console.log("프로젝트 모금환급 error");
                }
            });
        }
    }
});

// 프로젝트 제거
router.post('/removal', (req, res) => {
    if (req.session.admin) {
        console.log(req.body);

        // 외래키 제약 조건 때문에 지워지지 않아서 설정
        var query = 'SET FOREIGN_KEY_CHECKS=0';
        db.query(query, () => {
            // 프로젝트 테이블에서 삭제
            var query = 'DELETE FROM PROJECT WHERE PROJECT_NUM=?';
            var params = [req.body.projectnum];
            db.query(query, params, (err, rows) => {
                if (err) console.log(err);
    
                // FUNDPROJECT 테이블에서 사용자가 후원한 내역 삭제
                var query = 'DELETE FROM FUNDPROJECT WHERE PROJECT_NUM=?';
                var params = [req.body.projectnum];
                db.query(query, params, (err, rows) => {
                    if (err) console.log(err);
    
                    // LIKEPROJECT 테이블에서 사용자가 좋아요한 내역 삭제
                    var query = 'DELETE FROM LIKEPROJECT WHERE PROJECT_NUM=?';
                    var params = [req.body.projectnum];
                    db.query(query, params, (err, rows) => {
                        if (err) console.log(err);
    
                        console.log(req.body.projectnum + "번 프로젝트 삭제 완료");
                        res.redirect('/project/manager/');
                    });
                });
            });
        });
    }
});

module.exports = router;