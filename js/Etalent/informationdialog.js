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
                getBasExpertsId(res.id);
                updateImg(res.id);
                document.querySelector('#update').addEventListener('click',function(){
                    updateInfo(res.id);
                })
            }else{
                uploadImg();
            }
            
        }
        function getBasExpertsId(id){
            console.log(id)
            var option = { 
                id: id 
            };
            handleAjax('expert/getBasExperts', 
            option,
             "GET",'utf-8').done(function(resp) {
                console.log(resp)
                document.querySelector('#truename').value = resp.pageBean.lists[0].truename;
                document.querySelector('#telno').value = resp.pageBean.lists[0].telno;
                document.querySelector('#email').value = resp.pageBean.lists[0].email;
                document.querySelector('#sex').value = resp.pageBean.lists[0].sex;
                var d = new Date(resp.pageBean.lists[0].datebirth);
                var datebirth=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
                document.querySelector('#datebirth').value = datebirth;
                document.querySelector('#experttype').value = resp.pageBean.lists[0].experttype;
                document.querySelector('#professionalfieldname').value = resp.pageBean.lists[0].professionalfieldname;
                document.querySelector('#titlename').value = resp.pageBean.lists[0].titlename;
                document.querySelector('#nationalityname').value = resp.pageBean.lists[0].nationalityname;
                document.querySelector('#documenttypename').value = resp.pageBean.lists[0].documenttypename;
                document.querySelector('#documentno').value = resp.pageBean.lists[0].documentno;
                document.querySelector('#qualificationtype').value = resp.pageBean.lists[0].qualificationtype;
                document.querySelector('#remark').value = resp.pageBean.lists[0].remark;
                document.querySelector('#showimg').src = resp.pageBean.lists[0].photopath;

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
                url: base + "expert/addBasExperts" //上传接口
                    ,
                auto: false,
                field:'photo',
                headers: {
                    Authorization: "Bearer" + " " + sessions
                },
                data: {
                    truename: function() {
                        return $('#truename').val();
                    },
                    telno: function() {
                        return $('#telno').val();
                    },
                    email: function() {
                        return $('#email').val();
                    },
                    sex: function() {
                        return $('#sex').val();
                    },
                    datebirth: function() {
                        return $('#datebirth').val()+" " + "00:00:00";
                    },
                    experttype: function() {
                        return $('#experttype').val();
                    },
                    professionalfieldname: function() {
                        return $('#professionalfieldname').val();
                    },
                    titlename: function() {
                        return $('#titlename').val();
                    },
                    nationalityname: function() {
                        return $('#nationalityname').val();
                    },
                    documenttypename: function() {
                        return $('#documenttypename').val();
                    },
                    documentno: function() {
                        return $('#documentno').val();
                    },
                    qualificationtype: function() {
                        return $('#qualificationtype').val();
                    },
                    remark: function() {
                        return $('#remark').val();
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
                        window.location.href = "../information.html";
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
                url: base + "expert/updateBasExperts" //上传接口
                    ,
                field:'photo',
               
                headers: {
                    Authorization: "Bearer" + " " + sessions
                },
                data: {
                    id:id,
                    truename: function() {
                        return $('#truename').val();
                    },
                    telno: function() {
                        return $('#telno').val();
                    },
                    email: function() {
                        return $('#email').val();
                    },
                    sex: function() {
                        return $('#sex').val();
                    },
                    datebirth: function() {
                        return $('#datebirth').val()+" " + "00:00:00";
                    },
                    experttype: function() {
                        return $('#experttype').val();
                    },
                    professionalfieldname: function() {
                        return $('#professionalfieldname').val();
                    },
                    titlename: function() {
                        return $('#titlename').val();
                    },
                    nationalityname: function() {
                        return $('#nationalityname').val();
                    },
                    documenttypename: function() {
                        return $('#documenttypename').val();
                    },
                    documentno: function() {
                        return $('#documentno').val();
                    },
                    qualificationtype: function() {
                        return $('#qualificationtype').val();
                    },
                    remark: function() {
                        return $('#remark').val();
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
                        window.location.href = '../information.html'
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
            handleAjax('expert/updateBasExperts', { 
                id:id,
                truename: $('#truename').val(),
               
                telno: $('#telno').val(),
               
                email: $('#email').val(),
               
                sex: $('#sex').val(),
               
                datebirth: $('#datebirth').val()+" " + "00:00:00",
               
                experttype: $('#experttype').val(),
               
                professionalfieldname: $('#professionalfieldname').val(),
               
                titlename: $('#titlename').val(),
               
                nationalityname: $('#nationalityname').val(),
               
                documenttypename: $('#documenttypename').val(),
               
                documentno: $('#documentno').val(),
               
                qualificationtype: $('#qualificationtype').val(),
               
                remark: $('#remark').val(),
               

            }, "POST").done(function(resp) {
                layer.msg('更新成功');
                setTimeout(function(){
                    window.location.href = '../information.html'
                },1500)
                return;
            }).fail(function(err) {
                console.log(err)
               
            });
        }


        /*取消*/
        $(".cancels").click(function() {
            window.location.href = "../information.html";
        })
    })


})()