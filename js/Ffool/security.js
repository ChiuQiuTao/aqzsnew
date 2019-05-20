(function(){
    layui.use('table', function() {
        var table = layui.table,
            $ = layui.jquery;
            laydate=layui.laydate
        //时间
        laydate.render({
            elem: '#imptimeq' //指定元素 
        });
        laydate.render({
            elem: '#imptimeh' //指定元素 
        });
        document.querySelector('#selectbtn').addEventListener('click',function(){
            getBasSafetystandards();
        })
        document.querySelector('#resetbtn').addEventListener('click',function(){
            window.location.reload();
        })
        //监听事件
        table.on('toolbar(testdome)', function(obj) {
            var checkStatus = table.checkStatus(obj.config.id),
                data = checkStatus.data; //获取选中的数据
            switch (obj.event) {
                case 'add':
                    window.location.href = "./securitydialog.html";
                    break;
                case 'update':
                    if (data.length === 0) {
                        layer.msg('请选择一行');
                    } else if (data.length > 1) {
                        layer.msg('只能同时编辑一个');
                    } else {
                        // layer.alert('编辑 [id]：' + checkStatus.data[0].id);
                         window.location.href = "./securitydialog.html?id="+data[0].id;
                    }
                    break;
                case 'delete':
                    if (data.length === 0) {
                        layer.msg('请选择一行');
                    } else {
                        for(var i=0;i<data.length;i++){
                            delBasSafetystandards(data[i].id);
                        }
                    }
                    break;
            };
        });


        // 删除
        function delBasSafetystandards(id){
            handleAjax('safety/delBasSafetystandards', { id: id }, "POST").done(function(resp) {
                console.log(resp)
                layer.msg('删除成功');
                setTimeout(function(){
                    getBasSafetystandards();
                },1500)
                return
            }).fail(function(err) {
                console.log(err)
            });
        }
        getBasSafetystandards();
        //获取列表
        function getBasSafetystandards(){
            var standardname = document.querySelector('#standardname').value;
            var standardno = document.querySelector('#standardno').value;
            var standardtype = document.querySelector('#standardtype').value;
            var standardlevel = document.querySelector('#standardlevel').value;
            var imptimeq = document.querySelector('#imptimeq').value+" " + "00:00:00";
            var imptimeh = document.querySelector('#imptimeh').value+" " + "00:00:00";

            table.render({
                elem: '#test',
                url: base + "safety/getBasSafetystandards",
                method: "GET",
                where: {standardname:standardname,
                    standardno:standardno,
                    standardtype:standardtype,
                    standardlevel:standardlevel,
                    imptimeq:imptimeq,
                    imptimeh:imptimeh
                },
                headers: {
                    Authorization: "Bearer" + " " + sessions
                },
                toolbar: '#toolbarinter',
                done: function(res, curr, count) {
                    console.log(res)
                },
                request: {
                    pageName: 'currentPage' //页码的参数名称，默认：page
                        ,
                    limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                parseData: function(res) { //res 即为原始返回的数据
                    return {
                        "code": res.code, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "totalNum": res.pageBean.totalNum, //解析数据长度
                        "lists": res.pageBean.lists //解析数据列表
                    };
                },
                response: {
                    statusName: 'code', //数据状态的字段名称，默认：code
                    statusCode: 10000, //成功的状态码，默认：0
                    msgName: "message", //状态信息的字段名称，默认：msg
                    countName: 'totalNum', //数据总数的字段名称，默认：count
                    dataName: 'lists', //数据列表的字段名称，默认：data
                },
                cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                    ,
                page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                    layout: ['prev', 'page', 'next', 'skip', 'count'] //自定义分页布局
                        //,curr: 5 //设定初始在第 5 页
                        ,
                    groups: 5 //只显示 1 个连续页码
                        ,
                    first: false //不显示首页
                        ,
                    last: false //不显示尾页
                        ,
                    prev: '上一页',
                    next: "下一页",
                    theme: "#c81623",
                },
                // height: 'full-20',//满高
                cols: [
                    [{
                        type: 'checkbox', 
                        fixed: 'left'
                    },{
                        title: '编号',
                        type: 'numbers'
                    },
                    {
                        field: 'standardname',
                        title: '标准名称',
                        align: "center",
                        minWidth: 150
                    },
                    {
                        field: 'standardno',
                        title: '标准编号',
                        align: "center",
                        minWidth: 150,
                    },
                    {
                        field: 'standardtype',
                        title: '标准种类',
                        align: "center",
                        minWidth: 150,
                    },
                    {
                        field: 'standardlevel',
                        title: '标准级别',
                        align: "center",
                        minWidth: 150,
                    },
                    {
                        field: 'inputpeople',
                        title: '录入人',
                        align: "center",
                        minWidth: 150,
                    },
                   ]
                ]
            });
        }
    });
})()