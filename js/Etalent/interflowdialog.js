(function() {
    layui.use(['upload', 'form', 'element', 'table', "layer", "laydate", "util"], function() {
        var $ = layui.jquery,
            table = layui.table,
            layer = layui.layer,
            laydate = layui.laydate,
            util = layui.util,
            form = layui.form,
            element = layui.element,
            upload = layui.upload;


        //时间
        laydate.render({
            elem: '#datebirth' //指定元素 
        });
        document.querySelector('#uploadImg').addEventListener('click',function(){
            handleAjax('expert/addBasExpertarticle', { 
                title: $('#title').val(),
                content: $('#content').val(),
            }, "POST").done(function(resp) {
                layer.msg('添加成功');
                setTimeout(function(){
                    window.location.href = '../advice.html'
                },1500)
                return;
            }).fail(function(err) {
                console.log(err)
            });
        })
        getHrefId();
        function getHrefId(){
            var loc = location.href;
            var url = loc.split("?")[1];
            if(url && url!=''){
                document.querySelector('#uploadImg').style.display='none';
                document.querySelector('#update').style.display='block';
                var para = url.split("&");
                var len = para.length;
                var res = {};
                var arr = [];
                for(var i=0;i<len;i++){
                    arr = para[i].split("=");
                    res[arr[0]] = arr[1];
                    console.log('1');
                }
                getBasInfoexchangeReplyId(res.id);
                document.querySelector('#update').addEventListener('click',function(){
                    addBasInfoexchangeReply(res.id);
               })
            }else{
            }
            
        }
        function getBasInfoexchangeReplyId(id){
            console.log(id)
            var option = { 
                id: id 
            };
            handleAjax('expert/getBasInfoexchangeReply', 
            option,
             "GET").done(function(resp) {
                console.log(resp)
                document.querySelector('#createname').value=resp.list[0].createname;
                document.querySelector('#createon').value=resp.list[0].createon;
                document.querySelector('#content').value=resp.list[0].content;
                var replyInner='';
                for(var i=0;i<resp.list[0].basInfoexchangereplyList.length;i++){
                    console.log(replyInner);
                    replyInner=replyInner+'<div class="reply">'
                    +'<div class="reply-info">'
                    +   '<div class="">#'+(i+1)+'</div>'
                    +   '<div class="">'+resp.list[0].basInfoexchangereplyList[i].createname+'</div>'
                    +    '<div class="">'+resp.list[0].basInfoexchangereplyList[i].createon+'</div>'
                    +'</div>'
                    +'<div class="reply-con">'
                    +     '内容:'+resp.list[0].basInfoexchangereplyList[i].replycontent+''
                    +'</div>'
                    +'</div>';
                    console.log(replyInner);

                }
                document.querySelector('#reply').innerHTML = replyInner
                return
            }).fail(function(err) {
                console.log(err)

            });
        }
     

       

      
      

        //回复
        function addBasInfoexchangeReply(id){
            handleAjax('expert/addBasInfoexchangeReply', { 
                pid:id,
                replycontent: $('#replycontent').val(),
            }, "POST").done(function(resp) {
                layer.msg('回复成功');
                setTimeout(function(){
                    window.location.href = '../interflow.html'
                },1500)
                return;
            }).fail(function(err) {
                console.log(err)
               
            });
        }


        /*取消*/
        $(".cancels").click(function() {
            window.location.href = "../advice.html";
        })
    })


})()