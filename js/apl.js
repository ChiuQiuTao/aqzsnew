var base = "http://192.168.163.100:9193/";
var jq = jQuery.noConflict();
var sessionStorage = window.sessionStorage;

function ajax(url, param, type) {
    var sessions = sessionStorage.getItem('token');
    if (sessions == "" && url != "login") {
        window.location.href = "../src/login.html";
        return;
    }
    console.log(sessions)
        // 利用了jquery延迟对象回调的方式对ajax封装，使用done()，fail()，always()等方法进行链式回调操作
    return jq.ajax({
        url: base + url,
        data: param || {},
        type: type || 'POST',
        async: true,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer" + " " + sessions)
        },
    });
}

function handleAjax(url, param, type) {
    return ajax(url, param, type).then(function(resp) {
        // 成功回调
        resp = JSON.parse(resp);
        if (resp.status == 200) {
            sessionStorage.setItem('token', resp.jwtToken);
            return resp;
        }
        if (resp.code == 10000) {
            return resp; // 直接返回要处理的数据，作为默认参数传入之后done()方法的回调
        } else {
            return jq.Deferred().reject(resp); // 返回一个失败状态的deferred对象，把错误代码作为默认参数传入之后fail()方法的回调
        }
    }, function(err) {
        // 失败回调    
        layer.load();
        //此处演示关闭
        setTimeout(function() {
            layer.closeAll('loading');
        }, 2000);
        console.log(err); // 打印状态码
    });
}


/*提示*/
function alerts(texts) {
    layer.msg(texts, {
        time: 1000,
    })
    return;
}