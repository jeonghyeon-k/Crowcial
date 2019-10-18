const express = require('express');
const router = express.Router();
const mysql = require('mysql'); //mysql 모듈을 로딩.
const jade = require('jade');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
/*
var target = document.getElementById("sort");
var category=target.options[target.selectedIndex].value;
*/
router.use(bodyParser.urlencoded({extended: false}));

const connection = mysql.createConnection({
    host: 'localhost', // DB가 위치한 IP주소
    port: 3306,          // DB와 연결할 포트번호
    user: '4team',        // 계정이름
    password: 'gachon654321',    // 계정 비밀번호
    database: '4team'    // 데이터베이스 이름
});
router.get('/', function (req, res) {
    var sql1 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_NUM DESC";
    var sql2 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_LIKE DESC";
    var sql3 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_SORT";

    console.log(req.query.order);
    switch (req.query.order) {
        default:
            connection.query(sql1, function (err, rows) {
              if (err) console.log(err);
                res.render('list.jade', {rows: rows, order:'최신순'});
            });
            break;
        case 'likeit':
            connection.query(sql2, function (err, rows) {
              if (err) console.log(err);
                res.render('list.jade', {rows: rows, order:'좋아요순'});
            });
            break;
        case 'category':
            connection.query(sql3, function (err, rows) {
              if (err) console.log(err);
                res.render('list.jade', {rows: rows, order:'카테고리별'});
            });
            break;
        }

});

//좋아요
router.get('/:id/like', (req, res)=>{
  console.log("좋아요 시도")
  projectnum = req.params.id;
  id = req.session.login_usernum;
  var query = "SELECT * FROM LIKEPROJECT AS L, USER AS U WHERE U.USER_NUM=L.USER_NUM AND U.USER_NUM = ? AND L.PROJECT_NUM=?"
  var params = [id,projectnum];
  connection.query(query, params, (err, rows) => {
      if (!rows.length > 0) {
          // 사용자가 좋아요를 아직 누르지 않은 경우
          console.log("좋아요");
          var query = "INSERT INTO LIKEPROJECT VALUES (?, ?)";
          var params = [id, projectnum];
          console.log("id  : ",id);
          console.log("projectnum : ",projectnum);
          // 사용자가 해당 프로젝트에 좋아요를 했음을 나타내기 위해 LIKEPROJECT에 인서트.
          connection.query(query, params, (err, rows) => {
              var query = "UPDATE PROJECT SET PROJECT_LIKE=PROJECT_LIKE+1 WHERE PROJECT_NUM=?"
              var params = [projectnum];
              // 해당 프로젝트의 좋아요
              connection.query(query, params, (err, rows) => {
                var sql1 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_NUM DESC";
                var sql2 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_LIKE DESC";
                var sql3 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_SORT";

                  console.log(req.params.order);
                  switch (req.params.order) {
                      default:
                          connection.query(sql1, function (err, rows) {
                            if (err) console.log(err);
                              res.render('list.jade', { rows: rows, order: '최신순' });
                              console.log(rows);
                          });
                          break;
                      case 'likeit':
                          connection.query(sql2, function (err, rows) {
                            if (err) console.log(err);
                              res.render('list.jade', { rows: rows, order: '좋아요순' });
                          });
                          break;
                      case 'category':
                          connection.query(sql3, function (err, rows) {
                            if (err) console.log(err);
                              res.render('list.jade', { rows: rows, order: '카테고리별' });
                          });
                          break;
                  }
            });
          });
      } else {
          console.log("좋아요 취소");
          projectnum = req.params.id;
          id = req.session.login_usernum;
          var query1 = "DELETE FROM LIKEPROJECT WHERE USER_NUM=? AND PROJECT_NUM=?"
          var query2 = "UPDATE PROJECT SET PROJECT_LIKE = PROJECT_LIKE-1 WHERE PROJECT_NUM =?"
          var param1 = [id, projectnum];
          var param2 = [projectnum];

          connection.query(query1, param1, function (error, results1, fields) {
              connection.query(query2, param2, function (error, results2, fields) {

                  connection.query(query, params, (err, rows) => {
                    var sql1 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_NUM DESC";
                    var sql2 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_LIKE DESC";
                    var sql3 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_SORT";
                      console.log(req.params.order);
                      switch (req.params.order) {
                          default:
                              connection.query(sql1, function (err, rows) {
                                if (err) console.log(err);
                                  res.render('list.jade', { rows: rows, order: '최신순' });
                                  console.log(rows);
                              });
                              break;
                          case 'likeit':
                              connection.query(sql2, function (err, rows) {
                                if (err) console.log(err);
                                  res.render('list.jade', { rows: rows, order: '좋아요순' });
                              });
                              break;
                          case 'category':
                              connection.query(sql3, function (err, rows) {
                                if (err) console.log(err);
                                  res.render('list.jade', { rows: rows, order: '카테고리별' });
                              });
                              break;
                      }
                  });

              });
          });

      }
  });
});


