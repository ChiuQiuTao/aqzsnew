(function(){
    layui.use('table', function() {
        var table = layui.table,
            $ = layui.jquery;

        //监听事件
        table.on('toolbar(testdome)', function(obj) {
            var checkStatus = table.checkStatus(obj.config.id),
                data = checkStatus.data; //获取选中的数据
            switch (obj.event) {
                case 'refresh':
                    getPerson();
                    break;
                case 'update':
                    if (data.length === 0) {
                        layer.msg('请选择一行');
                    } else if (data.length > 1) {
                        layer.msg('只能同时编辑一个');
                    } else {
                        console.log(data);
                        layer.confirm('是否通过审核?', {
                            btn: ['通过','未通过'] //按钮
                        }, function(){
                            // layer.msg('的确很重要', {icon: 1});
                            updatePerson(data[0].id,'1');

                        }, function(){
                            
                            updatePerson(data[0].id,'2');

                        });

                    }
                    break;
              
            };
        });
        function updatePerson(id,auditstaus){
            handleAjax('approval/updatePerson',
            {
                id:id,
                auditstaus:auditstaus,
            }, "post").done(function(resp) {
                console.log(resp);
                
                layer.msg('审批成功');
                getPerson();
                
                return
            }).fail(function(err) {
                console.log(err)

            })
        }
        getPerson();
        //获取列表
        function getPerson(){
            table.render({
                elem: '#test',
                url: base + "approval/getPerson",
                method: "GET",
                where: {},
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
                        field: 'personname',
                        title: '个人名称',
                        align: "center",
                        minWidth: 150
                    },
                    // {
                    //     title: '审核类型',
                    //     align: "center",
                    //     minWidth: 150,
                    //     templet: function(d) {
                    //         if(d.enterprisename==null){
                    //             return '注册审核'
                    //         }else{
                    //             return '修改审核'
                    //         }
                    //     }
                    // },
                    
                    {
                        field: 'personcard',
                        title: '个人身份证',
                        align: "center",
                        minWidth: 150
                    },{
                        field: 'createon',
                        title: '新增时间',
                        align: "center",
                        minWidth: 150
                    },{
                        field: 'createenterprise',
                        title: '创建的企业',
                        align: "center",
                        minWidth: 150
                    },{
                        field: 'createname',
                        title: '创建的企业',
                        align: "center",
                        minWidth: 150
                    }]
                ]
            });
        }
       
    });
})()