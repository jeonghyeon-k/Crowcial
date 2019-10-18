const express = require('express');
const bodyParser = require('body-parser');
const jade = require('jade');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const router = express.Router();
const cryptoKey = "Crowcial만 알 수 있는 비밀 키";
const device = require('express-device');

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
router.use(bodyParser.urlencoded({ extended: false }));


const userJade = fs.readFileSync(path.join(__dirname, "../views/user.jade"), 'utf8');
const userCompleteJade = fs.readFileSync(path.join(__dirname, "../views/user-complete.jade"), 'utf8');
const suppedJade = fs.readFileSync(path.join(__dirname, "../views/supped.jade"), 'utf8');

router.get('/', (req, res) => {

    var sql = 'SELECT * FROM USER WHERE USER_NUM= ? '
    var param = req.session.login_usernum;
    console.log(sql);
    console.log(param);
    db.query(sql, param, function (error, results, fields) {
            console.log(results);
            res.render('user.jade', { good: results});
    });

});

router.post('/', function (req, res) {

if (req.device.type == 'desktop'){

    var id = req.session.login_id;
        if (!req.body.username == '') {
            var sql = 'UPDATE USER SET USER_NAME=? WHERE USER_ID=?'
            var username = req.body.username
            var param = [username, id];
            db.query(sql, param, function (error, results, fields) {
                console.log("이름 수정 완료");
            });
        }
        if (!req.body.userid == '') {
            var sql = 'UPDATE USER SET USER_ID=? WHERE USER_ID=?'
            var userid = req.body.userid
            var param = [userid, id];
            db.query(sql, param, function (error, results, fields) {
                console.log("아이디 수정 완료");
            });
        }
        if (!req.body.password == '') {
            var ci = crypto.createCipher('aes192', cryptoKey);
            var ciResult = ci.update(req.body.password, 'utf8', 'base64');
            ciResult += ci.final('base64');
            var sql = 'UPDATE USER SET USER_PASS=? WHERE USER_ID=?'
            var param = [ciResult, id];
            db.query(sql, param, function (error, results, fields) {
                console.log("비밀번호 수정 완료");
            });
        }
        if (!req.body.bank == '') {
            var sql = 'UPDATE USER SET USER_BANK=?WHERE USER_ID=?'
            var bank = req.body.bank
            var param = [bank, id];
            db.query(sql, param, function (error, results, fields) {
                console.log("은행 수정 완료");
            });
        }

        if (!req.body.bankaccount == '') {
            var sql = 'UPDATE USER SET UUSER_ACCOUNT=? WHERE USER_ID=?'
            var bankaccount = req.body.bankaccount
            var param = [bankaccount, id];
            db.query(sql, param, function (error, results, fields) {
                console.log("계좌 수정 완료");
            });
        }
        console.log("모두 수정 완료");
        var sql3 = 'SELECT * FROM USER WHERE USER_NUM= ? '
        var param3 = req.session.login_usernum;
        console.log(sql3);
        console.log(param3);
        db.query(sql3, param3, function (error, results, fields) {
                console.log(results);
                res.render('user.jade', { good: results});
        });


}

else if(req.device.type=='phone'){

  var id = req.body.sessionid;

  if (!req.body.username == '') {
      var sql = 'UPDATE USER SET USER_NAME=? WHERE USER_ID=?'
      var username = req.body.username
      var param = [username, id];
      db.query(sql, param, function (error, results, fields) {
          console.log("이름 수정 완료");
      });
  }
  if (!req.body.password == '') {
      var ci = crypto.createCipher('aes192', cryptoKey);
      var ciResult = ci.update(req.body.password, 'utf8', 'base64');
      ciResult += ci.final('base64');
      var sql = 'UPDATE USER SET USER_PASS=? WHERE USER_ID=?'
      var param = [ciResult, id];
      db.query(sql, param, function (error, results, fields) {
          console.log("비밀번호 수정 완료");
      });
  }
  if (!req.body.bank == '') {
      var sql = 'UPDATE USER SET USER_BANK=?WHERE USER_ID=?'
      var bank = req.body.bank
      var param = [bank, id];
      db.query(sql, param, function (error, results, fields) {
          console.log("은행 수정 완료");
      });
  }

  if (!req.body.bankaccount == '') {
      var sql = 'UPDATE USER SET UUSER_ACCOUNT=? WHERE USER_ID=?'
      var bankaccount = req.body.bankaccount
      var param = [bankaccount, id];
      db.query(sql, param, function (error, results, fields) {
          console.log("계좌 수정 완료");
      });
  }
  console.log("모두 수정 완료");
  res.json({
  sessionId : body.sessionid
          })
}



});

