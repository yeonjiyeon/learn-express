const express = require('express');
const path = require('path');

const app = express();
app.set('port', process.env.PORT || 3000);

//미들웨이 이용하기 
app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다');
    next();
});


app.get('/', (req, res, next) => {// get 요청이 올 때 어떤 동작을 할지 보여지는 부분
                                 //post요청은 app.post('/abc',미들웨어)
    //res.send('Hello, Express');000
    //res.sendFile(path.join(__dirname, '/01_index.html'));
    console.log('get/ 요청에서만 실행됩니다');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다')
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message); //status상태메시지전송
});

app.listen(app.get('port'), () =>{
    console.log(app.get('port'),'번 포트에서 대기 중');
});