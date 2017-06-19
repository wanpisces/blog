var express = require('express');
var router = express.Router();//设置路由对象
var Category = require('../models/Category');
var Content = require('../models/Content');


var data;
//处理通用数据
router.use(function(req,res,next){
    data = {
        userInfo:req.userInfo,
        categories:[]
    };
    Category.find().sort({_id:-1}).then(function(categories){
        data.categories = categories;
        next();
    });
});
/*
首页
* */
router.get('/',function(req,res,next){
    // res.send('首页');
    // console.log(req.userInfo);
    data.category=req.query.category||'';
    data.count = 0;
    data.page = parseInt(req.query.page||1);
    data.limit = 3;
    data.pages = 0;

    var where = {};
    if(data.category){
        where.category = data.category;
    }
    //读取数据库中所有的分类category记录
    Content.where(where).count().then(function(count){
        data.count = count;
        //计算总页数
        data.pages = Math.ceil(count/data.limit);
        //取值不能超过pages
        data.page = Math.min(data.page,data.pages);
        //取值不能小于1
        data.page = Math.max(data.page,1);
        var skip = (data.page-1)*data.limit;
        return Content.find().where(where).limit(data.limit).skip(skip).populate(['category','user']).sort({
            addTime:-1
        });
    }).then(function(contents){
        data.contents = contents;
        res.render('main/index',data);
    });
});

//搜索
router.get('/main/search',function(req,res,next){
    var text = req.query.keyWord;
    data.count = 0;
    data.page = parseInt(req.query.page||1);
    data.limit = 3;
    data.pages = 0;
    Content.find({content:{$regex: text,$options: 'ig' }}).count().then(function(count){
        data.count = count;
        data.pages = Math.ceil(count/data.limit);
        data.page = Math.min(data.page,data.pages);
        data.page = Math.max(data.page,1);
        var skip = (data.page-1)*data.limit;
        return Content.find({content:{$regex: text,$options: 'ig' }}).limit(data.limit).skip(skip).sort({
            addTime:-1
        });
    }).then(function(contents){
        data.contents = contents;
        res.render('main/index',data);
    });
});

//查看更多
router.get("/view",function(req,res){
    var contentId = req.query.contentid || "";
    Content.findOne({
        _id:contentId
    }).then(function(content){
        data.content = content;
        content.views++;
        content.save();
        res.render('main/view',data);
        console.log(data)
    });
});


module.exports = router;
