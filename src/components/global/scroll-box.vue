<template>
  <div class="scroll-box" :style="{height:height,width:width}" id="div1">
    <div class="scroll-content" id="ul1">
      <slot></slot>
    </div>
    <div id="bar"></div>
  </div>
</template>
<script>
export default {
  name:"scroll-box",
  props:{
    width:{
      type:String,
      default:'100%'
    },
    height:{
      type:[String,Number],
      default: (document.documentElement.clientHeight || document.body.clientHeight) + 'px'
    },
    hideBar:{
      type:[Boolean,String],
      default:false
    },
  },
  data(){
    return{}
  },
  mounted(){
    this.scrollFunc();
  },
  methods:{
    scrollFunc(){
      var _this = this;

      var scrollBox = document.getElementById('div1');
      var scroll = document.getElementById('ul1');
      var oBar = document.getElementById('bar');
      var downY = 0;//手指触到屏幕时的 Y 坐标
      var downTop = 0;//手指触到屏幕时的页面 top 坐标
      var prevY = 0;//上一次的 Y 坐标
      var iSpeedY = 0;//手指划屏的距离
      var timer = null;
      //计算滚动条的高度
      var barHeight = scrollBox.offsetHeight * scrollBox.offsetHeight / scroll.offsetHeight;
      
      if(barHeight <= 40){
        barHeight = 40;
      }else if( barHeight >= scrollBox.offsetHeight ){
        barHeight = 0;
      }
      //滚动条css
      oBar.style.height = barHeight + 'px';
      // touch开始
      scroll.ontouchstart = function(ev){
        var touchs = ev.changedTouches[0];
        downY = touchs.pageY;
        downTop = this.offsetTop;
        prevY = touchs.pageY;
        var bBtn = true;
        // touch移动
        scroll.ontouchmove = function(ev){
          var touchs = ev.changedTouches[0];
          
          iSpeedY = touchs.pageY - prevY;
          prevY = touchs.pageY;
          oBar.style.opacity = _this.hideBar ? 0 : 1;
          oBar.style.display = 'block';
          
          if(this.offsetTop >= 0){
            if(bBtn){
              bBtn = false;
              downY = touchs.pageY;
            }
            this.style.top = (touchs.pageY - downY)/3 + 'px';
            oBar.style.height = barHeight * ( 1 - this.offsetTop/scrollBox.offsetHeight ) + 'px'; 
            oBar.style.top = 0;
            
          }else if(this.offsetTop <= scrollBox.offsetHeight - scroll.offsetHeight){
            if(bBtn){
              bBtn = false;
              downY = touchs.pageY;
            }
            this.style.top = (touchs.pageY - downY)/3 + (scrollBox.offsetHeight - scroll.offsetHeight) + 'px';
            
            oBar.style.height = barHeight * ( 1 - Math.abs((this.offsetTop - (scrollBox.offsetHeight - scroll.offsetHeight)))/scrollBox.offsetHeight ) + 'px'; 
            oBar.style.top = scrollBox.offsetHeight - oBar.offsetHeight + 'px';
          }else{
            this.style.top = touchs.pageY - downY + downTop + 'px';
            var scaleY = this.offsetTop / (scrollBox.offsetHeight - scroll.offsetHeight);
            //document.title = scaleY;
            oBar.style.top = scaleY * (scrollBox.offsetHeight - oBar.offsetHeight) + 'px';
          }
        };
        // touch结束
        scroll.ontouchend = function(){
          this.ontouchmove = null;
          this.ontouchend = null;
          var that = this;
          //iSpeedY
          clearInterval(timer);
          timer = setInterval(function(){
            
            if( Math.abs(iSpeedY)<=1 || that.offsetTop > 50 || that.offsetTop <= scrollBox.offsetHeight - scroll.offsetHeight - 50 ){
              clearInterval(timer);
              if( that.offsetTop >= 0 ){
                _this.startMove(that,{top : 0},400,'easeOut',function(){
                  _this.startMove(oBar,{opacity : 0},400,'easeOut',function(){
                      this.style.display = 'none';
                  });
                });
                _this.startMove(oBar,{height : barHeight},400,'easeOut');
              }else if( that.offsetTop <= scrollBox.offsetHeight - scroll.offsetHeight ){
                _this.startMove(that,{top : scrollBox.offsetHeight - scroll.offsetHeight},400,'easeOut',function(){
                  _this.startMove(oBar,{opacity : 0},400,'easeOut',function(){
                    this.style.display = 'none';
                  });
                });
                _this.startMove(oBar,{height : barHeight , top : scrollBox.offsetHeight - barHeight},400,'easeOut');
              }else{
                _this.startMove(oBar,{opacity : 0},400,'easeOut',function(){
                  this.style.display = 'none';
                });
              }
            }else{
              iSpeedY *= 0.95;
              that.style.top = that.offsetTop + iSpeedY + 'px';
              
              if(that.offsetTop >= 0){
                oBar.style.height = barHeight * ( 1 - that.offsetTop/scrollBox.offsetHeight ) + 'px'; 
                oBar.style.top = 0;
              }else if(that.offsetTop <= scrollBox.offsetHeight - scroll.offsetHeight){
                oBar.style.height = barHeight * ( 1 - Math.abs((that.offsetTop - (scrollBox.offsetHeight - scroll.offsetHeight)))/scrollBox.offsetHeight ) + 'px'; 
                oBar.style.top = scrollBox.offsetHeight - oBar.offsetHeight + 'px';
              }else{
                var scaleY = that.offsetTop / (scrollBox.offsetHeight - scroll.offsetHeight);
            
                oBar.style.top = scaleY * (scrollBox.offsetHeight - oBar.offsetHeight) + 'px';
              }
            }
          },13);
          
        };
      };
    },
    startMove (obj,json,times,fx,fn,fnMove){
      var that = this;
      var iCur = {};
      for(var attr in json){
        if(attr == 'opacity'){
          iCur[attr] = Math.round(that.getStyle(obj,attr)*100);
        }
        else{
          iCur[attr] = parseInt(that.getStyle(obj,attr));
        }
      }
      
      var startTime = that.now();
      
      clearInterval(obj.timer);
      obj.timer = setInterval(function(){
        
        var changeTime = that.now();
        
        var scale = 1 - Math.max(0,(startTime - changeTime + times)/times);
        
        if(fnMove){
          fnMove(scale);
        }
        
        for(var attr in json){
                          
          var value = Tween[fx](scale*times, iCur[attr] , json[attr] - iCur[attr] , times );
          
          if(attr == 'opacity'){
            obj.style.filter = 'alpha(opacity='+ value +')';
            obj.style.opacity = value/100;
          }
          else{
            obj.style[attr] = value + 'px';
          }
          
          if(scale==1){
            clearInterval(obj.timer);
            if(fn){
              fn.call(obj);
            }
          }
          
        }
        
      },13);
      
      var Tween = {
        linear: function (t, b, c, d){
          return c*t/d + b;
        },
        easeIn: function(t, b, c, d){
          return c*(t/=d)*t + b;
        },
        easeOut: function(t, b, c, d){
          return -c *(t/=d)*(t-2) + b;
        },
        easeBoth: function(t, b, c, d){
          if ((t/=d/2) < 1) {
            return c/2*t*t + b;
          }
          return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInStrong: function(t, b, c, d){
          return c*(t/=d)*t*t*t + b;
        },
        easeOutStrong: function(t, b, c, d){
          return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeBothStrong: function(t, b, c, d){
          if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
          }
          return -c/2 * ((t-=2)*t*t*t - 2) + b;
        }
      }
    },
    getStyle(obj,attr){
      return getComputedStyle(obj,false)[attr];
    },
    now(){
      return Date.now();
    }
  }
}
</script>
<style scoped>
.scroll-box{
  overflow: hidden;
  width: 100%;
  position: relative;
}
.scroll-content{
    position: absolute;
    top: 0;
    width: 100%;
  }
#bar{ 
    width:4px; 
    height:88px; 
    position:absolute; 
    top:0; 
    right:1px; 
    border-radius:2px; 
    background:#999; 
    display:none;
  }
</style>

