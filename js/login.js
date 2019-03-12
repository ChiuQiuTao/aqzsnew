;
(function(window, factory) { if (typeof define === "function" && define.amd) { define(factory) } else { if (typeof module === "object" && module.exports) { module.exports = factory() } else { window.Dot = factory() } } }(typeof window !== "undefined" ? window : this, function() {
    var Dot = function(selector, userOptions) {
        var options = { cW: 1367, cH: 500, numDot: 100, radDot: 15, isRangeRad: true, dotColor: "#FFFFFF", isLine: true, lineDist: 75, lineColor: "#FFFFFF", bounce: 1, opacity: 0.5, isTouch: false, vxRange: 2, vyRange: 2, isWallCollisionTest: true, isBallCollisionTest: true };
        var oDots = [],
            canvas = null,
            ctx = null,
            oDotA = null,
            oDotB = null,
            W = null,
            H = null;
        var mergeOptions = function(userOptions, options) { Object.keys(userOptions).forEach(function(key) { options[key] = userOptions[key] }) };
        var colorToRGB = function(color, alpha) {
            if (typeof color === "string" && color[0] === "#") { color = window.parseInt(color.slice(1), 16) }
            alpha = (alpha === undefined) ? 1 : alpha;
            var r = color >> 16 & 255,
                g = color >> 8 & 255,
                b = color >> 4 & 255,
                a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);
            if (a === 1) { return "rgb(" + r + "," + g + "," + b + ")" } else { return "rgba(" + r + "," + g + "," + b + "," + a + ")" }
        };
        var captureMouse = function(element) {
            var mouse = { x: 0, y: 0 };
            element.addEventListener("mousemove", function(event) {
                var x, y;
                if (event.pageX || event.pageY) {
                    x = event.pageX;
                    y = event.pageY
                } else {
                    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop
                }
                x -= element.offsetLeft;
                y -= element.offsetTop;
                mouse.x = x;
                mouse.y = y
            }, false);
            return mouse
        };
        var ran = function(min, max) { var val = max - min; return parseInt((Math.random() * val + min).toFixed(2)) };
        var Practicle = function(color, radius, alpha) {
            this.x = 0;
            this.y = 0;
            this.vx = 0;
            this.vy = 0;
            this.radius = radius;
            this.rotation = 0;
            this.mass = 1;
            this.scaleX = 1;
            this.scaleY = 1;
            this.name = "";
            this.color = colorToRGB(color, alpha)
        };
        Practicle.prototype.draw = function(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.scaleX, this.scaleY);
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
            ctx.restore()
        };
        var makeDots = function() {
            for (var i = 0; i < options.numDot; i++) {
                if (options.isRangeRad) { options.radDot = Math.floor(ran(2, options.radDot)) }
                var oDot = new Practicle(options.dotColor, options.radDot, options.opacity);
                oDot.x = ran(0, W);
                oDot.y = ran(0, H);
                oDot.vx = Math.random() * (options.vxRange) - options.vxRange / 2;
                oDot.vy = Math.random() * (options.vyRange) - options.vyRange / 2;
                oDots.push(oDot)
            }
        };
        var draw = function(oDot) { oDot.draw(ctx) };
        var move = function(oDot) {
            oDot.x += oDot.vx;
            oDot.y += oDot.vy;
            checkWall(oDot)
        };
        var checkWall = function(oDot) {
            if (options.isWallCollisionTest) {
                if (oDot.x + oDot.radius > W) {
                    oDot.x = W - oDot.radius;
                    oDot.vx *= -(options.bounce)
                } else {
                    if (oDot.x - oDot.radius < 0) {
                        oDot.x = oDot.radius;
                        oDot.vx *= -(options.bounce)
                    }
                }
                if (oDot.y + oDot.radius > H) {
                    oDot.y = H - oDot.radius;
                    oDot.vy *= -(options.bounce)
                } else {
                    if (oDot.y - oDot.radius < 0) {
                        oDot.y = oDot.radius;
                        oDot.vy *= -(options.bounce)
                    }
                }
            } else { if (oDot.x - oDot.radius > W) { oDot.x = 0 } else { if (oDot.x + oDot.radius < 0) { oDot.x = W } } if (oDot.y - oDot.radius > H) { oDot.y = 0 } else { if (oDot.y + oDot.radius < 0) { oDot.y = H } } }
        };
        var rotate = function(x, y, sin, cos, reverse) { return { x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin), y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin) } };
        var checkCollision = function(oDot0, oDot1) {
            var dx = oDot1.x - oDot0.x,
                dy = oDot1.y - oDot0.y,
                dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < oDot0.radius + oDot1.radius) {
                var angle = Math.atan2(dy, dx),
                    sin = Math.sin(angle),
                    cos = Math.cos(angle);
                var pos0 = { x: 0, y: 0 };
                var pos1 = rotate(dx, dy, sin, cos, true);
                var vel0 = rotate(oDot0.vx, oDot0.vy, sin, cos, true);
                var vel1 = rotate(oDot1.vx, oDot1.vy, sin, cos, true);
                var vxTotal = vel0.x - vel1.x;
                vel0.x = ((oDot0.mass - oDot1.mass) * vel0.x + 2 * oDot1.mass * vel1.x) / (oDot0.mass + oDot1.mass);
                vel1.x = vxTotal + vel0.x;
                var absV = Math.abs(vel0.x) + Math.abs(vel1.x),
                    overlap = (oDot0.radius + oDot1.radius) - Math.abs(pos0.x - pos1.x);
                pos0.x += vel0.x / absV * overlap;
                pos1.x += vel1.x / absV * overlap;
                var pos0F = rotate(pos0.x, pos0.y, sin, cos, false);
                var pos1F = rotate(pos1.x, pos1.y, sin, cos, false);
                oDot1.x = oDot0.x + pos1F.x;
                oDot1.y = oDot0.y + pos1F.y;
                oDot0.x = oDot0.x + pos0F.x;
                oDot0.y = oDot0.y + pos0F.y;
                var vel0F = rotate(vel0.x, vel0.y, sin, cos, false);
                var vel1F = rotate(vel1.x, vel1.y, sin, cos, false);
                oDot0.vx = vel0F.x;
                oDot0.vy = vel0F.y;
                oDot1.vx = vel1F.x;
                oDot1.vy = vel1F.y
            }
        };
        var drawLine = function(oDot0, oDot1) {
            var dx = oDot1.x - oDot0.x,
                dy = oDot1.y - oDot0.y,
                dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < options.lineDist) {
                ctx.save();
                ctx.strokeStyle = colorToRGB(options.lineColor, (options.opacity - 0.4) <= 0 ? 0.1 : options.opacity - 0.4);
                ctx.beginPath();
                ctx.moveTo(oDot0.x, oDot0.y);
                ctx.lineTo(oDot1.x, oDot1.y);
                ctx.closePath();
                ctx.stroke();
                ctx.restore()
            }
        };
        var execute = function() {
            oDots.forEach(move);
            for (var i = 0; i < options.numDot - 1; i++) {
                oDotA = oDots[i];
                for (var j = i + 1; j < options.numDot; j++) {
                    oDotB = oDots[j];
                    options.isBallCollisionTest && checkCollision(oDotA, oDotB);
                    options.isLine && drawLine(oDotA, oDotB)
                }
            }
            oDots.forEach(draw)
        };
        if (!window.requestAnimationFrame) { window.requestAnimationFrame = (window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) { return window.setTimeout(callback, 1000 / 60) }) }
        var initDot = function(selector, userOptions) {
            mergeOptions(userOptions, options);
            canvas = document.getElementById(selector), ctx = canvas.getContext("2d");
            W = options.cW;
            H = options.cH;
            canvas.width = W;
            canvas.height = H;
            makeDots();
            (function drawFrame() {
                window.requestAnimationFrame(drawFrame);
                ctx.clearRect(0, 0, W, H);
                execute()
            }())
        };
        initDot(selector, userOptions)
    };
    return Dot
}));
var winWidth = 0;
var winHeight = 0;
changeWH();
window.onresize = function() { changeWH(); };

