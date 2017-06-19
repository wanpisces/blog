var express = require('express');
var router = express.Router();//设置路由对象
var objectid = require('objectid');
// router.get('/user',function(req,res,next){
//     res.send('hellouser');
// });
var app = express();

//统一返回格式
var responseData = {};
router.use(function(req,res,next){
    responseData = {
        code:0,
        message:''
    };
    next();
});
//数据库引入
var User = require('../models/User');
var Content = require('../models/Content');
/*用户注册
*/
router.post('/user/register',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //用户名是否为空
    if (username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }else if (password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }else if (password != repassword){
        //两次输入密码必须一致
        responseData.code = 3;
        responseData.message = '两次输入密码不一致';
        res.json(responseData);
        return;
    }
    User.findOne({
        username:username
    }).then(function(userInfo){
        if (userInfo){
            //表示数据库中有该记录
            responseData.code =4;
            responseData.message = '用户名已经被注册';
            res.json(responseData);
            return;
        }else{

            //保存数据到数据库
            var user = new User({
                username:username,
                password:password,
                default:false
            });
            return user.save();
        }
    }).then(function(newUserInfo){
        responseData.message = '注册成功';
        res.json(responseData);
    });
})


/*
*
* */
router.post('/user/login',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    //用户名是否为空
    if (username == ''||password == ''){
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中相同的用户名和密码记录是否存在。如果存在则登陆成功
    User.findOne({
        username:username,
    }).then(function(userInfo){
        if (!userInfo){
            //表示数据库中没有该记录
            responseData.code = 2;
            responseData.message = '没有该用户';
            res.json(responseData);
            return;
        }else{
            if(userInfo.password != password){
                responseData.code = 3;
                responseData.message = '密码错误';
                res.json(responseData);
                return;
            }else{
                responseData.message = '登陆成功';
                responseData.userInfo = {
                    _id:userInfo._id,
                    username:userInfo.username,
                };
                req.cookies.set('userInfo',JSON.stringify({
                    _id:userInfo._id,
                    username:userInfo.username,
                }));//发送cookies信息到浏览器，浏览器得到后保存起来，每次刷新访问我们的站点，都会以头信息方式发送过来，我们就会验证用户是否登陆 将对象名设置为userInfo
                res.json(responseData);
                return;
            }
        }
    });
});

router.get('/user/logout',function(req,res,next){
    req.cookies.set('userInfo',null);
    res.json(responseData);
});

router.get('/user/adlogout',function(req,res,next){
    req.cookies.set('userInfo',null);
    res.json(responseData);
});


// 评论提交
router.post('/comment/post',function(req,res){
    //内容的id
    var contentId = req.body.contentid||"";
    var userInfo = req.cookies.get("userInfo");
    if(userInfo){
        var date = new Date();
        var postTime = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"  "+date.getHours()+":"+date.getMinutes();
        var postData = {
            id : objectid().toString(),
            username:req.userInfo.username,
            postTime:postTime,
            content:req.body.content
        }
        //查询当前内容的信息
        Content.findOne({
            _id:contentId
        }).then(function(content){
            content.comments.unshift(postData);
            content.commentNum = content.comments.length;
            return content.save();
        }).then(function(newContent){
            responseData.code = 1;
            responseData.message = "评论成功";
            res.json(responseData);
        });
    }else{
        responseData.code = 0;
        responseData.message = "你还没有登陆,请先登陆";
        res.json(responseData);
    }
});
//收藏
router.post("/replay/save",function(req,res){
    var userId = req.userInfo._id;
    User.findOne({_id:userId},function(err,data){
        data.save_.push(req.body.contentid);
        data.save();
        res.json("ok");
        // User.update({_id:userId},{$set:data},function(err,result){
        //     if(err){
        //         console.log(err)
        //     }else{
        //         console.log(result)
        //     }
        //     res.json("ok");
        // })
    });

})
//获取收藏
router.post("/replay/getSave",function(req,res){
    var userId = req.userInfo._id;
    // var userInfo = JSON.parse(req.cookies.get("userInfo")) ;
    // console.log(userInfo.username);
    // console.log(req.body);
    User.find({_id:userInfo._id},function(err,data){
        Content.find({_id:{$in:data[0].save_}},function(err,data){
            console.log(data);
            res.json(data)
        })

    })
})
router.post("/replay/getLikeSave",function(req,res){
    var userId = req.userInfo._id;
    console.log(userInfo.username);
    console.log(req.body);
    User.find({_id:userId},function(err,data){
        Content.find({_id:{$in:data[0].like_}},function(err,data){
            console.log(data);
            res.json(data)
        })

    })
})
// 回复提交
router.post('/replay/post',function(req,res){
    //评论的id
    var id = req.body.id||"";
    //userID
    var userInfo = req.cookies.get("userInfo");
    console.log(id);
    console.log(userInfo);
    console.log(req.body);
    Content.findOne({_id:req.body.contentid}).then(function(content){
        console.log(content.comments);
        for(var i=0;i<content.comments.length;i++){
            if(content.comments[i].id==req.body.commentid){
                console.log(content.comments[i]);
                content.comments[i].replay=req.body.replay;
                var date = new Date();
                content.comments[i].replayTime = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"  "+date.getHours()+":"+date.getMinutes();
            }
        }
        Content.update({_id:req.body.contentid},{$set:content},function(err,result){
            if(err){
                console.log(err)
            }else{
                console.log(result)
            }
            res.json("ok");
        })
    })
    if(userInfo){

        //var date = new Date();
        //var postTime = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"  "+date.getHours()+":"+date.getMinutes();
        //var postData = {
        //    id : objectid().toString(),
        //    username:req.userInfo.username,
        //    postTime:postTime,
        //    comments:req.body.comments
        //}

        //Content.find({
        //    //id:commentId
        //}).then(function(replay){
        //    console.log()
        //    //responseData.code = 1;
        //    //responseData.message = "回复成功";
        //    //res.json(responseData);
        //});
    }
});


router.post('/comment/delete',function(req,res){
    var userid = req.userInfo._id;
    var contentid = req.body.contentid||"";
    var commentid = req.body.commentid||"";
    var userInfo = req.query.userInfo||"";
    User.findOne({
        _id:userid
    }).then(function(userInfo){
        if(userInfo.isAdmin){
            Content.findOne({
                "_id":contentid
            }).then(function(content){
                var comments = content.comments;
                console.log(comments,commentid);
                for(var i = 0;i<comments.length;i++){
                    (function(i){
                        if(comments[i].id == commentid){
                            comments.splice(i,1);
                            console.log(i);
                        }
                    })(i);
                }
                content.comments = comments;
                return content.save();
            }).then(function(newcontent){
                responseData.code = 1;
                res.json(responseData);
            });
        }else{
            responseData.code = 0;
            res.json(responseData);
        }
    });
});

router.post('/search/find',function (req,res) {
    var value = req.body.content;debugger;
    console.log(value);
    Content.find({
        content: value
    }).then(function (content) {
        data.content = content;
        content.views++;
        content.save();
        res.render('main/view',data);
        console.log(data)
    })
});

router.get("/user/like",function(req,res){
    var contentId = req.query.contentid || "";
    Content.findOne({
        _id:contentId
    }).then(function(content){
        content.likeNum++;
        content.save();
        responseData.likeNum = content.likeNum;
        // res.render('main/view',data);
        responseData.code = "1";
        res.json(responseData);
    });
});










module.exports = router;
