/**
 * Created by zhanghuan on 2016/12/15.
 * 公共方法类
 */
function YunJi(){

}

YunJi.prototype = {
    appUA:"",//app传过来的UserAgent,
    //basePath:"//t.yunjiweidian.com/yunjibuyer",
    basePath:"//" + window.location.host + "/performance",
    weixinInfo:{ //微信分享相关的信息
        title:"",
        desc:"",
        imgUrl:"",
        shareLink:""
    },
    /**
     * rem单位计算
     * 设计稿是宽750，当一个div的宽是30px，转换rem为：30px/100px = 0.3rem
     * 设计稿是宽375，当一个div的宽是30px，转换rem为：30px*2/100px = 0.6rem
     */
    initRem:function(){
        var appUA = navigator.userAgent; //app的UserAgent信息
        if(appUA && appUA.indexOf('{"appVersion') != -1){
            YunJi.appUA = JSON.parse(appUA.substring(appUA.indexOf('{')));
        }

        /*rem控制不同屏幕显示大小*/
        YunJi.windowSize(document, window);
        // window.onresize = function(){
        //     YunJi.windowSize(document, window);
        // };
    },
    /**
     * 计算html字体font-size大小
     * @param doc document对象
     * @param win window对象
     */
    windowSize:function(doc, win){
        var docEl = doc.documentElement,
            isIOS = navigator.userAgent.match(/iphone|ipod|ipad/gi),
            dpr = isIOS? Math.min(win.devicePixelRatio, 3) : 1,
            dpr = window.top === window.self? dpr : 1, //被iframe引用时，禁止缩放
            dpr = 1, // 首页引用IFRAME，强制为1
            scale = 1 / dpr,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
        docEl.dataset.dpr = win.devicePixelRatio;
        if(navigator.userAgent.match(/iphone/gi) && screen.width == 375 && win.devicePixelRatio == 2){
            docEl.classList.add('iphone6');
            //scale = 0.5;
        }
        if(navigator.userAgent.match(/iphone/gi) && screen.width == 414 && win.devicePixelRatio == 3){
            docEl.classList.add('iphone6p');
            //scale = 0.3333333333333333;
        }
         var metaEl = doc.createElement('meta');
         metaEl.name = 'viewport';
         metaEl.content = 'initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale;
         docEl.firstElementChild.appendChild(metaEl);
        //deviceWidth通过document.documentElement.clientWidth就能取到
        var recalc = function () {
            var width = docEl.clientWidth;
            if (width / dpr > 750) {
                width = 750 * dpr;
            }
            docEl.style.fontSize = 100 * (width / 750) + 'px';
        };
        recalc();
        if (!doc.addEventListener) return;
    },
    /**
     * 获取url参数
     * @param param 参数名
     * @returns {*}
     */
    getUrlParams: function(param) {
        var ps = decodeURI(location.href);
        if (ps == '') return '';
        var params = (ps.substr(ps.lastIndexOf("?") + 1)).split("&");
        if (params != null) {
          for (var i = 0; i < params.length; i++) {
            var strs = params[i].split("=");
            if (strs[0] == param && strs[1]) {
              return strs[1];
            }
          }
        }
        return "";
    },
    /**
     * 获取倒计时
     * @param t 毫秒数的时间戳
     * @param fmt 转换的时间格式 “dd hh:mm:ss”或者”dd hh:mm“
     * @returns {string}
     */
    getSurplus:function(t,fmt){
        var fmt = fmt || "dd hh:mm:ss";
        var d = 0,h = 0,m = 0,s = 0,str = "";
        if(t >= 0){
            d = Math.floor(t/1000/60/60/24);
            h = Math.floor(t/1000/60/60%24);
            m = Math.floor(t/1000/60%60);
            s = Math.floor(t/1000%60);
        }
        switch (fmt) {
            case "dd hh:mm:ss": //天 时分秒
                str += d + "天" + this.parseDate(h) + "时" + this.parseDate(m) + "分" + this.parseDate(s) + "秒";
                break;
            case "dd hh:mm:ss m": //天 时分秒
                str += '<span class="time">' + d + '</span>' + "天" + '<span class="time">' + this.parseDate(h) + '</span>' + "时" + '<span class="time">' + this.parseDate(m) + '</span>' + "分" + '<span class="time">' + this.parseDate(s) +'</span>'+ "秒";
                break;
            case "d h:m:s": //天 时:分:秒
              str += d + ":" + this.parseDate(h) + ":" + this.parseDate(m) + ":" + this.parseDate(s);
              break;
            case "dd hh:mm":  //天 时分秒
                str += d + "天" + this.parseDate(h) + "时" + this.parseDate(m) + "分";
                break;
            case "mm:ss":  //分秒
                str += '<span style="color:#F55636;">' + this.parseDate(m) + '</span>' + "分" +'<span style="color:#F55636;">'+ this.parseDate(s)+'</span>' + "秒";
                break;
            case "mm:ss r":  //分秒
                str += '<span style="color:#F10D3B;">' + this.parseDate(m) + '</span>' + "分" +'<span style="color:#F10D3B;">'+ this.parseDate(s)+'</span>' + "秒";
                break;
        }
        return str;
    },
    /**
     * 转换日期格式
     * @param t 毫秒数的时间戳
     * @returns {string}
     */
    getLimitTime:function(t){
        var month = 0,d = 0,h = 0,m = 0,str = "";
        var newTime = new Date(t);
        month = newTime.getMonth()+1;
        d = newTime.getDate();
        h = newTime.getHours();
        m = newTime.getMinutes();
        str += month + "月" + d + "日  "+ this.parseDate(h) + ":" + this.parseDate(m);
        return str;
    },
    /**
     * 倒计时用
     * @param t 毫秒数的时间戳
     * @param fmt 转换的时间格式 “dd hh:mm:ss”或者”dd hh:mm“
     * @param callback 回调函数，每秒返回倒计时的时间
     */
    getIntervalTime:function(t,fmt,callback){
      var timer = -1;
      timer = setInterval(() =>{
        t -= 1000;
        if(t <= 0){
          clearInterval(timer);
          return;
        }
        if(callback) {
          callback(YunJi.getSurplus(t, fmt),timer);
        }
      },1000);
    },
    /**
     * 判断是否css3中的Sticky属性
     * @returns {boolean}
     */
    isSupportSticky:function() {
        var prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
        var stickyText = '';
        for (var i = 0; i < prefixTestList.length; i++ ) {
            stickyText += 'position:' + prefixTestList[i] + 'sticky;';
        }
        // 创建一个dom来检查
        var div = document.createElement('div');
        var body = document.body;
        div.style.cssText = 'display:none;' + stickyText;
        body.appendChild(div);
        var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
        body.removeChild(div);
        div = null;
        return isSupport;
    },
    /**
     * 转换时间格式
     * 用法：format(ms,'yyyy-MM-dd hh:mm:ss')
     * @param time 毫秒数
     * @param fmt 要转换的时间格式
     */
    format:function(time,fmt){
        var d = new Date(time);
        var o = {
            "M+" : d.getMonth()+1,                 //月份
            "d+" : d.getDate(),                    //日
            "h+" : d.getHours(),                   //小时
            "m+" : d.getMinutes(),                 //分
            "s+" : d.getSeconds(),                 //秒
            "q+" : Math.floor((d.getMonth()+3)/3), //季度
            "S"  : d.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (d.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    },
    /**
     * 将小于10的数字前加一个0
     * @param t 需要转换的数字
     * @returns 返回转换过的数字
     */
    parseDate:function(t){
        return t < 10 ? "0" + t : t;
    },
    /**
     * 设置某个缓存
     * @param key 缓存名称
     * @param value 缓存值
     */
    setStorage: function(key, value) {
        key = key.replace(/\//g, '_');
        if (value === undefined) return;
        localStorage.setItem(key, JSON.stringify(value));
    },
    /**
     * 获取某个缓存
     * @param key 通过缓存名称
     */
    getStorage: function(key) {
        key = key.replace(/\//g, '_');
        return JSON.parse(localStorage.getItem(key));
    },
    /**
     * 清除某个缓存
     * @param key 通过缓存名称
     */
    removeStorage: function(key) {
        key = key.replace(/\//g, '_');
        localStorage.removeItem(key);
    },
    /**
     * 清除所有缓存
     */
    clearStorage: function() {
        localStorage.clear();
    },

    /**
     * 设置session某个缓存
     * @param key 缓存名称
     * @param value 缓存值
     */
    setSessionStorage: function(key, value) {
        key = key.replace(/\//g, '_');
        if (value === undefined) return;
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    /**
     * 获取session某个缓存
     * @param key 通过缓存名称
     */
    getSessionStorage: function(key) {
        key = key.replace(/\//g, '_');
        return JSON.parse(sessionStorage.getItem(key));
    },
    /**
     * 清除session某个缓存
     * @param key 通过缓存名称
     */
    removeSessionStorage: function(key) {
        key = key.replace(/\//g, '_');
        sessionStorage.removeItem(key);
    },
    /**
     * 清除session所有缓存
     */
    clearSessionStorage: function() {
        sessionStorage.clear();
    },
    /**
     * 设置页面标题
     */
    setDocumentTitle:function(title) {
      setTimeout(function() {
        //利用iframe的onload事件刷新页面
        document.title = title;
        var iframe = document.createElement('iframe');
        iframe.src = '//static.yunjiweidian.com/performance-manage/index/img/favicon.ico'; // 必须
        iframe.style.visibility = 'hidden';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.onload = function () {
          setTimeout(function () {
            document.body.removeChild(iframe);
          }, 0);
        };
        document.body.appendChild(iframe);
      }, 0);
    },
    /**
     * 将年月日转换成时间戳的形式
     * eg：将2017-03-28转换成1490630400000
     * @param str 日期的字符串
     * return times 时间戳
     */
    getDateTimes(str){
      var str = str.replace(/-/g,'/'); // 将-替换成/，因为下面这个构造函数只支持/分隔的日期字符串
      var date = new Date(str); // 构造一个日期型数据，值为传入的字符串
      var times = date.getTime();
      return times;
    },
    /**
     * 将当前的年月日转换成时间戳的形式
     */
    getCurrDateTimes(){
      var date = new Date();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentDate = date.getFullYear() + "-" + month + "-" + strDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      return YunJi.getDateTimes(currentDate);
    },
      /**
   * 获取cookie的函数
   */
  getCookie(cookieName){
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for(var i = 0; i < arrCookie.length; i++){
        var arr = arrCookie[i].split("=");
        if(cookieName == arr[0]){
            return arr[1];
        }
    }
    return "";
  },
  /**
   * 设置cookie
   */
  setYunjiCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var str = window.location.host.split(".")[1] + "." + window.location.host.split(".")[2];
    document.cookie = cname + "="+ escape (cvalue) + ";expires=" + d.toGMTString()+";path=/;domain="+str+";";
  },
  /**
   * 获取cookie
   */
  getYunjiCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
  },
  /**
   * 删除cookie
   */
  delYunjiCookie(name){
    YunJi.setYunjiCookie(name, "", -1);
  }
}

export var YunJi = new YunJi();





