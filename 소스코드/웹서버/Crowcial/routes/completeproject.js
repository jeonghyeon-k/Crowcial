const fs = require('fs');
const jade=require('jade');
const mysql=require('mysql');
const express=require('express');
const path=require('path');
const router=express.Router();
var multer = require("multer"); // 파일 업로드를 위해 multer 모듈을 사용합니다.​  

const client = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: '4team',
    password: 'gachon654321',
    database: '4team'
});


// 이 라우터 모듈은 db를 사용함.
router.get('/',function(req,res){
    fs.readFile(path.join(__dirname, "../views/CompleteList.jade"), 'utf8', function (err, data) {
        if (err) {
            console.log("CompleteList.jade 파일 오류");
        } else {
            var query='SELECT USER_ID, PROJECT_NUM, PROJECT_NAME, PROJECT_DATE, PROJECT_DUE, PROJECT_MONEY ';
            query += 'FROM USER AS U, PROJECT AS P ';
            query += 'WHERE U.USER_NUM=P.PROJECT_USERNUM AND P.PROJECT_STATE=?';
            var params=[1];
            client.query(query,params,(err,rows)=>{
                res.render('CompleteList.jade',{ rows: rows });
            })
        }
    });
});

router.get('/:id/download',function(req,res){
    var id=req.params.id;
    var query='SELECT PROJECT_SPEND_FILE FROM PROJECT WHERE PROJECT_NUM=?'
    var params=[id];
    client.query(query,params,(err,rows)=>{
        if(err)
        {
            console.log(err)
        }
        else{
        console.log(rows);
        
        fs.readFile(path.join(__dirname, "../public/spendfile/"+rows[0].PROJECT_SPEND_FILE+".txt"), 'utf8', function (err, data) {
            res.writeHead(200,{'Content-Type':'text; charset=utf8'});
            res.end(data);
            console.log(data);
            if(err)
            {console.log(err)}
            else
            {console.log("성공");}
        })
        }
    })
    //res.status(200).redirect('/project/manager/CompleteList');
})
//파일 다운로드 
/*
router.get('/:id/download',function(req,res){
    var id=req.params.id;
    var query='SELECT * FROM PROJECT WHERE PROJECT_NUM=?';
    var params=[id]
    client.query(query,params,(err,rows)=>{
            if(err)
        {
                console.log(err);
                console.log('query문 오류');
        }
            else    
        {
            if (rows.length > 0){

                var filename=rows[0].PROJECT_SPEND_FILE; //속성 이름 확인 FINENAME이 이렇게 저장 되어야 함. //원본파일  var fileName = data.orgFileName; // 원본파일명​
                var filePath = __dirname + "/../project/spendmoney/" +filename; // 다운로드할 파일의 경로​    ../views/user-complete.jade  
                console.log('파일 이름 확인');
                console.log(filename);
                console.log('파일 경로 확인');
                console.log(filePath);
                //응답 헤더에 파일의 이름과 mime Type을 명시한다.(한글&특수문자,공백 처리)
                res.setHeader("Content-Disposition","attachment;filename="+ encodeURI(filename))
                res.setHeader("Content-Type","binary/octet-stream");
                //filePath에 있는 파일 스트림 객체를 얻어온다.(바이트 알갱이를 읽어옵니다.)
                var fileStream = fs.createReadStream(filePath);
                fileStream.pipe(res);
                //res.download(filePath);
                console.log('파일 전송 완료');
                res.status(200).redirect('/project/manager/CompleteList');
                //res.end(filename);
        
            }
            else{
                console.log('데이터를 아예 가져오지 못했다.');
            }
        }
          
    })
    //res.status(200).redirect('/project/manager/CompleteList');
})
*/
module.exports=router;