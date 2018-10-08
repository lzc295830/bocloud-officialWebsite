var express = require('express');
var router = express.Router();
var User = require("../models/User");
var Category = require("../models/Category");
var Content = require("../models/Content");
/*
设置unhandledRejection的监听事件，防止控制台输出警告信息
 */
process.on('unhandledRejection', error => {});

router.use(function (req, res, next) {
    if(!req.userInfo.isAdmin){
        res.send("对不起，只有管理员才能进入后台管理！")
        return Promise.reject();
    }
    next();
});

/*
首页
 */
router.get('/', function (req, res, next) {
    res.render('admain/index',{
        userInfo:req.userInfo
    });
});


/*
用户管理
 */

router.get('/user', function (req, res) {

    //从数据库中读取所有的用户信息
    var page = Number(req.query.page || 1);
    var limit = 10;
    var skip = 0;
    var pages = 0;
    User.count().then(function (count) {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        skip = (page-1)*limit
        User.find().limit(limit).skip(skip).then(function (users) {
            //console.log(users);
            res.render('admain/user_index',{
                userInfo:req.userInfo,
                users:users,
                page:page,
                pages:pages,
                count:count,
                limit:limit
            });
        });
    })



});

/*
    分类管理
 */

router.get('/category', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 10;
    var skip = 0;
    var pages = 0;
    Category.count().then(function (count) {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        skip = (page-1)*limit
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categories) {
            //console.log(users);
            res.render('admain/category_index',{
                userInfo:req.userInfo,
                categories:categories ,
                page:page,
                pages:pages,
                count:count,
                limit:limit
            });
        });
    })

});

/*
添加分类
 */
router.get('/category/add', function (req, res) {
    res.render('admain/category_add',{
        userInfo:req.userInfo
    });
});

/*
分类的保存
 */
router.post('/category/add',function (req, res) {
    var name = req.body.name || '';
    if(name == ''){
        res.render('admain/error',{
            userInfo:req.userInfo,
            message:"名称不能为空"
        });
        return Promise.reject();
    }
    //数据库中是否存在同名的类
    Category.findOne({
        name:name
    }).then(function (rs) {
        if(rs){
            res.render('admain/error',{
                userInfo:req.userInfo,
                message:'这个类已经存在了'
            });
            return Promise.reject();
        }
        else {
            return new Category({
                name:name
            }).save();
        }
    }).then(function () {
        res.render('admain/success', {
            userInfo:req.userInfo,
            message:'分类保存成功',
            url:'/admain/category'
        });
    })

});

/*
分类修改
 */

router.get('/category/edit', function (req, res) {
    //获取要修改的分类信息
    var id = req.query.id || '';
    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admain/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }else{
            res.render('admain/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    })
});

/*
分类修改保存
 */
router.post('/category/edit', function (req, res) {
    var id = req.query.id || '';
    //获取post提交过来的名称
    var name = req.body.name || '';
    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admain/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }else{
            //如果用户没有任何修改
            if(name == category.name){
                res.render('admain/success',{
                    userInfo:req.userInfo,
                    message:'修改成功',
                    url:'/admain/category'
                });
                return Promise.reject();
            }
           //要修改的分类名称是否已经存在
           else{
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                })
            }
        }
    }).then(function (sameCategory) {
        if(sameCategory){
            res.render('admain/error',{
                userInfo:req.userInfo,
                message:'数据库中存在同名分类'
            });
            return Promise.reject();
        }
        else {
           return Category.update({
                _id:id
            },{
                name:name
            });
        }
    }).then(function () {
        res.render('admain/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admain/category'
        });
    })
})

/*
分类删除
 */
router.get('/category/delete', function (req, res) {
    //获取要修改的分类信息
    var id = req.query.id || '';
    Category.remove({
        _id: id
    }).then(function () {
        res.render('admain/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admain/category'
        });

    });

});

/*
内容首页
 */
router.get('/content',function (req, res) {
    var page = Number(req.query.page || 1);
    var limit = 10;
    var skip = 0;
    var pages = 0;
    Content.count().then(function (count) {

        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        skip = (page-1)*limit
        Content.find().limit(limit).skip(skip).populate(['category','user']).sort({
            addTime: -1
        }).then(function (contents) {
            res.render('admain/content_index',{
                userInfo:req.userInfo,
                contents:contents ,
                page:page,
                pages:pages,
                count:count,
                limit:limit
            });
        });
    })
});

/*
内容添加页面
 */
router.get('/content/add',function (req, res) {
    Category.find().sort({_id: -1}).then(function (categories) {
        res.render('admain/content_add',{
            userInfo:req.userInfo,
            categories:categories
        });
    })
});

/*
内容保存
 */
router.post('/content/add', function (req, res) {
    // if(req.body.category == ''){
    //     res.render('/admain/error', {
    //         userInfo:req.userInfo,
    //         message:'内容分类不能为空'
    //     })
    //     return;
    // }

     if(req.body.title == ''){
        res.render('admain/error', {
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
        return;
    }
        //保存到数据库
        new Content({
            category: req.body.category,
            title: req.body.title,
            user: req.userInfo._id.toString(),
            description: req.body.description,
            content: req.body.content
        }).save().then(function () {
            res.render('admain/success', {
                userInfo: req.userInfo,
                message: '内容保存成功',
                url: '/admain/content'
            });
        });
});


/*
内容修改页面
 */
router.get('/content/edit', function (req, res) {
    var id = req.query.id || '';
    //获取post提交过来的名称
    //var title = req.body.title || '';
    var categories = [];
    Category.find().sort({_id: -1}).then(function (rs) {
        categories = rs;
        return Content.findOne({
            _id:id
        }).populate('category');
    }).then(function (content) {
        if(!content){
            res.render('admain/error',{
                userInfo:req.userInfo,
                message:'内容标题不存在'
            });
            return Promise.reject();
        }else{
            res.render('admain/content_edit',{
                userInfo:req.userInfo,
                categories:categories,
                content:content
            });
        }
    });
});

/*
保存修改内容
 */

router.post('/content/edit',function (req, res) {
    var id = req.query.id || '';
     if(req.body.category == ''){
         res.render('/admain/error', {
             userInfo:req.userInfo,
            message:'内容分类不能为空'
        })
        return;
     }

    if(req.body.title == ''){
        res.render('admain/error', {
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
        return;
    }
   Content.update({
     _id:id
   },{
       category: req.body.category,
       title: req.body.title,
       description: req.body.description,
       content: req.body.content
   }).then(function () {
       res.render('admain/success', {
           userInfo: req.userInfo,
           message: '内容保存成功',
           url: '/admain/content/edit?id='+id
       });
   })

});


/*
内容删除
 */
router.get('/content/delete', function (req, res) {
    //获取要修改的分类信息
    var id = req.query.id || '';
    Content.remove({
        _id: id
    }).then(function () {
        res.render('admain/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admain/content'
        });

    });

});

module.exports = router;