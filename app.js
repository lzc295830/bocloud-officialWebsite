/*
应用程序的启动入口

 */

//加载express模块
var express = require('express');
//加载模板
var swig = require('swig');

//加载数据库模块
var mongoose = require('mongoose');

//加载body-parser 用来处理post提交的数据
var bodyParser = require('body-parser');

//引入cookies模块

var Cookies = require('cookies');
//创建app应用
var app = express();

var User = require('./models/User');
//设置静态文件托管
 app.use('/public', express.static(__dirname + '/public'));

//配置应用模版
//定义当前应用所使用的模版引擎
//第一个参数，模板引擎的名称，也是模板文件的后缀

app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');

//
//取消模板缓存
swig.setDefaults({cache:false});

//bodyParser设置
app.use(bodyParser.urlencoded({ extended: true }));

//cookies设置
app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);
    //解析登录用户的cookies信息
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            //获取当前用户类型
              return User.findById(req.userInfo._id).then(function(userInfo) {
                   req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                   next();
               })
             
        }catch (e) {}
           next();
    }
     else {
         next();
     }
});

/*
根据不同的功能划分模块
 */
 app.use('/admain', require('./routers/admain'));
 app.use('/api', require('./routers/api'));
 app.use('/', require('./routers/main'));
mongoose.connect('mongodb://localhost:27018/blog', function (err) {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        app.listen(8082);
    }
});


//监听http请求
// mongoose.connect();


