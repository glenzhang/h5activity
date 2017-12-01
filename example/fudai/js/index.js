(function() {

    var $imgs = $('#J_num_container img');
    var $comeTextWrap = $('#J_come_text_wrap');
    var $fdWrap = $('#J_fd_wrap');
    var $cdNum = $('#J_cd_num');
    var $fd = $('#J_fd');
    var $hitMe = $('#J_hit_me');
    var $comeOnWrap = $('#J_come_on_wrap');
    var startSwitch = false; // 点击福袋开关

    var comeOnCount = 0;

    var prefix = '../fudai/images/';

    var R = [-110, -100, -80, -20, 20, 80, 100, 110];
    var S = [-60, -70, -80, -90, -110];

    var T = {
        getX: function() {
            var n = parseInt(Math.random() * R.length, 10);
            return R[n]
        },
        getY: function() {
            var n = parseInt(Math.random() * S.length, 10);
            return S[n]
        },

        addPoint: function() {
            for (var n = $(); n.length <= 8;) n = n.add(this.genPoint());

            n.appendTo($('#J_fd_box')).each(function(n, t) {
                var e = $(this);
                new Parabola({
                    el: e,
                    offset: [T.getX(), T.getY()],
                    curvature: .05,
                    duration: 600,
                    callback: function() {
                        e.remove()
                    },
                    stepCallback: function(n, t) {}
                }).start()
            })
        },

        genPoint: function() {
            return $('<div class="point-{0}"></div>'.format(Math.round(Math.random() * 7) + 1));
        }
    };



    function beginNum() {
        var i = 5;
        var tid = setInterval(function() {
            i--;
            $imgs.hide().eq(i).show();
            if (i < 0) {
                clearInterval(tid);
                $comeTextWrap.remove();
                $fdWrap.show(startOps);
            }
        }, 1000);
    }

    function showComeOnText() {
        if ($comeOnWrap.find('img').length > 0) {
            return;
        }

        $('<img class="come-on-{0} animated zoomIn" src="{1}come-on-{0}.png">'.format(Math.round(Math.random() * 4) + 1, prefix))
            .appendTo($comeOnWrap)
            .on("webkitAnimationEnd", function(ev) {
                $(this).remove();
            });
    }

    function bindEvents() {
        $fd.on('touchstart', function() {
            $hitMe.remove();

            if (startSwitch) {
                return;
            }

            startSwitch = true;

            comeOnCount++;

            if (comeOnCount % 2 == 0) {
                showComeOnText();
            }

            $fd.addClass('pulse');
            T.addPoint();


        }).on('webkitAnimationEnd', function(ev) {
            startSwitch = false;
            $fd.removeClass('pulse');
        });
    }

    function startOps() {
        var i = 20;
        var tid = setInterval(function() {
            i--;
            $cdNum.text(i);
            if (i <= 0) {
                clearInterval(tid);
                countdownComplete();
            }
        }, 1000);
    }


    function countdownComplete() {
        console.log('倒计时结束');
    }

    function plusOps(awardtype) {
        $('<img class="plus animated fadeOutUp" src="{1}{0}-plus.png">'.format(awardtype, prefix))
            .appendTo($fdWrap)
            .on("webkitAnimationEnd", function(ev) {
                $(this).remove();
            });
    }


    function setup() {
        bindEvents();
        beginNum();
    }

    setup();

})();