//회원 탈퇴
router.post('/withdraw', (req, res) => {
    if (req.device.type == 'desktop'){ //컴퓨터 인터넷

    db.query('UPDATE USER SET USER_EXIT=? WHERE USER_ID=?', [1, req.session.login_id], () => {
        // 회원탈퇴신청 완료 화면을 보여줌.
       console.log("회원 탈퇴 신청 완료");
    }
    );
    res.status(200).redirect('/');
}
 else if(req.device.type=='phone') //핸드폰 경우
     {
        var body=req.body; //body-parser 사용
        var query = 'SELECT * FROM SESSION WHERE SESSION_ID=?';
        var params = [body.sessionid];
        db.query(query, params, (err, session1) => {
            // 세션처럼 사용할 정보가 DB에 있는지 확인
            if (session1.length > 0) {
                var query2='UPDATE USER SET USER_EXIT=? WHERE USER_ID=?';
                var params2=[1,session1[0].LOGIN_ID] //속성값 제대로 확인하기
                db.query(query2,params2,(err,session2) => {
                // 회원탈퇴신청 완료 화면을 보여줌.
                    if(err)
                    {
                        console.log(err)
                    }
                    else
                    {
                        console.log("모바일 회원 탈퇴 신청 완료");
                        res.json({
                        sessionId : body.sessionid
                                })
                    }
                })
            }
        })
    }
});


//프로젝트 관리
router.post('/supped', function (req, res) {

  var sql1 = "select * from FUNDPROJECT AS F, PROJECT AS P, USER AS U  where F.PROJECT_NUM = P.PROJECT_NUM AND U.USER_NUM=F.USER_NUM  AND U.USER_ID =?;";
  var sql2 = "select * from PROJECT AS P, LIKEPROJECT AS L, USER AS U where P.PROJECT_NUM = L.PROJECT_NUM AND L.USER_NUM = U.USER_NUM AND U.USER_ID = ?";
  var sql3 = "Select * From PROJECT Where PROJECT_STATE= ?  AND PROJECT_USERNUM = ?" //진행
  var sql4 = "Select * From PROJECT Where PROJECT_STATE= ?  AND PROJECT_USERNUM = ?" //
    var param = req.session.login_id;
    var param2 = req.session.login_usernum;
    var param3 = [0,req.session.login_usernum];
    var param4 = [1,req.session.login_usernum];
    console.log(param);
    db.query(sql1, param, function (error, results1, fields) {
        if (error) {
            console.log(results1);
            console.log(error);
            res.status(500).send('sql1 Error');
        }
        else {
            console.log(results1);
            db.query(sql2 ,param,function (error, results2, fields) {
                if (error) {
                    console.log(error);
                    res.status(500).send('sql2 Error');
                } else {
                  db.query(sql3 ,param3,function (error, results3, fields) {
                      if (error) {
                          console.log(error);
                          res.status(500).send('sql2 Error');
                      } else {
                        db.query(sql4 ,param4,function (error, results4, fields) {
                            if (error) {
                                console.log(error);
                                res.status(500).send('sql2 Error');
                            } else {
                                console.log(results1);
                                console.log(results2);
                                res.render('supped.jade', { goods1: results1, goods2: results2 ,goods3: results3, goods4: results4});
                            }
                      });
                    }



            });
        }
    });
  }
});
});

