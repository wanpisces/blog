// 应用程序的入口文件
//加载express模块
var  express = require('express');
//加载模板
var swig = require('swig');
//加载数据库模块，初始化数据库
var mongose = require('mongoose');

//加载body-parser，用来处理post(前台)提交过来的数据
var bodyParser = require('body-parser');
//加载cookies模块
var Cookies = require('cookies');

//加载app应用=>nodeJS http.createServer();
var app = express();

var User = require('./models/User');


//设置静态文件托管
//当用户访问的url以/public开始那么直接返回对应--dirname+’/public‘下的文件
//对css，image等直接响应到客户端
app.use('/public',express.static(__dirname+'/public'));

//配置应用模板
//(1)定义当前应用所使用的模板引擎
//第一个参数为模板引擎的名称，同时也是模板文件的后缀,第二个参数表示解析处理模板内容的方法
app.engine('html',swig.renderFile);
//(2)设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views','./views');
//(3)注册所使用的模板引擎.第一个参数必须是view engine，第二个参数和app.engine这个方法中定义
//的模板引擎的名称（第一个参数）是一致的。(html)
app.set('view engine','html');

//在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});
/*
根据不妨同的功能划分模块
* */

//bodyParser设置,自动在api中的req增加一个body属性
app.use(bodyParser.urlencoded({extended:true}));

//设置cookies
app.use(function(req,res,next){
    req.cookies = new Cookies(req,res);
    //解析登陆用户的cookies信息
    req.userInfo = {};
    var userInfo = req.cookies.get('userInfo');
    if (userInfo){
        try{
            req.userInfo = JSON.parse(userInfo);
            //获取当前登录用户的用户类型，User是数据库中的User信息
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch(e){
            console.log(e);
            next();
        }
    }else{
        next();
    }

});

app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));


/*
 req request对象
 res response对象
* */
/*app.get('/',function(req,res,next){
    // res.send('<h1>欢迎来到我的博客</h1>');

    读取view目录下的指定文件，解析并返回给客户端
    第一个参数表示模板文件，相对于views目录 =》views/index.html
    第二个参数：传递给模板使用的数据
    *
    res.render('index');
})
 */

/*
//css文件需要新的请求，所以需要新的一个路由
express框架为我们提供了一个静态文件托管
app.get('/main.css',function (req,res,next){
    res.setHeader('content-type','text/css');//许设置是css文件
    res.send('body {background:red}');//默认是html页面
    }
)  */

//连接数据库
//mongodb协议 地址是localhost 端口27017
mongose.connect('mongodb://localhost:27017/blog',function (err) {
    if (err){
        console.log('数据库连接失败！',err);
    }else {
        console.log('数据库连接成功');
        //监听http请求
        app.listen(8081);//数据库连接成功后启动应用
    }
});


/*
用户发送http->url->解析路由->找到匹配的规则->执行指定绑定函数，返回对应内容至用户
/public ->静态文件->直接读取指定目录下的文件，返回给用户
->动态->处理业务逻辑，加载模板，返回数据给用户
* */