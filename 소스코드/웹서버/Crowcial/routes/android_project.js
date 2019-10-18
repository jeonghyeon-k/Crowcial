const express = require('express');
const mysql = require('mysql');
const formidable = require('formidable'); // 이 라우터 모듈은 req 객체를 파싱하는데 formidable 모듈을 사용함.
const device = require('express-device');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
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

// 이 라우터 모듈은 req 객체를 파싱하는데 body-parser를 사용함.
router.use(bodyParser.urlencoded({ extended: false }));

// 사용자가 후원한 프로젝트가 아직 모급 환급이 되지 않았다면 후원한 금액을 돌려받을 수 있음
router.post('/donation/retrieving', (req, res) => {
    console.log(req.body);

    if (req.device.type == "phone") {
        var query = 'SELECT SUM(FUND_MONEY) AS MONEY FROM FUNDPROJECT WHERE USER_NUM=? AND PROJECT_NUM=?';
        var params = [req.body.usernum, req.body.projectnum];
        db.query(query, params, (err, results) => {
            if (err) console.log(err);

            // 만약 이미 모급 환급이 된 프로젝트이면 금액을 환불하면 안되니 프로젝트 정보를 조회
            var query = 'SELECT * FROM PROJECT WHERE PROJECT_NUM=?';
            var params = [req.body.projectnum];
            db.query(query, params, (err, rows) => {
                if (err) console.log(err);

                // 아직 모금 환급이 되지 않은 상태이면 후원금 환불이 가능함
                if (rows[0].PROJECT_STATE == 0) {
                    if (req.body.money <= results[0].MONEY) {
                        // 사용자에게 금액 환불. 사용자의 USERMONEY 테이블에 USER_NOW를 증가시키고 USER_PSEND를 감소시킴
                        var query = 'UPDATE USERMONEY SET USER_NOW=USER_NOW+?, USER_PSEND=USER_PSEND-? WHERE USER_NUM=?';
                        var params = [req.body.money, req.body.money, req.body.usernum];
                        db.query(query, params, (err, rows) => {
                            if (err) console.log(err);
        
                            // 해당 프로젝트의 PROJECT_MONEY를 감소시킴
                            var query = 'UPDATE PROJECT SET PROJECT_MONEY=PROJECT_MONEY-? WHERE PROJECT_NUM=?';
                            var params = [req.body.money, req.body.projectnum];
                            db.query(query, params, (err, rows) => {
                                if (err) console.log(err);

                                // FUNDPROJECT에 사용자가 얼마만큼의 후원금을 회수했는지 기록해놓음
                                var query = 'INSERT INTO FUNDPROJECT(FUND_NUM, USER_NUM, PROJECT_NUM, FUND_DATE, FUND_MONEY) VALUES (?, ?, ?, NOW(), ?)';
                                var params = [0, req.body.usernum, req.body.projectnum, req.body.money * -1];
                                db.query(query, params, (err, rows) => {
                                    if (err) console.log(err);

                                    console.log("후원금 회수 완료!")
                                    res.status(200).json({
                                        COMPLETE: true
                                    });
                                });
                            });
                        });
                    // 금액이 충분치 않으면 NOT_ENOUGH 반환
                    } else {
                        res.status(200).json({
                            NOT_ENOUGH: true
                        });
                    }
                // 이미 환급된 프로젝트이면 ALREADY_FINISH 반환
                } else {
                    res.status(200).json({
                        ALREADY_FINISH: true
                    });
                }
            });
        });
    }
});

// 사용자가 후원한 프로젝트와 금액 목록을 조회함
router.get('/donation/lookup', (req, res) => {
    if (req.device.type == "phone") {
        // 사용자가 후원한 프로젝트들만 조회함.
        var query = 'SELECT * FROM PROJECT AS P, ';
        query += '(SELECT PROJECT_NUM, SUM(FUND_MONEY) AS MONEY FROM FUNDPROJECT WHERE USER_NUM=? GROUP BY PROJECT_NUM) AS F ';
        query += 'WHERE P.PROJECT_NUM=F.PROJECT_NUM AND MONEY <> 0';
        var params = [req.query.usernum];
        db.query(query, params, (err, projects) => {
            if (err) console.log(err);

            res.status(200).json({
                projects: projects
            });
        });
    }
});

