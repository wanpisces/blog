$(function () {
    var $loginForm = $('#login-base');
    var $registForm = $('#regist-base');
    var $userInfo = $('#userInfo');
    //切换到注册页面
    $("#login-base .tosignup span").on('click',function(){
        $registForm.show();
        $loginForm.hide();
    });
    //切换到登陆页面
    $("#regist-base .tosignup span").on('click',function(){
        $loginForm.show();
        $registForm.hide();
    });
    // 提交评论按钮
    $("#commentBtn").click(function(){
        $(".commentTxt").show();
    });

    //注册
    $registForm.find('.loginbtn').on('click',function(){
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'api/user/register',
            data:{
                username:$registForm.find('[name="username"]').val(),
                password:$.md5($registForm.find('[name="password"]').val()),
                repassword:$.md5($registForm.find('[name="repassword"]').val()),
            },
            dataType:'json',
            success:function(result){
                // console.log(result);
                $registForm.find('.promote').html(result.message);
                //如果注册成功
                if (!result.code){
                    setTimeout(function () {
                        $loginForm.show();
                        $registForm.hide();
                    },1000)
                }
            },
            error:function(error){
                alert(error);
            }
        });
    });

    //登陆
    $loginForm.find('.loginbtn').on('click',function(){
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'api/user/login',
            data:{
                username:$loginForm.find('[name="username"]').val(),
                password:$.md5($loginForm.find('[name="password"]').val()),
            },
            dataType:'json',
            success:function(result){
                $loginForm.find('.promote').html(result.message);
                if (!result.code){
                    setTimeout(function () {
                        // $userInfo.show();
                        // $loginForm.hide();
                        //显示用户信息
                        $userInfo.find('.username').html(result.userInfo.username);
                        window.location.reload();//重新刷新页面
                    },1000)
                }
            },
            error:function(error){
                alert(error);
            }
        });
    });

    //退出
    $('#loginOut').on('click',function(){
        $.ajax({
            url:'api/user/logout',
            success:function(result){
                if (!result.code){
                    window.location.reload();
                }
            },
            error:function(error){
                alert(error);
            }
        });
    });

    $('#adLogout').on('click',function(){
        $.ajax({
            url:'api/user/adlogout',
            success:function(result){
                if (!result.code){
                    window.location.href = "../";
                }
            },
            error:function(error){
                alert(error);
            }
        });
    });

  //点赞
    $("#img_1").on("click",function(e){
        //$("#dianzanshu").innerHTML('2');
        var praiseFlag = $("#dianzanshu").attr('praise-flag');
        var praiseArtId = $("#dianzanshu").attr('data-id');
        // alert(praiseArtId);
        $.ajax({
            type: 'get',
            url: '/api/user/like',
            dataType: 'json',
            data:{
                contentid : praiseArtId
            },
            success:function (data) {
                e.target.src="../public/img/dianzan_click.png";
                $("#dianzanshu").text(data.likeNum);
            },
            error:function (error) {
                alert(error);
                // debugger;
            }
        })
    })
    //收藏
    $("#img_2").on("click",function(e){
        var contentid=$("#contentId").val();
        $.ajax({
            type:'post',
            url:'/api/replay/save',
            dataType : 'json',
            data : {
                contentid:contentid,
            },
            success:function(result){
                 e.target.src="../public/img/save_click.png";
            },
            error:function(error){
                // alert(error);
            }
        });


    })

    //提交评论
    $('#messageBtn').on('click',function(){
        var contentid = $("#contentId").val();
        var comment =$("#comment").val();
        if(comment == ""){
            alert("请输入你的评论！");
        }else{
            $.ajax({
                type:'post',
                url:'/api/comment/post',
                dataType : 'json',
                data : {
                    contentid:contentid,
                    content : comment
                },
                success:function(result){
                    if(result.code){
                        window.location.reload();
                    }else{
                        alert(result.message);
                    }
                },
                error:function(error){
                    alert(error);
                }
            });
        }
    });

    //我的收藏,获取
    $("#save").on("click",function(){
        $("#content_").empty()
        $.ajax({
            type:'post',
            url:'/api/replay/getSave',
            dataType : 'json',
            data : {
            },
            success:function(result){
                console.log(result);
                for(var i=0;i<result.length;i++){
                    $("<div   id='"+ result[i]._id +"'style='cursor: pointer; text-align: center;border-bottom: 1px solid lightslategray;margin-top: 10px ;line-height: 30px'>"+"<a href='/view?contentid="+result[i]._id+"'>"+result[i].title+"</a>"+"</div>").appendTo("#content_")
                }
                //if(result=="ok"){
                //    window.location.reload();
                //}
            },
            error:function(error){
                alert(error);
            }
        });
        $("#saveBox").show();
    })

    //我的点赞,获取
    $("#save2").on("click",function(){
        $("#content2_").empty()
        $.ajax({
            type:'post',
            url:'/api/replay/getLikeSave',
            dataType : 'json',
            data : {
            },
            success:function(result){
                console.log(result);
                for(var i=0;i<result.length;i++){
                    $("<div   id='"+ result[i]._id +"'style='cursor: pointer; text-align: center;border-bottom: 1px solid lightslategray;margin-top: 10px ;line-height: 30px'>"+"<a href='/view?contentid="+result[i]._id+"'>"+result[i].title+"</a>"+"</div>").appendTo("#content_")
                }
                //if(result=="ok"){
                //    window.location.reload();
                //}
            },
            error:function(error){
                alert(error);
            }
        });
        $("#likeBox").show();
    })

    //我的评论，获取
    $("#save3").on("click",function(){
        $("#content3_").empty()
        $.ajax({
            type:'post',
            url:'/api/replay/getSave',
            dataType : 'json',
            data : {
            },
            success:function(result){
                console.log(result);
                for(var i=0;i<result.length;i++){
                    $("<div   id='"+ result[i]._id +"'style='cursor: pointer; text-align: center;border-bottom: 1px solid lightslategray;margin-top: 10px ;line-height: 30px'>"+"<a href='/view?contentid="+result[i]._id+"'>"+result[i].title+"</a>"+"</div>").appendTo("#content_")
                }
                //if(result=="ok"){
                //    window.location.reload();
                //}
            },
            error:function(error){
                alert(error);
            }
        });
        $("#commentBox").show();
    })

    //搜索
    // $('#searchBtn').on('click',function () {
    //     var value = $('#searchText').val();
    //     $.ajax({
    //         type:'post',
    //         url:'/api/search/find',
    //         dataType:'json',
    //         data:{
    //             content: value
    //         },
    //         success:function(result){
    //             console.log(result);
    //         },
    //         error:function (error) {
    //             debugger;
    //             alert(error);
    //         }
    //     });
    // });

