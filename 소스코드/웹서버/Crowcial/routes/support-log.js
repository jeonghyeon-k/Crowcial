const express = require('express');
const mysql = require('mysql');
const jade = require('jade');
const fs = require('fs');
const path = require('path');
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

// jade 파일 비동기적으로 로드.
const jadeFile = fs.readFileSync(path.join(__dirname, "../views/support-log.jade"), 'utf8');

// 사용자에게 jade 파일을 보여준다.
router.get('/', (req, res) => {
    if (req.session.admin) {
        var query = 'SELECT FUND_NUM, USER_NAME, USER_ID, PROJECT_NAME, F.PROJECT_NUM, FUND_DATE, FUND_MONEY ';
        query += 'FROM FUNDPROJECT AS F, USER AS U, PROJECT AS P ';
        query += 'WHERE F.USER_NUM=U.USER_NUM AND F.PROJECT_NUM=P.PROJECT_NUM ';
        db.query(query, (err, rows) => {
            res.status(200).send(jade.render(jadeFile, {
                rows: rows
            }));
        });
    }
});

module.exports = router;