router.get('/supped', function (req, res) {

  var sql1 = "select * from FUNDPROJECT AS F, PROJECT AS P, USER AS U  where F.PROJECT_NUM = P.PROJECT_NUM AND U.USER_NUM=F.USER_NUM  AND U.USER_ID =?;";
  var sql2 = "select * from PROJECT AS P, LIKEPROJECT AS L, USER AS U where P.PROJECT_NUM = L.PROJECT_NUM AND L.USER_NUM = U.USER_NUM AND U.USER_ID = ?";
  var sql3 = "Select * From PROJECT Where PROJECT_STATE= ?  AND PROJECT_USERNUM = ?" //진행
  var sql4 = "Select * From PROJECT Where PROJECT_STATE= ?  AND PROJECT_USERNUM = ?" //
  var param = req.session.login_id;
  var param2 = [0,req.session.login_usernum]
  var param3 = [1,req.session.login_usernum]
  console.log(param);
  db.query(sql1, param, function (error, results1, fields) {
      if (error) {
          console.log(results1);
          console.log(error);
          res.status(500).send('sql1 Error');
      }
      else {
          console.log(results1);
          db.query(sql2 ,param,function (error, results2, fields) {
              if (error) {
                  console.log(error);
                  res.status(500).send('sql2 Error');
              } else {
                db.query(sql3 ,param2,function (error, results3, fields) {
                    if (error) {
                        console.log(error);
                        res.status(500).send('sql2 Error');
                    } else {
                      db.query(sql4 ,param3,function (error, results4, fields) {
                          if (error) {
                              console.log(error);
                              res.status(500).send('sql2 Error');
                          } else {
                              console.log(results1);
                              console.log(results2);
                              res.render('supped.jade', { goods1: results1, goods2: results2 ,goods3: results3, goods4: results4});
                          }
                    });
                  }



          });
      }
  });
}
});
});



// 프로젝트 상세보기
router.get('/supped/:id/serch', function (req, res) {
    res.status(200).send(jade.render(suppedJade));
});


//프로젝트 후원취소
router.post('/:id/del', function (req, res) {
    console.log("후원취소");
    projectnum = req.params.id;
    id = req.session.login_usernum;

    // 사용자가 후원하거나 모바일에서 후원 환불했던 내용중에서 돈의 총액을 가져옴 
    var query = 'SELECT SUM(FUND_MONEY) AS MONEY FROM FUNDPROJECT WHERE USER_NUM=? AND PROJECT_NUM=?';
    var params = [id, projectnum];
    db.query(query, params, (err, moneys) => {
        if (err) console.log(err);

        // 프로젝트의 돈 정보를 수정함
        var query = 'UPDATE PROJECT SET PROJECT_MONEY=PROJECT_MONEY-? WHERE PROJECT_NUM=?';
        var params = [moneys[0].MONEY, projectnum];
        db.query(query, params, (err, rows) => {
            if (err) console.log(err);

            // 사용자 USERMONEY의 돈 정보를 수정함
            var query = 'UPDATE USERMONEY SET USER_NOW=USER_NOW+? WHERE USER_NUM=?';
            var params = [moneys[0].MONEY, id];
            db.query(query, params, (err, rows) => {
                if (err) console.log(err);

                // 사용자가 해당 프로젝트에 후원한 내역을 모두 제거함
                var query = 'DELETE FROM FUNDPROJECT WHERE USER_NUM=? AND PROJECT_NUM=?';
                var params = [id, projectnum];
                db.query(query, params, (err, rows) => {
                    if (err) console.log(err);

                    res.status(200).redirect('/auth/user/supped');
                });
            });
        });
    });
});

