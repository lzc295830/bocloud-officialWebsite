var mongoose = require('mongoose');

/*
内容表结构
 */


module.exports = new mongoose.Schema({
    //关联字段 内容分类的id
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },
    title: {
        type: String,
        default: ''
    },
    //关联字段 用户
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },
    //添加时间
    addTime:{
      type: Date,
        default: new Date()
    },
    //阅读量
    views: {
      type: Number,
      default: 0
    },
    description:
        {
            type: String,
            default: ''
        },
    content: {
        type: String,
        default: ''
    },
    comments: {
        type: Array,
        default: []
    }
});