var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');
//统一返回格式
var responseData;

router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }
    next();
});

// 用户注册
// 用户名不为空，密码不为空，两次输入密码一致
//是否被注册过

router.post('/user/register', function (req, res, next) {

    var username = req.body.zhanghaozc;
    var password = req.body.mimazc;
    var respassword = req.body.mimazcq;

    //用户名是否为空
    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return 0;
    }

    //密码不能为空
    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    //两次密码不一致
    if(password != respassword){
        responseData.code = 3;
        responseData.message = '两次输入密码不一致';
        res.json(responseData);
        return;
    }

    //从数据库中查看用户名是否已经被注册
    User.findOne({
       username: username
    }).then(function (userInfo) {
      // console.log(userInfo);
       if(userInfo){
           //存在
           responseData.code = 4;
           responseData.message = '用户名已经被注册';
           res.json(responseData);
           return;
       }
       //否则保存到数据库
        var user = new User({
            username: username,
            password: password
        });
       return user.save();
    }).then(function (newUserInfo) {
        //console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);
    });
});

/*
登录

 */

router.post('/user/login',function (req, res) {
    var username = req.body.zhanghao;
    var password = req.body.mima;

    if ( username == '' || password == ''){
        responseData.code =1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return;
    }

    //账号是否存在
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
       //正确
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
        return;
    })
});

//退出
router.get('/user/logout', function (req, res) {
    req.cookies.set('userInfo', null);
    res.json(responseData);
});
/*
获取指定文章的所有评论
 */
router.get('/comment', function (req, res) {
    var contentId = req.query.contentid || '';
    //查询这篇内容的信息
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        responseData.data = content.comments;
        res.json(responseData);
    })
});

/*
评论提交
 */
router.post('/comment/post', function (req, res) {
    //评论的id
    var contentId = req.body.contentid || '';
     var postData = {
         _username: req.userInfo.username,
         postTime:new Date(),
         content: req.body.content
     };

     //查询这篇内容的信息
     Content.findOne({
         _id: contentId
     }).then(function (content) {
         content.comments.push(postData);
         return content.save();
     }).then(function (newContent) {
         responseData.message = '评论成功';
         responseData.data = newContent;
         res.json(responseData);
     });
});


module.exports = router;