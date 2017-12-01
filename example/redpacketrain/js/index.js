(function() {
    var $wrapGuide = $("#J_wrap_guide");
    var $wrapGame = $("#J_wrap_game");
    var $wrapNone = $("#J_wrap_none");
    var $num = $("#J_num");
    var $peng = $("#J_peng");
    var $plusOne = $("#J_plus_one");
    var $leftSecond = $("#J_left_second");
    var $whale = $("#J_whale");

    var numClasses = "num_1 num_2 num_3";
    var $window = $(window);
    var wHeight = $window.height();
    var wWidth = $window.width();

    var unitHeight = wHeight / 10;
    var unitWidth = wWidth / 4;

    var switchIntervalId;
    var initCountdownNum = 30;

    var itemWidth = 2.54;
    var itemHeight = 2.39;
    var fontSizeUnit = $("html").css("fontSize");

    fontSizeUnit = fontSizeUnit.substr(0, fontSizeUnit.length - 2);
    itemWidth = itemWidth * fontSizeUnit;
    itemHeight = itemHeight * fontSizeUnit;

    function beginNum() {
        var i = 3;
        var turn = function(timer) {
            var dtd = $.Deferred(); //在函数内部，新建一个Deferred对象
            var tasks = function() {
                $num.removeClass(numClasses).addClass("num_{0}".format(i--));
                dtd.resolve(); // 改变Deferred对象的执行状态
            };
            setTimeout(tasks, timer);

            return dtd.promise(); // 返回promise对象
        };

        $.when(turn(0))
            .then(turn.bind(undefined, 1000))
            .then(turn.bind(undefined, 1000))
            .then(turn.bind(undefined, 1000))
            .then(function() {
                $wrapGuide.hide();
                $wrapGame.show();
                beginGame();
            });
    }

    function bindEvents() {
        $plusOne.on("webkitAnimationEnd", function() {
            $plusOne.hide();
        }).on("touchstart", function(ev) {
            ev.preventDefault();
        });

        $wrapGame.on("touchmove", function(ev) {
            ev.preventDefault();
        });

        $whale.on("touchmove", function(ev) {
            ev.preventDefault();
        });
    }

    function _buildRedPacketDom() {
        var sb = new StringBuilder();
        var wUnit = 20;

        sb.append('<div class="J_red_packet red-packet dd{2}" style="left:{0}%; top: -{1}px;"></div>'
                .format(60 + Math.round(Math.random() * 30 + 15),
                    itemHeight,
                    Math.round(Math.random() * 3) + 1))
            .append('<div class="J_red_packet red-packet dd{2}" style="left:{0}%; top: -{1}px;"></div>'
                .format(60 + Math.round(Math.random() * 30 + 20),
                    itemHeight,
                    Math.round(Math.random() * 3) + 1))
            .append('<div class="J_red_packet red-packet dd{2}" style="left:{0}%; top: -{1}px;"></div>'
                .format(65 + Math.round(Math.random() * 30 + 30),
                    itemHeight,
                    Math.round(Math.random() * 3) + 1))
            .append('<div class="J_red_packet red-packet dd{2}" style="left:{0}%; top: -{1}px;"></div>'
                .format(70 + Math.round(Math.random() * 30 + 30),
                    itemHeight,
                    Math.round(Math.random() * 3) + 1))
            .append('<div class="J_red_packet red-packet dd{2}" style="left:{0}%; top: -{1}px;"></div>'
                .format(Math.round(Math.random() * 30 + 15),
                    itemHeight,
                    Math.round(Math.random() * 3) + 1))
            .append('<div class="J_red_packet red-packet dd{2}" style="left:{0}%; top: -{1}px;"></div>'
                .format(Math.round(Math.random() * 30 + 20),
                    itemHeight,
                    Math.round(Math.random() * 3) + 1))
            .append('<div class="J_red_packet red-packet dd{2}" style="left:{0}%; top: -{1}px;"></div>'
                .format(Math.round(Math.random() * 30 + 30),
                    itemHeight,
                    Math.round(Math.random() * 3) + 1))
            .append('<div class="J_red_packet red-packet dd{2}" style="left:{0}%; top: -{1}px;"></div>'
                .format(Math.round(Math.random() * 30 + 30),
                    itemHeight,
                    Math.round(Math.random() * 3) + 1));
        return sb.toString();
    }


    function beginGame() {
        switchIntervalId = setInterval(function() {

            if (initCountdownNum <= 0) {
                clearInterval(switchIntervalId);
                $wrapGame.hide();
                console.log('倒计时结束');
            }

            $leftSecond.html(initCountdownNum--);

            $(_buildRedPacketDom()).appendTo($wrapGame).each(function(idx, item) {
                var $this = $(item);

                $this.on("touchstart", function(ev) {
                    ev.stopPropagation();
                    ev.preventDefault();

                    var $this = $(this);
                    var offset = $this.offset();
                    $this.remove();

                    $peng.css({
                        top: offset.top + $this.height() * 2,
                        left: offset.left + $this.width() * 2,
                        display: "block"
                    });

                    setTimeout(function() {
                        $peng.hide();
                    }, 25);

                });

                $this.velocity({
                    translateX: "-" + unitWidth * (parseInt(Math.random() * 10) + 1),
                    translateY: wHeight + unitHeight * (parseInt(Math.random() * 20) + 1)
                }, {
                    delay: 200 * idx,
                    duration: 2500,
                    easing: "ease-in-out",
                    complete: function() {
                        $(this).remove();
                    }
                });
            });
        }, 1000);
    }

    function setup() {
        beginNum();
        bindEvents();
    }

    setup();

})();