// 사용자가 프로젝트에 후원함
router.post('/donation', (req, res) => {
    console.log(req.body);

    if (req.device.type == "phone") {
        // 본인이 주최한 프로젝트에는 후원하면 안되니 조회해본다.
        var query = 'SELECT * FROM PROJECT WHERE PROJECT_USERNUM=? AND PROJECT_NUM=?'
        var params = [req.body.usernum, req.body.projectnum];
        db.query(query, params, (err, rows) => {
            if (err) console.log(err);

            if (rows.length <= 0) {
                // 해당 프로젝트의 MONEY 정보를 업데이트한다.
                var query = 'UPDATE PROJECT SET PROJECT_MONEY=PROJECT_MONEY+? WHERE PROJECT_NUM=?';
                var params = [req.body.money, req.body.projectnum];
                db.query(query, params, (err, rows) => {
                    if (err) console.log(err);
        
                    // 사용자의 MONEY 정보를 업데이트한다.
                    var query = 'UPDATE USERMONEY SET USER_NOW=USER_NOW-?, USER_PSEND=USER_PSEND+? WHERE USER_NUM=?';
                    var params = [req.body.money, req.body.money, req.body.usernum];
                    db.query(query, params, (err, rows) => {
                        if (err) console.log(err);
        
                        // 해당 사용자가 해당 프로젝트에 얼마만큼 후원을 했음을 기록한다.
                        var query = 'INSERT INTO FUNDPROJECT(FUND_NUM, USER_NUM, PROJECT_NUM, FUND_DATE, FUND_MONEY) VALUES (?, ?, ?, NOW(), ?)';
                        var params = [0, req.body.usernum, req.body.projectnum, req.body.money];
                        db.query(query, params, (err, rows) => {
                            if (err) console.log(err);
        
                            console.log("후원 완료!");
                            res.status(200).json({
                                COMPLETE: true
                            });
                        });
                    })
                 });
            // 본인이 주최한 프로젝트에는 후원할 수 없음.
            } else {
                res.status(200).json({
                    IMPOSSIBLE: true
                });
            }
        });
    }
});

// 사용자가 해당 프로젝트에 좋아요를 했는지 안했는지를 확인해봄.
router.get('/like', (req, res) => {
    if (req.device.type == "phone") {
        // 사용자가 해당 프로젝트를 좋아요를 했는지 안했는지를 알아본다.
        var query = 'SELECT * FROM LIKEPROJECT WHERE USER_NUM=? AND PROJECT_NUM=?';
        var params = [req.query.usernum, req.query.projectnum];
        db.query(query, params, (err, rows) => {
            if (err) console.log(err);

            if (rows.length > 0) {
                res.status(200).json({
                    LIKED: true
                });
            } else {
                res.status(200).json({
                    LIKED: false
                });
            }
        });
    }
});

// 좋아요 표시 or 해제
router.post("/like", (req, res) => {
    if (req.device.type == "phone") {
        
        // 사용자가 좋아요를 클릭한 프로젝트에 이미 좋아요를 했다면 취소하고, 아니면 좋아요 한다.
        var query = 'SELECT * FROM LIKEPROJECT WHERE USER_NUM=? AND PROJECT_NUM=?';
        var params = [req.body.usernum, req.body.projectnum];
        db.query(query, params, (err, rows) => {
            if (err) console.log(err);

            // 이미 좋아요 했으면 해제
            if (rows.length > 0) {
                var query = 'DELETE FROM LIKEPROJECT WHERE USER_NUM=? AND PROJECT_NUM=?'
                var params = [req.body.usernum, req.body.projectnum];
                db.query(query, params, (err, rows) => {
                    if (err) console.log(err);

                    // 해당 프로젝트의 좋아요 수를 1 감소
                    var query = 'UPDATE PROJECT SET PROJECT_LIKE=PROJECT_LIKE-1 WHERE PROJECT_NUM=?'
                    var params = [req.body.projectnum];
                    db.query(query, params, (err, rows) => {
                        if (err) console.log(err);

                        // 해당 프로젝트의 좋아요의 수를 모바일로 보내주기 위해 조회
                        var query = 'SELECT * FROM PROJECT WHERE PROJECT_NUM=?';
                        var params = [req.body.projectnum];
                        db.query(query, params, (err, rows) => {
                            if (err) console.log(err);

                            res.status(200).json({
                                like_count: rows[0].PROJECT_LIKE,
                                INSERTED: false
                            });
                        });

                    });
                });
            // 아직 좋아요 안했으면 추가
            } else {
                var query = 'INSERT INTO LIKEPROJECT(USER_NUM, PROJECT_NUM) VALUES(?, ?)'
                var params = [req.body.usernum, req.body.projectnum];
                db.query(query, params, (err, rows) => {
                    if (err) console.log(err);

                    // 해당 프로젝트의 좋아요 수를 1 증가
                    var query = 'UPDATE PROJECT SET PROJECT_LIKE=PROJECT_LIKE+1 WHERE PROJECT_NUM=?'
                    var params = [req.body.projectnum];
                    db.query(query, params, (err, rows) => {
                        if (err) console.log(err);

                        // 해당 프로젝트의 좋아요의 수를 모바일로 보내주기 위해 조회
                        var query = 'SELECT * FROM PROJECT WHERE PROJECT_NUM=?';
                        var params = [req.body.projectnum];
                        db.query(query, params, (err, rows) => {
                            if (err) console.log(err);

                            res.status(200).json({
                                like_count: rows[0].PROJECT_LIKE,
                                INSERTED: true
                            });
                        });
                    });
                });
            }
        });
    }
})

