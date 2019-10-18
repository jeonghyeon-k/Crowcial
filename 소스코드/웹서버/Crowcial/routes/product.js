const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
const jade = require('jade');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));

//게시판 페이징

router.get("/pasing/:cur", function (req, res) {

    //페이지당 게시물 수 : 한 페이지 당 10개 게시물
    const page_size = 10;
    //페이지의 갯수 : 1 ~ 10개 페이지
    const page_list_size = 10;
    //limit 변수
    let no = "";
    //전체 게시물의 숫자
    let totalPageCount = 0;

    const queryString = 'select count(*) as cnt from PROJECT';
    getConnection().query(queryString, function (error2, data) {
        if (error2) {
            console.log(error2 + "메인 화면 mysql 조회 실패");
            return
        }
        //전체 게시물의 숫자
        totalPageCount = data[0].cnt;

        //현제 페이지
        const curPage = req.params.cur;

        console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);

        //전체 페이지 갯수
        if (totalPageCount < 0) {
            totalPageCount = 0
        }

        const totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        const totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
        const curSet = Math.ceil(curPage / page_list_size); // 현재 셋트 번호
        const startPage = ((curSet - 1) * 10) + 1;//현재 세트내 출력될 시작 페이지
        const endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


        //현재페이지가 0 보다 작으면
        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        }

        console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };


        fs.readFile('list.jade', 'utf-8', function (error, data) {

            if (error) {
                console.log("jade 오류" + error);
                return
            }
            console.log("총 " + no + "개의 프로젝트가 있습니다");

            const queryString = 'select * from PROJECT';
            getConnection().query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }

                res.send(jade.render(data, {
                    data: result,
                    pasing: result2
                }));
            });
        });
    })
});
//메인화면
router.get("/index", function (req, res) {
    console.log("메인화면");
    //main 으로 들어오면 바로 페이징 처리
    res.redirect('/pasing/' + 1)

});
//삭제
router.get("/delete/:id", function (req, res) {
    console.log("삭제 진행");

    getConnection().query('delete from PROJECT where id = ?', [req.params.id], function () {
        res.redirect('/main')
    });
});
//삽입 페이지
router.get("/insert", function (req, res) {
    console.log("삽입 페이지 나와라");

    fs.readFile('insert.html', 'utf-8', function (error, data) {
        res.send(data)
    })
});
//삽입 포스터 데이터
router.post("/insert", function (req, res) {
    console.log("삽입 포스트 데이터 진행");
    const body = req.body;
    getConnection().query('insert into products(name,modelnumber,series) values (?,?,?)', [body.name, body.num, body.section], function () {
        //응답
        res.redirect('/main');
    })
});
//수정 페이지
router.get("/edit/:id", function (req, res) {
    console.log("수정 진행");

    fs.readFile('edit.html', 'utf-8', function (error, data) {
        getConnection().query('select * from PROJECT where id = ?', [req.params.id], function (error, result) {
            res.send(ejs.render(data, {
                data: result[0]
            }))
        })
    });
});
//수정 포스터 데이터
router.post("/edit/:id", function (req, res) {
    console.log("수정 포스트 진행");
    const body = req.body;
    getConnection().query('update PROJECT set PROJECT-NAME = ?, modelnumber = ?, series = ? where id = ?',
        [body.name, body.num, body.section, req.params.id], function () {
            res.redirect('/main')
        })
});
//글상세보기
router.get("/detail/:id", function (req, res) {
    console.log("수정 진행");

    fs.readFile('detail.html', 'utf-8', function (error, data) {
        getConnection().query('select * from PROJECT where id = ?', [req.params.id], function (error, result) {
            res.send(ejs.render(data, {
                data: result[0]
            }))
        })
    });
});
//mysql db 연결 함수

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '192.9.44.53',
    user: '4team',
    database: '4team',
    password: 'gachon654321'
});
//디비 연결 함수
function getConnection() {
    return pool
}
module.exports = router;