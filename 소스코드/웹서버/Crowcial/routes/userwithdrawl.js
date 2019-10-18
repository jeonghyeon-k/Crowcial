const express = require('express');
const bodyParser = require('body-parser');
const jade = require('jade');
const mysql = require('mysql');
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

router.get('/', (req, res) => { //탈퇴신청한 회원들의 목록 조회
    var sql = 'SELECT * FROM USER AS U, USERMONEY AS M WHERE U.USER_NUM=M.USER_NUM AND USER_EXIT = ? '
    var param2 = 1;
        db.query(sql, param2, function (error, results, fields) {
            console.log(results);
            res.render('userwithdrawl.jade', {goods1: results});
        });
    
});

//회원삭제
router.get('/:id/userdelete', (req, res) => { 
    var id = req.params.id;
    console.log(id);
    db.query('SET FOREIGN_KEY_CHECKS=0', (err, rows) => {
        if (err) console.log(err);
        
        db.query('DELETE FROM USER WHERE USER_NUM=?', [id], (err)=>{
            if (err) console.log(err);
    
                console.log("회원 삭제");
                res.status(200).redirect('/auth/userwithdrawl');
            }
        );
    });
});
    

module.exports = router;