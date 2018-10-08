var perpage = 10;
var page = 1;
var pages = 0;
var comments = [];
//提交评论
$('#messageBtn').on('click',function () {
    $.ajax({
        type:'POST',
        url: '/api/comment/post',
        data: {
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        success: function (responseData) {
            $('#messageContent').val('');
            comments = responseData.data.comments.reverse();
            renderComment();
        }
    })
});

/*
每次页面重载的时候获取该文章的所有评论
 */
$.ajax({
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val()
    },
    success: function (responseData) {
        comments = responseData.data.reverse();
        renderComment();
    }
});

$('.pager').delegate('a','click',function () {
    if($(this).parent().hasClass('previous')){
        page--;
        renderComment();
    }
    else {
        page++;
        renderComment();
    }
});

function renderComment() {
    $('#messageCount').html(comments.length); 
    pages = Math.max(Math.ceil(comments.length / perpage), 1);
    var start = Math.max(0, (page-1)*perpage);
    var end = Math.min(start + perpage, comments.length);
    var $lis = $('.pager li');
    $lis.eq(1).html(page+'/'+pages);

    if(page<=1){
        page == 1;
        $lis.eq(0).html('<span> 没有上一页了</span>');
    }else {
        $lis.eq(0).html('<a><span aria-hidden="true">&larr;</span> 上一页</a>');
    }
    if(page >= pages){
        page == pages;
        $lis.eq(2).html('<span> 没有下一页了</span>');
    }else {
        $lis.eq(2).html('<a> 下一页<span aria-hidden="true">&rarr;</span></a>\n');
    }

    if(comments.length == 0){
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>\n');
    }else {
        var html = '';
        for (var i = start; i < end; i++) {
            html += ' <div class="messageBox">\n' +
                '        <p class="name clear">\n' +
                '            <span class="f1">' + comments[i]._username + '</span>\n' +
                '            <span class="fr">' + formatDate(comments[i].postTime) + '</span>\n' +
                '        </p>\n' +
                '            <p>' + comments[i].content + '</p>\n' +
                '         </div>'
        }
        $('.messageList').html(html);
    }
}

function formatDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear()+'年'+(date1.getMonth()+1)+'月'+date1.getDate()+'日'+date1.getHours()+':'+date1.getMinutes()+':'+date1.getSeconds();
}