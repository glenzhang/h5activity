(function() {

    var $surplusNumBox = $("#J_surplus_num");
    var $btnPlay = $("#J_btn_play");
    var $prizeItem = $(".J_prize_item");
    var prizeItemLength = $prizeItem.length;
    // 已经完成的动画次数
    var anmatedCount = 0;
    // 剩余抽奖次数
    var surplusNum = 10;
    // 是否正在执行请求结果并执行动画
    var isGetting = false;

    function setUp() {

        $surplusNumBox.text(surplusNum);
        $btnPlay.on("click", playHandler);
        $("#J_scroll_list").css3ScrollText();
        $prizeItem.on('webkitTransitionEnd', function(ev) {
            anmatedCount++;
            if (anmatedCount >= prizeItemLength) {
                isGetting = false;
                showResult();
                console.log('log-显示抽奖结果');
            }
        });
    }

    function showResult() {
        // 获奖逻辑填入

        // 显示获奖时，执行动画重置操作
        // animateReset();
    }

    function playHandler() {
        if (isGetting) {
            return;
        }

        surplusNum--;
        if (surplusNum < 0) {
            console.log('摇奖次数已用完:(');
            return;
        } else {
            $surplusNumBox.text(surplusNum);
        }

        isGetting = true;

        anmatedCount = 0;
        $prizeItem.css({ "transitionDuration": "3s" });

        //$.getJSON().done(function(res) {})
        // 发送ajax取回中奖号码
        var data = { //抽奖接口返回数据data
            amount: 10 //返回金额决定老虎机内转盘旋转的角度(金额要和规定金额一致，不然找不到对应的角度)
        }
        playAnimation(data);
    }


    function playAnimation(result) { //老虎机转动逻辑
        var resultY = 0;

        if (result.amount > 0) { //根据中奖金额选择转的角度
            // 1, 3, 5, 10对应雪碧图奖品位置Y轴20%, 40%, 60%, 80%
            resultY = ([1, 3, 5, 10].indexOf(result.amount) + 1) * 20;
        };

        if (result.amount == 0) resultY = 100;

        $prizeItem.each(function() {
            // 一共有6张图 20一份, 一个循环周期为120, 修改后记得调整
            var randomNum = Math.round(Math.random() * 15 + 2) * 120;
            $(this).css({ "backgroundPositionY": randomNum + resultY + "%" });
        });
    }

    function animateReset() {
        // 重置动画到起始位置
        $prizeItem.css({ "backgroundPositionY": "0%", "transitionDuration": "0s" });
    }


    setUp();

})();