// 프로젝트 조회
router.get('/content', (req, res) => {
    if (req.device.type == "phone") {

        // 모든 프로젝트 가져옴
        // category가 0이면 전체보기이므로 모든 프로젝트를 보여줌.
        if (req.query.category == 0) {
            // sort가 0이면 최신순, 1이면 좋아요순으로 정렬해서 보여줌.
            if (req.query.sort == 0) {
                var query = 'SELECT PROJECT_NUM, PROJECT_SORT, PROJECT_NAME, PROJECT_CONTENT, PROJECT_MONEY, PROJECT_DUEMONEY, PROJECT_IMAGE, PROJECT_DUE, PROJECT_LIKE, USER_NAME ';
                query += 'FROM PROJECT P, USER U ';
                query += 'WHERE P.PROJECT_USERNUM=U.USER_NUM ';
                query += 'ORDER BY PROJECT_DATE DESC, PROJECT_NUM DESC';
                var params = [];
            } else if (req.query.sort == 1) {
                var query = 'SELECT PROJECT_NUM, PROJECT_SORT, PROJECT_NAME, PROJECT_CONTENT, PROJECT_MONEY, PROJECT_DUEMONEY, PROJECT_IMAGE, PROJECT_DUE, PROJECT_LIKE, USER_NAME ';
                query += 'FROM PROJECT P, USER U ';
                query += 'WHERE P.PROJECT_USERNUM=U.USER_NUM ';
                query += 'ORDER BY PROJECT_LIKE DESC';
                var params = [];
            }
        } else {
            if (req.query.sort == 0) {
                var query = 'SELECT PROJECT_NUM, PROJECT_SORT, PROJECT_NAME, PROJECT_CONTENT, PROJECT_MONEY, PROJECT_DUEMONEY, PROJECT_IMAGE, PROJECT_DUE, PROJECT_LIKE, USER_NAME ';
                query += 'FROM PROJECT P, USER U ';
                query += 'WHERE P.PROJECT_USERNUM=U.USER_NUM AND PROJECT_SORT=? ';
                query += 'ORDER BY PROJECT_DATE DESC, PROJECT_NUM DESC';
                var params = [req.query.category];
            } else if (req.query.sort == 1) {
                var query = 'SELECT PROJECT_NUM, PROJECT_SORT, PROJECT_NAME, PROJECT_CONTENT, PROJECT_MONEY, PROJECT_DUEMONEY, PROJECT_IMAGE, PROJECT_DUE, PROJECT_LIKE, USER_NAME ';
                query += 'FROM PROJECT P, USER U ';
                query += 'WHERE P.PROJECT_USERNUM=U.USER_NUM AND PROJECT_SORT=? ';
                query += 'ORDER BY PROJECT_LIKE DESC';
                var params = [req.query.category];
            }
        }
        db.query(query, params, (err, projects) => {
            if (err) console.log(err);

            // 사용자가 좋아요를 누른 프로젝트가 무엇인지에 대한 정보를 가져옴
            var query = 'SELECT PROJECT_NUM FROM LIKEPROJECT WHERE USER_NUM=?'
            var params = [req.query.usernum];
            db.query(query, params, (err, likes) => {
                if (err) console.log(err);

                res.status(200).json({
                    projects: projects,
                    likes: likes
                });
            });
        });
    }
});

// 프로젝트 작성
router.post('/content', (req, res) => {
    if (req.device.type == "phone") {
        var form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, "../public/images/projects");
        form.parse(req, function(err, body, files) {
            var file = files.upload; // 모바일에서 보내온 이미지 파일

            var date = Date.now();
            var newPath = form.uploadDir + "/" + date + '.jpg';
            fs.rename(file.path, newPath, (err) => {
                console.log("파일명 변경!");
            });

            // PROJECT 테이블에 INSERT
            var query = "INSERT INTO PROJECT (PROJECT_NUM, PROJECT_SORT, PROJECT_NAME, PROJECT_CONTENT, PROJECT_USERNUM, PROJECT_DATE, PROJECT_DUE, PROJECT_MONEY, PROJECT_DUEMONEY, PROJECT_STATE, PROJECT_SPEND_FILE, PROJECT_IMAGE) ";
            query += "VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)";
            var params = [0, body.category, body.name, body.content, body.usernum, body.year+body.month+body.day, 0, body.duemoney, 0, 0, date];
            db.query(query, params, (err, rows) => {

                console.log("프로젝트 생성 완료");
                res.status(200).json({
                    COMPLETE: true
                });
            });
        });
    }
});





module.exports = router;