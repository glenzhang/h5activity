(function () {
        var $resultWrap = $("#J_scratch_result");
        var $surplusNum = $("#J_surplus_num");
        var canvas = document.getElementById('J_canvas');
        var $canvas = $(canvas);
        var context = $canvas.length > 0 ? canvas.getContext('2d') : '';
        var canvasW = $canvas.parent().width();
        var canvasH = $canvas.parent().height();
        var isFingerOn = false;
        var countNum = 3; //剩余刮奖次数
 

     // canvas逻辑
        function initCanvasLayout() {
            $canvas.attr("width", canvasW).attr("height", canvasH).css("background-color", "transparent");
        }

        function bindDrawCanvas() {  //创建可画涂层
            if($canvas.length < 1) return;
            context.beginPath();
            context.fillStyle = "#c6c6c6";
            context.fillRect(0, 0, canvasW, canvasH);
            context.closePath();
        }

        function buildCanvasContent() {  //涂层上的字体绘画
            if($canvas.length < 1) return;
            context.beginPath();
            context.font = "38px Georgia";
            context.textAlign = "center";
            context.fillStyle = "#614747";
            context.fillText("刮奖区", canvasW / 2, canvasH / 2);

            context.font = "18px Verdana";
            context.fillText("刮开此涂层查看奖品", canvasW / 2, canvasH / 1.3);
            context.closePath();
        }

        function bindCanvasEvent() { //滑动过程三个阶段的控制
            if($canvas.length < 1) return;
            canvas.addEventListener('touchstart', touchStart, false);
            canvas.addEventListener('touchmove', touchMove, false);
            canvas.addEventListener('touchend', touchEnd, false);
        }

        function removeCanvasEvent() {
            if($canvas.length < 1) return;
            canvas.removeEventListener('touchstart', touchStart, false);
            canvas.removeEventListener('touchmove', touchMove, false);
            canvas.removeEventListener('touchend', touchEnd, false);
        }

        function touchStart(event) { 
            event.preventDefault();
            var touch = event.touches[0];
            isFingerOn = true;
            $resultWrap.show();
        }

        function touchMove(event) {   
            event.preventDefault();
            var touch = event.touches[0];
            var canvasPosition = $("#J_canvas").offset();
            var canvasLeft = canvasPosition.left;
            var canvasTop = canvasPosition.top;
            var startX = (touch.pageX - canvasLeft);
            var startY = (touch.pageY - canvasTop);

            if (isFingerOn) {
                drawArc(startX, startY, 20);
            }
        }

        function touchEnd(event) {  
            var num = 0;
            var data = context.getImageData(0, 0, canvasW, canvasH);

            isFingerOn = false;
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i] == 0) {
                    num++;
                };
            };

            if (num >= data.data.length * 0.3) {   //当画布滑开三分之一时
                context.fillRect(0, 0, canvasW, canvasH);
                $canvas.css("z-index", "2");
                $resultWrap.css("z-index", "3");   
                getPrize();
            };
        }

        function drawArc(x, y, r) {
            context.globalCompositeOperation = "destination-out";
            context.beginPath();
            context.arc(x, y, r, 0, Math.PI * 2);
            //canvas.style.display = "none";
            canvas.offsetHeight;
            //canvas.style.display = "inherit";
            context.fillStyle = "#000";
            context.fill();
            context.closePath();
        }

        

        // 刮奖请求接口
        function getPrize(){
            // $.getJSON(Url, function (res) {}); 请求刮奖接口返回刮奖结果
            countNum--;
            $surplusNum.text(countNum);
            var data = {
                amount : Math.ceil(Math.random()*10)
            }
            buildResultContent(data);  
        }

        // 刮奖区点击逻辑
        function bindLotteryEvent() {
         
            $(document).on("click", ".J_scratch_again_btn", function () {   
                //window.location.reload() //点击再刮一次可采取页面刷新,不去重绘下边的canvas；
                initCanvasLayout();
                bindDrawCanvas();
                buildCanvasContent();
                $resultWrap.css("z-index", "1");

            });
             
        }


        //奖品层展示逻辑
        function buildResultContent(data) {
            // type 1：中奖； 0：没中奖； 

            var btnVal = '再刮一次';
            var btnClass = 'J_scratch_again_btn'
            var LRSB = new StringBuilder();
            var money = data.amount;

            if(countNum == 0){
                btnVal = '机会已用完';
                btnClass = 'btn-end';
            }

            LRSB.append('<div class="result-box">')
                .append('<span>恭喜您,刮中了</span>')
                .append('<p class="result-price">{0}元返利红包</p>'.format(money))
                .append('<a class="{0} btn-result" href="javascript:void(0);" data-spm="super_lbhongbao.h5.pty-again~type-cash~module-popup">{1}</a>'.format(btnClass, btnVal))
                .append('</div>');

            $resultWrap.html("").append(LRSB.toString());
        }
        
       


        function setup() {
            initCanvasLayout();
            bindDrawCanvas();
            buildCanvasContent();
            bindCanvasEvent();
            bindLotteryEvent();
            $surplusNum.text(countNum);

        }

        setup();
}());