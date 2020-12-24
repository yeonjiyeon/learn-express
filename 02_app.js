const express = require('express');
const morgan = require('morgan');//요청과 응답에 대한 정보 콘솔에 기록
const cookieParser = require('cookie-parser');
const session = require('express-session');//세션 관리용 미들웨어
const dotenv = require('dotenv');//process.env관리
const path = require('path');

dotenv.config();//.env(키=값형식)를 읽어서 process.env로 만든다
const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
//static정적파일 제공하는 라우터 역할
//body-parser(express내장객체에서 일부기능사용가능)사용해서 파일 읽어오기--> 멀티마트는 읽지못함
app.use(express.json());//json형태의 데이터전달방식
app.use(express.urlencoded({extended:false})); //false-querystring, true-qs
//주소형태로 데이터보내는 형식, 폼형태에서 주로 사용

app.use(cookieParser(process.env.COOKIE_SECRET));
                        //비밀키 .env에서 읽어온다
app.use(session({
    resave:false,//요청이 올때 수정없어도 다시 저장할 것인지 여부
    saveUninitialized:false,//저장할 내용없어도 처음부터 세션을 생성할지
    //세션관리시 클라이언트에게 쿠키보냄
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,//클라이언트에서 쿠키확인 못하게 하기
        secure:false,//https가 아닌 환경에서도 사용할 수 있음
    },
    name:'session-cookie',
}));

const multer = require('multer');
const fs = require('fs');
//upload파일 만들기
try{
    fs.readdirSync('uploads');
}catch(error){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    stroage:multer.diskStorage({//저장공간
        destination(req, file, done){
       //요청에 대한 정보 업로드한 파일  함수
            done(null, 'uploads/')
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits:{fileSize:5 * 1024 * 1024},
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, '02_multipart.html'));
});
app.post('/upload', upload.fields([{name:'image1'}, {name:'image2'}]),
(req,res) => {
    console.log(req.files, req.body);
    res.send('ok');
});


app.get('/', (req, res, next) => {// get 요청이 올 때 어떤 동작을 할지 보여지는 부분
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