function changeWH() { /* 获取窗口宽度*/
    if (window.innerWidth) winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth)) winWidth = document.body.clientWidth; /* 获取窗口高度*/
    if (window.innerHeight) winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight)) winHeight = document.body.clientHeight;
    this.Dot("dot", { cW: winWidth, cH: winHeight - 10 });
}

/* - */
//一、定义一个获取DOM元素的方法
var $ = function(selector) {
        return document.querySelector(selector);
    },
    box = $(".drag"), //容器
    bg = $(".bg"), //背景
    text = $(".text"), //文字
    btn = $(".btn"), //滑块
    success = false, //是否通过验证的标志
    distance = box.offsetWidth - btn.offsetWidth; //滑动成功的宽度（距离）
var validation = false;
//二、给滑块注册鼠标按下事件
btn.onmousedown = function(e) {
    //1.鼠标按下之前必须清除掉后面设置的过渡属性
    btn.style.transition = "";
    bg.style.transition = "";

    //说明：clientX 事件属性会返回当事件被触发时，鼠标指针向对于浏览器页面(或客户区)的水平坐标。

    //2.当滑块位于初始位置时，得到鼠标按下时的水平位置
    var e = e || window.event;
    var downX = e.clientX;

    //三、给文档注册鼠标移动事件
    document.onmousemove = function(e) {
        var e = e || window.event;
        //1.获取鼠标移动后的水平位置
        var moveX = e.clientX;

        //2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
        var offsetX = moveX - downX;

        //3.在这里判断一下：鼠标水平移动的距离 与 滑动成功的距离 之间的关系
        if (offsetX > distance) {
            offsetX = distance; //如果滑过了终点，就将它停留在终点位置
        } else if (offsetX < 0) {
            offsetX = 0; //如果滑到了起点的左侧，就将它重置为起点位置
        }

        //4.根据鼠标移动的距离来动态设置滑块的偏移量和背景颜色的宽度
        btn.style.left = offsetX + "px";
        bg.style.width = offsetX + "px";

        //如果鼠标的水平移动距离 = 滑动成功的宽度
        if (offsetX == distance) {
            //1.设置滑动成功后的样式
            text.innerHTML = "验证通过";
            text.style.color = "#fff";
            btn.innerHTML = "√";
            btn.style.color = "green";
            btn.style.border = "0";
            bg.style.backgroundColor = "lightgreen";
            //2.设置滑动成功后的状态
            success = true;
            //成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
            btn.onmousedown = null;
            document.onmousemove = null;
            //3.成功解锁后的回调函数
            validation = true;
        }
    }

    //四、给文档注册鼠标松开事件
    document.onmouseup = function(e) {
        //如果鼠标松开时，滑到了终点，则验证通过
        if (success) {
            return;
        } else {
            //反之，则将滑块复位（设置了1s的属性过渡效果）
            btn.style.left = 0;
            bg.style.width = 0;
            btn.style.transition = "left 1s ease";
            bg.style.transition = "width 1s ease";
        }
        //只要鼠标松开了，说明此时不需要拖动滑块了，那么就清除鼠标移动和松开事件。
        document.onmousemove = null;
        document.onmouseup = null;
    }
}