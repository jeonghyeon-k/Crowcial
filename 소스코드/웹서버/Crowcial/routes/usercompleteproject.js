const express = require('express');
const router = express.Router();
const mysql = require('mysql'); //mysql 모듈을 로딩.
const jade = require('jade');
const fs = require('fs');
const formidable = require('formidable'); // 이 라우터 모듈은 req 객체를 파싱하는데 formidable 모듈을 사용함.
const path = require('path');
const bodyParser=require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createConnection({
    host: 'localhost', // DB가 위치한 IP주소
    port: 3306,          // DB와 연결할 포트번호
    user: '4team',        // 계정이름
    password: 'gachon654321',    // 계정 비밀번호
    database: '4team'    // 데이터베이스 이름
});

const jadeFile2 = fs.readFileSync(path.join(__dirname, "../views/usercompleteproject.jade"), 'utf8');

// 이 라우터 모듈은 db를 사용함.
router.get('/',function(req,res){
        res.status(200).send(jade.render(jadeFile2));
});

router.post('/',function(req,res){

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "../public/spendfile");
    form.parse(req, function(err, body, files) {
    var file = files.spendfile; // input(type="file", name="spendfile")에서 보내온 파일
    // 파일 이름을 현재시간.txt 로 변경

    var date = Date.now();
    var newPath = form.uploadDir + "/" + date + path.extname(file.name);
    fs.rename(file.path, newPath, (err) => {
            console.log("프로젝트 사용내역 파일 등록!");
    });
    var query ='UPDATE PROJECT SET PROJECT_SPEND_FILE=? WHERE PROJECT_NUM =?'
    var params = [date,req.session.projectid];
    connection.query(query, params, (err, rows) => {
            if (err) {console.log(err);}

            else{
            console.log(req.session.projectid+" 프로젝트 사용내역등록");
            res.status(200).redirect('/project/list');
            }
        });

    });
});




module.exports = router;