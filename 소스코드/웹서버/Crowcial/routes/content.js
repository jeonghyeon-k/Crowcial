const express = require('express');
const router = express.Router();
const mysql = require('mysql'); //mysql 모듈을 로딩.
const jade = require('jade');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const jadeFile = fs.readFileSync(path.join(__dirname, "../views/list/content.jade"), 'utf8');

router.get('/content', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        console.log("rows : " + "select * from PROJECT" + req.query.brdno);
        connection.query("select P.PROJECT_NO=?, P.PROJECT_TITLE, P.PROJECT_SORT, P.PROJECT_WRITER, P.PROJECT_DUE, P.PROJECT_MONEY, P.PROJECT_DUEMONEY, H.LIKE_COUNT from PROJECT P, HEART H WHERE P.PROJECT_NUM=H.LIKE_NUM" + req.query.brdno, function (err, rows) {
            if (err) {
                console.log("err : " + err);
            } else {
                console.log("rows : " + JSON.stringify(rows));
                //res.render('list', {rows: rows ? rows : {}});
                res.send(jade.render(jadeFile, {
                    rows: rows
                }));
            }
            connection.release();
        });
    });
});