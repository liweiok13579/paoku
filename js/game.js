// 粒子动画
function lizi(cobj){
    this.cobj=cobj;
    this.x=0;
    this.y=0;
    this.x1=20*Math.random()-10;
    this.y1=20*Math.random()-10;
    this.x2=20*Math.random()-10;
    this.y2=20*Math.random()-10;
    this.speedy=-2-Math.random()-2;
    this.speedx=(16*Math.random()-8);
    this.life=4;
    this.r=1;
    this.color="red";
}
lizi.prototype={
    draw:function(){
        var cobj=this.cobj;
        cobj.save();
        cobj.beginPath();
        cobj.fillStyle=this.color;
        cobj.translate(this.x,this.y);
        cobj.scole(this.r,this.r);
        cobj.moveTo(0,0);
        cobj.bezierCurveTo(this.x1,this.y1,this.x2,this.y2,0,0);
        cobj.lineTo(this.x1, this.y1);
        cobj.lineTo(this.x2, this.y2);
        cobj.fill();
        cobj.restore();
    },
    update: function () {
        this.x += this.speedx;
        this.y += this.speedy;
        this.life -= 0.2;
        this.r -= 0.06;
    }
}

function stone(cobj,x,y,color){
    this.cobj=cobj;
    var color=color||"#fff";
    var stoneArr = [];
    for (var i = 0; i < 5; i++) {
        var obj = new lizi(cobj);
        obj.x = x;
        obj.y = y;
        obj.color=color;
        stoneArr.push(obj);
    }
    var t = setInterval(function () {
        for (var i = 0; i < stoneArr.length; i++) {
            stoneArr[i].draw();
            stoneArr[i].update();
            if (stoneArr[i].r < 0 || stoneArr[i].life < 0) {
                stoneArr.splice(i, 1);
            }
        }
        if (stoneArr.length == 0) {
            clearInterval(t);
        }
    }, 50)
}
//人物
function person(canvas,cobj,runImg,jumpImg){
    this.x=0;
    this.y=370;
    this.width=150;
    this.height=150;
    this.canvas=canvas;
    this.cobj=cobj;
    this.runImg=runImg;
    this.jumpImg=jumpImg;
    this.style="runImg";
    this.status=0;
    this.speedy=5;
    this.zhongli=10;
}
person.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        if(this.style=="runImg"){
            this.cobj.drawImage(this[this.style][this.status],0,0,200,200,0,0,this.width,this.height);
        }else{
            this.cobj.drawImage(this.jumpImg,0,0,200,200,0,0,this.width,this.height);
        }
        this.cobj.restore();
    },
    update:function(){
        if(this.y>this.endy){
            this.y=this.endy;
            stone(this.cobj,this.x+this.width/2,this.y+this.height)
        }else if(this.y<this.endy){
            this.speedy+=this.zhongli;
            this.y+=this.speedy;
        }
    }
}
//障碍物
function hinder(canvas,cobj,hinderImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.state=0;
    this.x=canvas.width;
    this.y=470;
    this.width=100;
    this.height=100;
}
hinder.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImg[this.state],0,0,200,200,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
//主程序
function game (canvas,cobj,runImg,jumpImg,hinderImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.person=new person(canvas,cobj,runImg,jumpImg);
    this.speed=10;
    this.cw=canvas.width;
    this.ch=canvas.height;
    this.hinderImg=hinderImg;
    this.hinderArr=[];
    this.life=3;
    this.score=1;
}
game.prototype={
    play:function(){
        var that=this;
        that.key();
        var num=0;
        var back=0;
        var num2=0;
        var step=5000+parseInt(5*Math.random())*1000;
        setInterval(function(){
         num++;
         back-=that.speed;
         that.person.x+=that.speed;
         that.cobj.clearRect(0,0,that.cw,that.ch);
         if(that.person.style=="runImg"){
             that.person.status=num%5;
         }else if(that.person.style=="jumpImg"){
             that.person.status=0;
         }
         that.person.draw();
         that.person.update();
         that.canvas.style.backgroundPosition=back+"px";
         if(num2%step==0){
                num2=0;
                step=8000+parseInt(5*Math.random())*1000;
                    var hinderObj=new hinder(that.canvas,that.cobj,that.hinderImg);
                    hinderObj.state=Math.floor(that.hinderImg.length*Math.random());
                    that.hinderArr.push(hinderObj);
                    if(that.hinderArr.length>5){
                        that.hinderArr.shift();
                    }
            }
            num2+=100;
           for(var i=0;i<that.hinderArr.length;i++){
                that.hinderArr[i].x-=that.speed;
                that.hinderArr[i].draw();
                if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                    if(!that.hinderArr[i].flag1) {
                        that.life++;
                        stone(that.cobj, that.person.x + that.person.width / 2, that.person.y + that.person.height / 2,"red")
                    }
                    that.hinderArr[i].flag1=true;
                    if(that.life<0){
                        alert("game over");
                        location.reload();
                    }

                }else if(that.hinderArr[i].x+that.hinderArr[i].width<that.person.x){
                    if(!that.hinderArr[i].flag&&!that.hinderArr[i].flag1) {
                        document.title=++that.score;
                        if(that.score%3==0){
                            that.speed+=1;
                        }
                    }
                    that.hinderArr[i].flag=true;
                }
         } 
     },200)
    },
    key:function(){
        var that=this;
        var flag=true;
        document.onkeydown=function(e){
            var code= e.keyCode;
            if(!flag){
                return;
            }
            flag=false;
            if(code=="32"){
                that.person.style="jumpImg";
                var initA=0;
                var speedA=5;
                var r=100;
                var initY=that.person.y;
                var t=setInterval(function(){
                  initA+=speedA;
                    if(initA>180){
                        stone(that.cobj, that.person.x + that.person.width / 2, that.person.y + that.person.height);
                        clearInterval(t);
                        that.person.style="runImg";
                        that.person.y=initY;
                         flag=true;
                    }else{
                        var len=Math.sin(initA*Math.PI/180)*r;
                        that.person.y=initY-len;
                    }
                },30)
            }
        }
    }
}