//project 좋아요
router.post('/:id/like', function (req, res) {

    projectnum = req.params.id;
    id = req.session.login_usernum;
    var query = "SELECT * FROM LIKEPROJECT AS L, USER AS U WHERE U.USER_NUM=L.USER_NUM AND U.USER_NUM = ? AND L.PROJECT_NUM=?"
    var params = [id,projectnum];
    db.query(query, params, (err, rows) => {
        if (!rows.length > 0) {
            // 사용자가 좋아요를 아직 누르지 않은 경우
            console.log("좋아요");
            var query = "INSERT INTO LIKEPROJECT VALUES (?, ?)";
            var params = [id, projectnum];
            console.log("id  : ",id);
            console.log("projectnum : ",projectnum);
            // 사용자가 해당 프로젝트에 좋아요를 했음을 나타내기 위해 LIKEPROJECT에 인서트.
            db.query(query, params, (err, rows) => {
                var query = "UPDATE PROJECT SET PROJECT_LIKE=PROJECT_LIKE+1 WHERE PROEJCT_NUM=?"
                var params = [projectnum];
                // 해당 프로젝트의 좋아요
                db.query(query, params, (err, rows) => {
                res.status(200).redirect('/auth/user/supped');
              });
            });
        } else {
            console.log("좋아요 오류");
            var sql1 = "select * from FUNDPROJECT AS F, PROJECT AS P, USER AS U  where F.PROJECT_NUM = P.PROJECT_NUM AND U.USER_NUM=F.USER_NUM  AND U.USER_ID =?;";
            var sql2 = "select * from PROJECT AS P, LIKEPROJECT AS L, USER AS U where P.PROJECT_NUM = L.PROJECT_NUM AND L.USER_NUM = U.USER_NUM AND U.USER_ID = ?";
              var param = req.session.login_id;
              console.log(param);
              db.query(sql1, param, function (error, results1, fields) {
                  if (error) {
                      console.log(results1);
                      console.log(error);
                      res.status(500).send('sql1 Error');
                  }
                  else {
                      console.log(results1);
                      db.query(sql2 ,param,function (error, results2, fields) {
                          if (error) {
                              console.log(error);
                              res.status(500).send('sql2 Error');
                          } else {
                              console.log(results1);
                              console.log(results2);
                              res.render('supped.jade', { goods1: results1, goods2: results2 });
                          }


                      });
                  }
              });
        }
    });
});

//project 좋아요 취소
router.post('/:id/likedel', function (req, res) {

    projectnum = req.params.id;
    id = req.session.login_usernum;
    var query1 = "DELETE FROM LIKEPROJECT WHERE USER_NUM=? AND PROJECT_NUM=?"
    var query2 = "UPDATE PROJECT SET PROJECT_LIKE = PROJECT_LIKE-1 WHERE PROJECT_NUM =?"
    var param1 = [id,projectnum];
    var param2 = [projectnum];

    db.query(query1, param1, function (error, results1, fields) {
        if (error) {
            console.log(error);
            res.status(500).send('query1 Error');
        }
        else {
            db.query(query2 ,param2,function (error, results2, fields) {
                if (error) {
                    console.log(error);
                    res.status(500).send('sql2 Error');
                } else {
                    res.status(200).redirect('/auth/user/supped');
                }


            });
          }
        });
});

router.post('/:id/projectdel', function (req, res) {

    projectnum = req.params.id;
    id = req.session.login_usernum;

        console.log("PROJECT DELETE" + projectnum);

        // 외래키 제약 조건 때문에 지워지지 않아서 설정
        var query = 'SET FOREIGN_KEY_CHECKS=0';
        db.query(query, () => {
            // 프로젝트 테이블에서 삭제
            var query = 'DELETE FROM PROJECT WHERE PROJECT_NUM=?';
            var params = [projectnum];
            db.query(query, params, (err, rows) => {
                if (err) console.log(err);

                // FUNDPROJECT 테이블에서 사용자가 후원한 내역 삭제
                var query = 'DELETE FROM FUNDPROJECT WHERE PROJECT_NUM=?';
                var params = [projectnum];
                db.query(query, params, (err, rows) => {
                    if (err) console.log(err);

                    // LIKEPROJECT 테이블에서 사용자가 좋아요한 내역 삭제
                    var query = 'DELETE FROM LIKEPROJECT WHERE PROJECT_NUM=?';
                    var params = [projectnum];
                    db.query(query, params, (err, rows) => {
                        if (err) console.log(err);

                        console.log(projectnum + "번 프로젝트 삭제 완료");
                        res.status(200).redirect('/auth/user/supped');
                    });
                });
            });
        });
});

router.get('/:id/uploadspendfile', function (req, res) {
    req.session.projectid=req.params.id;
    console.log(req.session.projectid);
    res.status(200).redirect('/auth/usercompleteproject');
});


module.exports = router;
