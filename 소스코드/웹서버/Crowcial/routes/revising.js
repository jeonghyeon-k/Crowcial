const express = require('express');
const router = express.Router();
const mysql = require('mysql'); //mysql 모듈을 로딩.
const jade = require('jade');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

router.use(bodyParser.urlencoded({extended: false}));

const connection = mysql.createConnection({
    host: 'localhost', // DB가 위치한 IP주소
    port: 3306,          // DB와 연결할 포트번호
    user: '4team',        // 계정이름
    password: 'gachon654321',    // 계정 비밀번호
    database: '4team'    // 데이터베이스 이름
});

router.get('/', function (req, res) {
    console.log(req.query.projectnum);
    req.session.projectnum=req.query.projectnum;
    var sql = "SELECT * FROM PROJECT WHERE PROJECT_NUM=?";
    var params = [req.query.projectnum];
    //console.log(params);
    connection.query(sql, params, function (err, rows) {
        res.render('revising.jade', {rows: rows});
        console.log(rows);
    });
    /*connection.getConnection(function (err, connection) {
        var sql = "";
            if (req.body.writer) {
                sql = "UPDATE PROJECT " +
                    "SET PROJECT_USERNUM=?, PROJECT_SORT=?, PROJECT_TITLE=?, PROJECT_CONTENT=?, PROJECT_DUE=?, PROJECT_DUEMONEY FROM PROJECT";
            } else {
            sql = "INSERT INTO PROJECT(PROJECT_TITLE, PROJECT_SORT, PROJECT_CONTENT, PROJECT_USERNUM, PROJECT_DUE, PROJECT_DUEMONEY) VALUES(?,?,?,?,?,?)";
        }
        connection.query(sql, data, function (err, rows) {
            if (err) console.error("err : " + err);

            res.redirect('/board1/list');
            connection.release();
        });
    });*/
});

router.post('/', function (req, res) {
    // 프로젝트 DB에 인서트.
    console.log(req.params);
     var query = 'UPDATE PROJECT SET PROJECT_SORT=?, PROJECT_NAME=?, PROJECT_CONTENT=?, PROJECT_DUE=?,';
     query += 'PROJECT_DUEMONEY=? WHERE PROJECT_NUM=?';
     var params = [req.body.category, req.body.title, req.body.content, req.body.deadline, req.body.duemoney, req.session.projectnum];
     console.log(params);
     connection.query(query, params, (err, rows) => {
         if (err) console.log(err);
         res.redirect("/project/manager");
     });
});
module.exports = router;