//给元素添加事件
    //关闭
    $("#guanbi").on("click",function(){
        $("#saveBox").hide()
    })
    $("#guanbi2").on("click",function(){
        $("#likeBox").hide()
    })
    $("#guanbi3").on("click",function(){
        $("#commentBox").hide()
    })
    //点击取消
    $("#button1").on("click",function(){
        $("#dialog").hide()
    })
    //回复
    $('.replay').on('click',function(){
        $("#dialog").show();
        var id = $(this).siblings(".delInput").val();
        $(".delInput").val(id); //TODO 临时设置将所有评论的 .delInput value 设置为相同值
    });
    //提交回复
    $("#button2").on("click",function(){
        //评论Id
        var id = $(".delInput").val();
        //文章id
        var contentId=$("#contentId").val();
        //回复信息
        var replay =$("#replay_").val();
        console.log(id);
        console.log(contentId);
        console.log(replay);
        if(replay == ""){
            alert("请输入你的回复！");
        }else{
            $.ajax({
                type:'post',
                url:'/api/replay/post',
                dataType : 'json',
                data : {
                    contentid:contentId,
                    replay : replay,
                    commentid:id
                },
                success:function(result){
                    console.log(result);
                    if(result=="ok"){
                        window.location.reload();
                    }
                },
                error:function(error){
                    alert(error);
                }
            });
        }
    })

    //删除评论
    $('.delet').on('click',function(){
        var contentid = $("#contentId").val();
        var commentid =$(this).siblings(".delInput").val();
        $.ajax({
            type:'post',
            url:'/api/comment/delete',
            dataType : 'json',
            data : {
                contentid:contentid,
                commentid:commentid
            },
            success:function(result){
                if(result.code){
                    window.location.reload();
                }else{
                    alert("服务器忙，请稍后重试！");
                }
            },
            error:function(error){
                alert(error);
            }
        });
    });

    function pageShow(){

    }
});

function gotopage(){
    alert(10)
}
$(function(){
    var bg = $(".backCarousl > div");
    var bgArray = [];
    for(var i = 0;i < bg.length;i++){
        bgArray.push(i);
    }
    var bg_num = 0;
    function bg_play(){
        if(bg_num == bg.length){
            bg_num = 1;
            bg.eq(0).animate({"opacity":1},500).siblings().animate({"opacity":0},300);
        }else{
            bg.eq(bgArray[bg_num]).animate({"opacity":1},500).siblings().animate({"opacity":0},300);

            bg_num++;
        }
    }
    setInterval(bg_play,5000);
})

