$(function(){
    var $denglu = $('.denglu');
    var $zhuce = $('.zhuce');
    var $title = $('.title');

    //切换到注册
    $denglu.find('a').on('click', function () {
        $zhuce.show();
        $denglu.hide();
    });

    //切换到登录
    $zhuce.find('a').on('click', function () {
        $denglu.show();
        $zhuce.hide();
    });

    //注册
    $zhuce.find('button').on('click', function(){

    //通过ajax提交请求
    $.ajax({
        type: 'post',
        url: '/api/user/register',
        data: {
         zhanghaozc: $zhuce.find('[name = "zhanghaozc"]').val(),
         mimazc: $zhuce.find('[name = "mimazc"]').val(),
         mimazcq:  $zhuce.find('[name = "mimazcq"]').val()
        },
        dataType: 'json',
        success: function(result){
            //console.log(result);
            $zhuce.find('.zcts').html(result.message);

            if (!result.code){
                setTimeout(function () {
                    $denglu.show();
                    $zhuce.hide();
                }, 1000);
            }
        }
    });
    });

    //登录模块
    $denglu.find('button').on('click', function() {

        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                zhanghao: $denglu.find('[name = "zhanghao"]').val(),
                mima: $denglu.find('[name = "mima"]').val()

            },
            dataType: 'json',
            success: function (result) {
                $denglu.find('.dlts').html(result.message);

                if (result.code) {
                    return;
                }
                // setTimeout(function () {
                //     $title.find('.xsyhxx').html('欢迎你 ' + result.userInfo.username);
                //     console.log(result.userInfo.username);
                //     $denglu.hide();
                // }, 1000);
                window.location.reload();
            }
        });
    });

        //退出
    $(".logout").click(function () {
        $.ajax({
            url: '/api/user/logout',
            success:function (result) {
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    })

})