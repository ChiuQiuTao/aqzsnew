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
            elem: '#approvaltime' //指定元素 
        });
        laydate.render({
            elem: '#imptime' //指定元素 
        });
       
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
                }
                getBasSafetystandards(res.id);
                updateImg(res.id);
                document.querySelector('#update').addEventListener('click',function(){
                    updateInfo(res.id);
                })
            }else{
                uploadImg();
            }
            
        }
        function getBasSafetystandards(id){
            console.log(id)
            var option = { 
                id: id 
            };
            handleAjax('safety/getBasSafetystandards', 
            option,
             "GET").done(function(resp) {
                console.log(resp)
                document.querySelector('#standardname').value = resp.pageBean.lists[0].standardname;
                document.querySelector('#standardno').value = resp.pageBean.lists[0].standardno;
                document.querySelector('#standardtype').value = resp.pageBean.lists[0].standardtype;
                document.querySelector('#standardlevel').value = resp.pageBean.lists[0].standardlevel;
                var d = new Date(resp.pageBean.lists[0].approvaltime);
                var approvaltime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
                document.querySelector('#approvaltime').value = approvaltime;
                var d = new Date(resp.pageBean.lists[0].imptime);
                var imptime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
                document.querySelector('#imptime').value = imptime;
                document.querySelector('#content').value = resp.pageBean.lists[0].content;
                document.querySelector('#showimg').src = resp.pageBean.lists[0].accessorypath;

                layui.form.render("");
                return
            }).fail(function(err) {
                console.log(err)

            });
        }
     


       
        //新增
        function uploadImg(){
            var uploadInst = upload.render({
                elem: '#selectImg' //绑定元素
                    ,
                url: base + "safety/addBasSafetystandards" //上传接口
                    ,
                auto: false,
                field:'accessory',
                headers: {
                    Authorization: "Bearer" + " " + sessions
                },
                data: {
                    standardname: function() {
                        return $('#standardname').val();
                    },
                    standardno: function() {
                        return $('#standardno').val();
                    },
                    standardtype: function() {
                        return $('#standardtype').val();
                    },
                    standardlevel: function() {
                        return $('#standardlevel').val();
                    },
                    approvaltime: function() {
                        return $('#approvaltime').val()+" " + "00:00:00";
                    },
                    imptime: function() {
                        return $('#imptime').val()+" " + "00:00:00";
                    },
                    content: function() {
                        return $('#content').val();
                    },
                },
                bindAction: '#uploadImg',
                choose: function(obj){
                    //预读本地文件示例，不支持ie8
                    console.log(obj)
                    obj.preview(function(index, file, result){
                        console.log(result);
                        
                        $('#showimg').attr('src', result); //图片链接（base64）
                    });
                }    ,
                done: function(res) {
                    //上传完毕回调
                    console.log(res);
                    layer.msg('新增成功');
                    setTimeout(function(){
                        window.location.href = "./security.html";
                    },1500)
                },
                error: function() {
                    //请求异常回调
                    alert('信息填写不全')
                }
            });
        }

        // 更新图片
        function updateImg(id){
            var uploadInst = upload.render({
                elem: '#selectImg' //绑定元素
                    ,
                url: base + "safety/updateBasSafetystandards" //上传接口
                    ,
                field:'accessory',
               
                headers: {
                    Authorization: "Bearer" + " " + sessions
                },
                data: {
                    id:id,
                    standardname: function() {
                        return $('#standardname').val();
                    },
                    standardno: function() {
                        return $('#standardno').val();
                    },
                    standardtype: function() {
                        return $('#standardtype').val();
                    },
                    standardlevel: function() {
                        return $('#standardlevel').val();
                    },
                    approvaltime: function() {
                        return $('#approvaltime').val()+" " + "00:00:00";
                    },
                    imptime: function() {
                        return $('#imptime').val()+" " + "00:00:00";
                    },
                    content: function() {
                        return $('#content').val();
                    },
                },
                bindAction: '#updateImg',
                choose: function(obj){
                    //预读本地文件示例，不支持ie8
                    console.log(obj)
                    obj.preview(function(index, file, result){
                        document.querySelector('#update').style.display = 'none';
                        document.querySelector('#updateImg').style.display = 'block';
                        $('#showimg').attr('src', result); //图片链接（base64）
                    });
                }    ,
                auto:false,
                done: function(res) {
                    //上传完毕回调
                    console.log(res);
                    layer.msg('更新成功');
                    setTimeout(function(){
                        window.location.href = './security.html'
                    },1500)
                },
                error: function() {
                    //请求异常回调
                    alert('信息填写不全')
                }
            });
        }

        //没有更新图片的更新
        function updateInfo(id){
            handleAjax('safety/updateBasSafetystandards', { 
                id:id,
                standardname: $('#standardname').val(),
               
                standardno: $('#standardno').val(),
               
                standardtype: $('#standardtype').val(),
               
                standardlevel: $('#standardlevel').val(),
               
                approvaltime: $('#approvaltime').val()+" " + "00:00:00",
               
                imptime: $('#imptime').val()+" " + "00:00:00",
               
                content: $('#content').val(),
               
               

            }, "POST").done(function(resp) {
                layer.msg('更新成功');
                setTimeout(function(){
                    window.location.href = './security.html'
                },1500)
                return;
            }).fail(function(err) {
                console.log(err)
               
            });
        }


        /*取消*/
        $(".cancels").click(function() {
            window.location.href = "./security.html";
        })
    })


})()