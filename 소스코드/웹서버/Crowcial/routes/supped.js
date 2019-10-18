const fs = require('fs');
const jade = require('jade');
const ejs = require('ejs');
const mysql = require('mysql');
const express = require('express');
const path = require('path');
const router = express.Router();

const client = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: '4team',
    password: 'gachon654321',
    database: '4team'
});

router.get('/', function (req, res) {
    fs.readFile(path.join(__dirname, "../views/supped.jade"), 'utf8', function (err, data) {
        if (err) {
            console.log("supped.jade 파일 오류");
        } else {

            //data : session.login_id;
            //client.query('SELECT * FROM FUND-PROJECT, LIKE-PROJECT WHERE USER_NUM=? AND FUND-PROJECT.PROJECT-NUM=LIKE-PROJECT.PROJECT-NUM ', [body.userid], (error, results) => {
            //    res.send(ejs.render(item, {
            //        item: results
            //    }))
            //});
            //client.query('SELECT * FROM LIKEPROJECT, PROJECT, LIKE WHERE USER_NUM=? AND  LIEKPROJECT.PROJECT_NUM = PROJECT.PROJECT_NUM AND LIKE.LIKE_NUM = LIKEPROJECT ', [body.userid], (error, results) => {
            //    res.send(ejs.render(item2, {
            //        item2: results
            //    }))
            //});

        }
    });
});

//router.post('/', (req, res) => {
//    fs.readFile(path.join(__dirname, "../views/supped.jade"), 'utf8', function (err, data) {
//        if (err) {
//            console.log("supped.jade 파일 오류");
//        } else {
//            //data : req.userid;
//        }
//    });
//    //db.query('UPDATE USER SET USER_EXIT=? WHERE USER_NUM=?', [1, req.session.userid], () => {
//    //     회원수정 완료 화면을 보여줌.
//    //    res.status(200).send(jade.render(userdeleteCompleteJade, {
//    //        userid: body.userid
//    //    }));
//    //}
//    //);
//    res.status(200).redirect('/auth/user');
//});

//router.post('/supportDEL', (req, res) => {

//    res.status(200).redirect('/auth/user');

//});



module.exports = router;