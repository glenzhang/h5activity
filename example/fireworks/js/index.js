;(function() {
    var canvas = document.getElementById("fire");
    var ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetParent.offsetWidth;
    canvas.height = canvas.offsetParent.offsetHeight;
    var bigbooms = [];
    var lastTime;

    window.onload = function() {
        initAnimate()
    }

    function getRandom(a, b) {
        return Math.random() * (b - a) + a;
    }

    Array.prototype.foreach = function(callback) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] !== null) callback.apply(this[i], [i])
        }
    }

    var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };

    function initAnimate() {
        lastTime = new Date();
        animate();
    }

    function animate() {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        var newTime = new Date();
        if (newTime - lastTime > 200 + (window.innerHeight - 767) / 2) {
            var x = getRandom(canvas.width / 5, canvas.width * 4 / 5);
            var y = getRandom(50, 200);
            var bigboom = new Boom(getRandom(canvas.width / 3, canvas.width * 2 / 3), 2, "#FFF", {x: x, y: y});
            bigbooms.push(bigboom);
            lastTime = newTime;
        }
        bigbooms.foreach(function(index) {
            var that = this;
            if (!this.dead) {
                this._move();
                this._drawLight();
            }
            else {
                this.booms.foreach(function(index) {
                    if (!this.dead) {
                        this.moveTo(index);
                    }
                    else if (index === that.booms.length - 1) {
                        bigbooms.splice(bigbooms.indexOf(that), 1);
                    }
                })
            }
        });
        raf(animate);
    }

    var Boom = function(x, r, c, boomArea) {
        this.booms = [];
        this.x = x;
        this.y = (canvas.height + r);
        this.r = r;
        this.c = c;
        this.boomArea = boomArea;
        this.dead = false;
        this.ba = parseInt(getRandom(80, 200));
    }
    Boom.prototype = {
        _paint: function() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            ctx.fillStyle = this.c;
            ctx.fill();
            ctx.restore();
        },
        _move: function() {
            var dx = this.boomArea.x - this.x, dy = this.boomArea.y - this.y;
            this.x += dx * 0.01;
            this.y += dy * 0.01;
    
            for (var i = 0; i < 50; i++) {
                var d = 1 - i * 0.018;
                var ddx = dx * 0.002 * i;
                var ddy = dy * 0.002 * i;
                ctx.beginPath();
                ctx.fillStyle = "rgba(255,255,255,"+ d + ")";
                ctx.arc(this.x - ddx, this.y - ddy, this.r * (d), 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = "rgba(255,228,150, " + d + ")";
                ctx.beginPath();
                ctx.arc(this.x - ddx, this.y - ddy, this.r * (d), 0, 2 * Math.PI);
                ctx.fill();
            }
            
            if (Math.abs(dx) <= this.ba && Math.abs(dy) <= this.ba) {
                this._boom();
                this.dead = true;
            }
            else {
                this._paint();
            }
        },
        _drawLight: function() {
            ctx.save();
            ctx.fillStyle = "rgba(255,228,150,0.3)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r + 3 * Math.random() + 1, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        },
        _boom: function() {
            var fragNum = getRandom(100, 200);
            var style = getRandom(0, 10) >= 5 ? 1 : 2;
            var color;
            if (style === 1) {
                color = "rgba("+ parseInt(getRandom(128, 255)) +","+ parseInt(getRandom(128, 255)) +","+ parseInt(getRandom(128, 255)) +",1)";
            }
            var fanwei = fragNum;
            for (var i = 0; i < fragNum; i++) {
                if (style === 2) {
                    color = 'hsla(' + getRandom(0,360) + ', 100%, ' + getRandom(50,80) + '%, ' + Math.random() + ')';
                }
                var a = getRandom(-Math.PI, Math.PI);
                var x = getRandom(0, fanwei) * Math.cos(a) + this.x;
                var y = getRandom(0, fanwei) * Math.sin(a) + this.y;
                var radius = getRandom(0, 2)
                var frag = new Frag(this.x, this.y, radius, color, x, y);
                this.booms.push(frag);
            }
        }
    }

    var maxRadius = 1;
    var focallength = 250;
    var Frag = function(centerX, centerY, radius, color, tx, ty) {
        this.tx = tx;
        this.ty = ty;
        this.x = centerX;
        this.y = centerY;
        this.dead = false;
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.color = color;
    }
    Frag.prototype = {
        paint: function() {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(this.lastx, this.lasty);
            ctx.lineTo(this.x, this.y);
            ctx.closePath();
            ctx.strokeStyle = this.color;
            ctx.stroke();
        },
        moveTo: function(index) {
            this.ty = this.ty + 0.3;
            var dx = this.tx - this.x, dy = this.ty - this.y;
            this.lastx = this.x;
            this.lasty = this.y;
            this.x = Math.abs(dx) < 0.1 ? this.tx : (this.x + dx * 0.1);
            this.y = Math.abs(dy) < 0.1 ? this.ty : (this.y + dy * 0.1);
    
            if (dx === 0 && Math.abs(dy) <= 80) {
                this.dead = true;
            }
            this.paint();
        }
    }
})();