//후원
router.post('/:id/support', (req, res) => {
    console.log("후원 시도")
    projectnum = req.params.id;
    id = req.session.login_usernum;
    money = req.body.money;
    console.log("후원 금액 : ",money);
    console.log("프로젝트 번호 : ",projectnum);
    var DBsql1 = "INSERT INTO FUNDPROJECT(USER_NUM,PROJECT_NUM,FUND_DATE,FUND_MONEY) VALUES(?,?,now(),?)"; // fundproject에 후원 내역 등록
    var DBsql2 = "UPDATE PROJECT SET PROJECT_MONEY = PROJECT_MONEY+? WHERE PROJECT_NUM =?"; // project에 등록금액 갱신
    var DBsql3 = "SELECT USER_NOW FROM USERMONEY WHERE USER_NUM=?";// 유저의 보유금액
    var DBsql4 = "UPDATE USERMONEY SET USER_NOW = USER_NOW - ?,USER_PSEND=USER_PSEND+? WHERE USER_NUM=?" // 유저 보유금액 감소 및 후원한 총 금액 업데이트
    param1 = [id, projectnum, money];
    param2 = [money,projectnum];
    param3 = [money,money,id]
    connection.query(DBsql3 ,id, function(error,rows,fiels){
    usermoney = rows[0].USER_NOW;
    console.log("유저 보유 금액",usermoney);
    //후원하고자 하는 금약아 보유한 금액보다 많은지 비교
    if(usermoney < money){
      console.log("후원 할 금액 초가")
      var sql1 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_NUM DESC";
      var sql2 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_LIKE DESC";
      var sql3 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_SORT";

      console.log(req.params.order);
  switch (req.params.order) {
      default:
          connection.query(sql1, function (err, rows) {
            if (err) console.log(err);
              res.render('list.jade', { rows: rows, order: '최신순' });

          });
          break;
      case 'likeit':
          connection.query(sql2, function (err, rows) {
            if (err) console.log(err);
              res.render('list.jade', { rows: rows, order: '좋아요순' });
          });
          break;
      case 'category':
          connection.query(sql3, function (err, rows) {
            if (err) console.log(err);
              res.render('list.jade', { rows: rows, order: '카테고리별' });
          });
          break;
        }
    }
    else
    {
    connection.query(DBsql1, param1, function (error, results1, fields) {
        connection.query(DBsql2, param2, function (error, results2, fields) {
          connection.query(DBsql4,param3, function(error,results, fields){


            var sql1 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_NUM DESC";
            var sql2 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_LIKE DESC";
            var sql3 = "SELECT * FROM PROJECT P, USER U WHERE P.PROJECT_USERNUM=U.USER_NUM ORDER BY P.PROJECT_SORT";

                console.log(req.params.order);
            switch (req.params.order) {
                default:
                    connection.query(sql1, function (err, rows) {
                      if (err) console.log(err);
                        res.render('list.jade', { rows: rows, order: '최신순' });

                    });
                    break;
                case 'likeit':
                    connection.query(sql2, function (err, rows) {
                      if (err) console.log(err);
                        res.render('list.jade', { rows: rows, order: '좋아요순' });
                    });
                    break;
                case 'category':
                    connection.query(sql3, function (err, rows) {
                      if (err) console.log(err);
                        res.render('list.jade', { rows: rows, order: '카테고리별' });
                    });
                    break;
            }
    });
  });
});
}
});
});

module.exports = router;
