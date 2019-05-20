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
            console.log('31213');
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
                getBasExpertarticleId(res.id);
                document.querySelector('#update').addEventListener('click',function(){
                    updateBasExpertarticle(res.id);
               })
            }else{
            }
            
        }
        function getBasExpertarticleId(id){
            console.log(id)
            var option = { 
                id: id 
            };
            handleAjax('expert/getBasExpertarticle', 
            option,
             "GET").done(function(resp) {
                console.log(resp)
                document.querySelector('#content').value = resp.pageBean.lists[0].content;
                document.querySelector('#title').value = resp.pageBean.lists[0].title;
                return
            }).fail(function(err) {
                console.log(err)

            });
        }
     

       

      
      

        //更新
        function updateBasExpertarticle(id){
            handleAjax('expert/updateBasExpertarticle', { 
                id:id,
                title: $('#title').val(),
                content: $('#content').val(),
            }, "POST").done(function(resp) {
                layer.msg('更新成功');
                setTimeout(function(){
                    window.location.href = '../advice.html'
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