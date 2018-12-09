/**
 * Created by zhanghuan on 2016/12/15.
 * 公共方法类
 */
function YunJi() {

}
var currentAjax = null; //当前请求的ajax

YunJi.prototype = {
  appUA: "",//app传过来的UserAgent,
  //basePath:"//t.yunjiweidian.com/yunjibuyer",
  basePath: "//" + window.location.host + "/yunjibuyer",
  weixinInfo: { //微信分享相关的信息
    title: "",
    desc: "",
    imgUrl: "",
    shareLink: ""
  },
  /**
   * rem单位计算
   * 设计稿是宽750，当一个div的宽是30px，转换rem为：30px/100px = 0.3rem
   * 设计稿是宽375，当一个div的宽是30px，转换rem为：30px*2/100px = 0.6rem
   */
  initRem: function () {
    var appUA = navigator.userAgent; //app的UserAgent信息
    if (appUA && appUA.indexOf('{"appVersion') != -1) {
      YunJi.appUA = JSON.parse(appUA.substring(appUA.indexOf('{')));
    }

    /*rem控制不同屏幕显示大小*/
    YunJi.windowSize(document, window);
    window.onresize = function () {
      YunJi.windowSize(document, window);
    };
  },
  /**
   * 计算html字体font-size大小
   * @param doc document对象
   * @param win window对象
   */
  windowSize: function (doc, win) {
    var docEl = doc.documentElement,
      isIOS = navigator.userAgent.match(/iphone|ipod|ipad/gi),
      dpr = isIOS ? Math.min(win.devicePixelRatio, 3) : 1,
      dpr = window.top === window.self ? dpr : 1, //被iframe引用时，禁止缩放
      dpr = 1, // 首页引用IFRAME，强制为1
      scale = 1 / dpr,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    docEl.dataset.dpr = win.devicePixelRatio;
    if (navigator.userAgent.match(/iphone/gi) && screen.width == 375 && win.devicePixelRatio == 2) {
      docEl.classList.add('iphone6');
      //scale = 0.5;
    }
    if (navigator.userAgent.match(/iphone/gi) && screen.width == 414 && win.devicePixelRatio == 3) {
      docEl.classList.add('iphone6p');
      //scale = 0.3333333333333333;
    }
    var metaEl = doc.createElement('meta');
    metaEl.name = 'viewport';
    metaEl.content = 'initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale;
    docEl.firstElementChild.appendChild(metaEl);
    //deviceWidth通过document.documentElement.clientWidth就能取到
    var recalc = function () {
      var width = $(window).width();
      if (width / dpr > 750) {
        width = 750 * dpr;
      }
      docEl.style.fontSize = 100 * (width / 750) + 'px';
    };
    recalc();
    if (!doc.addEventListener) return;
  },
  /**
   * rem转成px
   */
  remToPx: function (remNum) {
    let rootFontSize = Number.parseFloat(document.documentElement.style.fontSize);
    return remNum * rootFontSize;
  },
  /**
   * 获取url参数
   * @param param 参数名
   * @returns {*}
   */
  getUrlParams: function (param) {
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
   * 获取url参数
   * @param url   用来获取参数的链接
   * @param param 参数名
   * @returns {*}
   */
  getRedirectUrlParams: function (url,param) {
    var ps = decodeURI(url);
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
   * 设备类型
   */
  getPhoneType() {
    var result = false;
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
      result = false;
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
      result = true;
    } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
      result = false;
    } else if (u.indexOf('iPhone Simulator') > -1) {
      result = true;
    }
    return result;
  },
  /**
   * 获取倒计时
   * @param t 毫秒数的时间戳
   * @param fmt 转换的时间格式 “dd hh:mm:ss”或者”dd hh:mm“
   * @returns {string}
   */
  getSurplus: function (t, fmt) {
    var fmt = fmt || "dd hh:mm:ss";
    var d = 0, h = 0, m = 0, s = 0, str = "";
    if (t >= 0) {
      d = Math.floor(t / 1000 / 60 / 60 / 24);
      h = Math.floor(t / 1000 / 60 / 60 % 24);
      m = Math.floor(t / 1000 / 60 % 60);
      s = Math.floor(t / 1000 % 60);
    }
    switch (fmt) {
      case "hh:mm:ss":
           h = d*24+h;
           if(h > 0){
             str = this.parseDate(h)+":";
           }
        str =str+this.parseDate(m)+":"+this.parseDate(s)
        break;
      case "dd hh:mm:ss": //天 时分秒
        str += d + "天" + this.parseDate(h) + "时" + this.parseDate(m) + "分" + this.parseDate(s) + "秒";
        break;
      case "dd hh:mm:ss n": //天 时分秒
        str += this.showNewStr(d, h, m, s);
        break;
      case "dd hh:mm:ss m": //天 时分秒 (倒计时长大于24小时，展示天/时/分/秒，倒计时小于等于24小时，展示时/分/秒)
        str += this.showNewS(d, h, m, s);
        break;
      case "d h:m:s": //天 时:分:秒
        str += d + ":" + this.parseDate(h) + ":" + this.parseDate(m) + ":" + this.parseDate(s);
        break;
      case "dd hh:mm":  //天 时分
        str += d + "天" + this.parseDate(h) + "时" + this.parseDate(m) + "分";
        break;
      case "h:m": //时:分
        str += this.parseDate(h) + ":" + this.parseDate(m);
        break;
      case "dd h:m:s": //剩天时分秒
        str += this.showStr(d, h, m, s);
        break;
      case "h:m:s": //剩时分秒
        str += this.showStr(d, h, m, s);
        break;
      case "mm:ss":  //还剩 分秒
        str += this.showStr(d, h, m, s);
        break;
      case "m:s":  //分秒
        if (m == 0) {
          if (s == 0) {
            str += "";
          } else {
            str += "00:" + this.parseDate(s);
          }
        } else {
          str += this.parseDate(m) + ":" + this.parseDate(s);
        }
        break;
      case "m:s n":  //分秒
        if (m == 0) {
          if (s == 0) {
            str += "";
          } else {
            str += "0分" + this.parseDate(s)+"秒";
          }
        } else {
          str += this.parseDate(m) + "分" + this.parseDate(s)+"秒";
        }
        break;
      case "hh":
        var hours = d * 24;
        str = str + (hours + parseInt(this.parseDate(h)));
        break;
      case "mm":
        str += this.parseDate(m);
        break;
      case "ss":
        str += this.parseDate(s);
        break;
    }
    return str;
  },
  showStr: function (d, h, m, s) {
    var dStr = d > 0 ? "<span class='time'>" + this.parseDate(d) + "</span><i>天</i>" : '';
    var hStr = d > 0 && h >= 0 || (d <= 0 && h > 0) ? "<span class='time'>" + this.parseDate(h) + "</span><i>时</i>" : '';
    var mStr = m > 0 ? "<span class='time'>" + this.parseDate(m) + "</span><i>分</i>" : '';
    var sStr = "<span class='time'>" + this.parseDate(s) + "</span><i>秒</i>";
    var str = m == 0 && s == 0 ? "" : "（剩" + dStr + hStr + mStr + sStr + "）";
    return str;
  },
  showNewStr: function (d, h, m, s) {
    var dStr = d > 0 ? this.parseDate(d) + "<span class='send-back-interval'>天</span>" : '';
    var hStr = d > 0 && h >= 0 || (d <= 0 && h > 0) ? this.parseDate(h) + "<span class='send-back-interval'>时</span>" : '';
    var mStr = m > 0 ? this.parseDate(m) + "<span class='send-back-interval'>分</span>" : '';
    var sStr = this.parseDate(s) + "<span class='send-back-interval'>秒</span>";
    var str = m == 0 && s == 0 ? "" : dStr + hStr + mStr + sStr;
    return str;
  },
  showNewS: function (d, h, m, s) {
    var dStr = d > 0 ? this.parseDate(d) + "<span class='send-back-interval'>天</span>" : '';
    var hStr = this.parseDate(h) + "<span class='send-back-interval'>时</span>";
    var mStr = this.parseDate(m) + "<span class='send-back-interval'>分</span>";
    var sStr = this.parseDate(s) + "<span class='send-back-interval'>秒</span>";
    var str = dStr + hStr + mStr + sStr;
    return str;
  },
  /**
   * 转换日期格式
   * @param t 毫秒数的时间戳
   * @returns {string}
   */
  getLimitTime: function (t) {
    var month = 0, d = 0, h = 0, m = 0, str = "";
    var newTime = new Date(t);
    month = newTime.getMonth() + 1;
    d = newTime.getDate();
    h = newTime.getHours();
    m = newTime.getMinutes();
    str += month + "月" + d + "日  " + this.parseDate(h) + ":" + this.parseDate(m);
    return str;
  },
  /**
   * 倒计时用
   * @param t 毫秒数的时间戳
   * @param fmt 转换的时间格式 “dd hh:mm:ss”或者”dd hh:mm“
   * @param callback 回调函数，每秒返回倒计时的时间
   */
  getIntervalTime: function (t, fmt, callback) {
    var timer = -1;
    timer = setInterval(() => {
      t -= 1000;
      if (callback) {
        callback(YunJi.getSurplus(t, fmt), timer);
      }
      if (t <= 0) {
        clearInterval(timer);
        return;
      }
    }, 1000);
  },
  /**
   * 判断是否css3中的Sticky属性
   * @returns {boolean}
   */
  isSupportSticky: function () {
    var prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
    var stickyText = '';
    for (var i = 0; i < prefixTestList.length; i++) {
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
  format: function (time, fmt) {
    var d = new Date(time);
    var o = {
      "M+": d.getMonth() + 1,                 //月份
      "d+": d.getDate(),                    //日
      "h+": d.getHours(),                   //小时
      "m+": d.getMinutes(),                 //分
      "s+": d.getSeconds(),                 //秒
      "q+": Math.floor((d.getMonth() + 3) / 3), //季度
      "S": d.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
    /**
   * 转换时间格式(兼容ios浏览器)
   * 用法：format(ms,'yyyy-MM-dd hh:mm:ss')
   * @param time 毫秒数
   * @param fmt 要转换的时间格式
   */
  formatNew: function (time, fmt) {
    if (typeof time == 'string' && time.constructor == String) {
      time = time.toString().replace(/-/g, "/");
    }
    var d = new Date(time);
    var o = {
      "M+": d.getMonth() + 1,                 //月份
      "d+": d.getDate(),                    //日
      "h+": d.getHours(),                   //小时
      "m+": d.getMinutes(),                 //分
      "s+": d.getSeconds(),                 //秒
      "q+": Math.floor((d.getMonth() + 3) / 3), //季度
      "S": d.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  // 传入时间是否是今天
  timeIsToday: function(time){
    let d = new Date(Date.now() + 24 * 60 * 60 * 1000 + 8*3600*1000);
    return time < new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0).getTime();
  },
  // 传入时间是否是明天
  timeIsTomorrow: function(time){
    let d = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 8*3600*1000);
    return time < new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0).getTime();
  },
  /**
   * 将小于10的数字前加一个0
   * @param t 需要转换的数字
   * @returns 返回转换过的数字
   */
  parseDate: function (t) {
    return t < 10 ? "0" + t : t;
  },
  /**
   * 设置某个缓存
   * @param key 缓存名称
   * @param value 缓存值
   */
  setStorage: function (key, value) {
    key = key.replace(/\//g, '_');
    if (value === undefined) return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  /**
   * 获取某个缓存
   * @param key 通过缓存名称
   */
  getStorage: function (key) {
    key = key.replace(/\//g, '_');
    return JSON.parse(localStorage.getItem(key));
  },
  /**
   * 清除某个缓存
   * @param key 通过缓存名称
   */
  removeStorage: function (key) {
    key = key.replace(/\//g, '_');
    localStorage.removeItem(key);
  },
  /**
   * 清除所有缓存
   */
  clearStorage: function () {
    localStorage.clear();
  },

  /**
   * 设置session某个缓存
   * @param key 缓存名称
   * @param value 缓存值
   */
  setSessionStorage: function (key, value) {
    key = key.replace(/\//g, '_');
    if (value === undefined) return;
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  /**
   * 获取session某个缓存
   * @param key 通过缓存名称
   */
  getSessionStorage: function (key) {
    key = key.replace(/\//g, '_');
    return JSON.parse(sessionStorage.getItem(key));
  },
  /**
   * 清除session某个缓存
   * @param key 通过缓存名称
   */
  removeSessionStorage: function (key) {
    key = key.replace(/\//g, '_');
    sessionStorage.removeItem(key);
  },
  /**
   * 清除session所有缓存
   */
  clearSessionStorage: function () {
    sessionStorage.clear();
  },
  /**
   * 设置页面标题
   */
  setDocumentTitle: function (title) {
    setTimeout(function () {
      //利用iframe的onload事件刷新页面
      document.title = title;
      var iframe = document.createElement('iframe');
      iframe.src = '//static.yunjiweidian.com/qnUpload/frontend/logo/favicon.ico'; // 必须
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
  getDateTimes(str) {
    var str = str.replace(/-/g, '/'); // 将-替换成/，因为下面这个构造函数只支持/分隔的日期字符串
    var date = new Date(str); // 构造一个日期型数据，值为传入的字符串
    var times = date.getTime();
    return times;
  },
  /**
   * 将当前的年月日转换成时间戳的形式
   */
  getCurrDateTimes() {
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
   * 截取字符串
   * @param str 需要截取的字符串
   * @param len 截取的长度
   * return str 截取后的字符串
   */
  cutStr(str, len) {
    var str_length = 0;
    var str_len = 0;
    var str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
      var a = str.charAt(i);
      str_length++;
      if (escape(a).length > 4) {
        //中文字符的长度经编码之后大于4
        str_length++;
      }
      str_cut = str_cut.concat(a);
      if (str_length > len) {
        str_cut = str_cut.substring(0, str_cut.length - 1).concat("...");
        return str_cut;
      }
    }
    //如果给定字符串小于等于指定长度，则返回源字符串；
    if (str_length <= len) {
      return str;
    }
  },
  /**
   * 是否是微信浏览器，true代表是微信浏览器
   */
  isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 是否是app，true代表是app版本
   */
  isApp() {
    var appCont = YunJi.getUrlParams('appCont') || 0;//H5、app
    var isNewVersion = YunJi.getUrlParams('isNewVersion') || 0; //专题
    if (appCont == 1 || appCont == 2 || isNewVersion == 1) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 是否是QQ，true代表是QQ
   */
  isQQ() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/QQ/i) == "qq") { //在QQ打开
      return true;
    } else {
      return false;
    }
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
   * 设置用户登录的cookie，只有非微信浏览器
   * qq、微博浏览器，或者其他浏览器登录成功才存在此cookie信息
   */
  setJPCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var str = window.location.host.split(".")[1] + "." + window.location.host.split(".")[2];
    document.cookie = cname + "=" + escape(cvalue) + ";expires=" + d.toGMTString() + ";path=/;domain=" + str + ";";
  },
  /**
   * 清除用户登录的cookie，只有非微信浏览器
   * qq、微博浏览器，或者其他浏览器登录成功才存在此cookie信息
   */
  clearJPCookie(cname) {
    YunJi.setJPCookie(cname, "", -1);
  },
  /**
   * 获得角度
   */
  getAngle(angx, angy) {
    return Math.atan2(angy, angx) * 180 / Math.PI;
  },
  /**
   * 根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
   */
  getDirection(startx, starty, endx, endy) {
    var angx = endx - startx;
    var angy = endy - starty;
    var result = 0;
    //如果滑动距离太短
    if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
      return result;
    }
    var angle = YunJi.getAngle(angx, angy);
    if (angle >= -135 && angle <= -45) {
      result = 1;
    } else if (angle > 45 && angle < 135) {
      result = 2;
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
      result = 3;
    } else if (angle >= -45 && angle <= 45) {
      result = 4;
    }
    return result;
  },
  /**
   * 客户端版本检测
   * @params version 最新版本信息对象
   * 例：version = {
     *          appCont：1, //Number
     *          android：{
     *               seller: '3.66.0811', //String
     *               vip:    '2.0.0811'  //String
     *          },
     *          ios:{
     *               seller: '3.66.0811', //String
     *               vip:    '2.0.0811'  //String
     *          }
     *     }
   * @return
   */
  isNewVersion(version) {
    let isNewVersion = false;//是否客户端新版本
    switch (version.appCont) {
      case 0:
        isNewVersion = false;
        break
      case 1: //卖家版
        if (YunJi.appUA.appVersion > version.ios.seller && YunJi.appUA.appClient == 'ios' || YunJi.appUA.appVersion > version.android.seller && YunJi.appUA.appClient == 'android') {
          isNewVersion = true;
        } else {
          isNewVersion = false;
        }
        break;
      case 2:  //买家版
        if (YunJi.appUA.appVersion > version.ios.vip && YunJi.appUA.appClient == 'ios' || YunJi.appUA.appVersion > version.android.vip && YunJi.appUA.appClient == 'android') {
          isNewVersion = true;
        } else {
          isNewVersion = false;
        }
        break;
    }
    return isNewVersion
  },
  /**
   * 加载腾讯视频
   * 需要在页面引入腾讯视频 tvp.player.js
   * @params vid 腾讯视频vid
   * @params width  视频显示高度
   * @params height 视频显示宽度
   * @params auto   视频是否自动播放
   *
   */
  setTencentVideo(videoInfo) {
    let video = new tvp.VideoInfo();//定义视频对象
    video.setVid(videoInfo.vid);//向视频对象传入视频vid
    let player = new tvp.Player(videoInfo.width, videoInfo.height);//定义播放器对象
    player.setCurVideo(video);//设置播放器初始化时加载的视频
    player.addParam('flashskin', window.location.protocol + '//imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf');//设置精简皮肤，仅点播有效
    player.addParam('autoplay', videoInfo.auto || true);//是否自动播放
    player.addParam('wmode', 'window');//默认情况下，视频处为最高级，总是处于页面的最上层，应当设置其透明
    player.addParam('showend', 0);//结束画面是否有广告画面，或者是该视频本身结束
    player.addParam('preload', true);
    player.write('tencent-video');//输出播放器,参数是输出dom的id
  },
  //是否跨境商品
  isCrossBorder(itemChannel) {
    if (itemChannel == 3 || itemChannel == 4 || itemChannel == 5 || itemChannel == 6 || itemChannel == 7 || itemChannel == 8 || itemChannel == 9 || itemChannel == 10 || itemChannel == 11 || itemChannel == 12 || itemChannel == 13) {
      return true
    } else {
      return false
    }
  },
  /**
   * 判断对象是否为空
   */
  isEmptyObj(obj) {
    if (JSON.stringify(obj) == "{}" || obj == '{}') {
      return true;
    } else {
      return false;
    }
  },
  //设置购物车请求总数的cookie
  setCartCookie(cartNum){
    var d = new Date();
    d.setTime(d.getTime() + (5 * 1000));
    var str = window.location.host.split(".")[1] + "." + window.location.host.split(".")[2];
    let userCookies = document.cookie;
    if(userCookies == "" || userCookies === null || typeof(userCookies) == 'undefined'){
      document.cookie = "CART_COUNT=" + cartNum + ";expires=" + d.toGMTString() + ";path=/;domain=" + str + ";";
    }else{
      if(userCookies.indexOf("CART_COUNT") == -1){
        document.cookie = "CART_COUNT=" + cartNum + ";expires=" + d.toGMTString() + ";path=/;domain=" + str + ";";
      }
    }
  },
  //清除cookie
  clearCookie(){
    var str = window.location.host.split(".")[1] + "." + window.location.host.split(".")[2];
    document.cookie = "CART_COUNT=null;expires=-1;path=/;domain=" + str + ";";
  },
  //节流函数
  throttle(fn, delay) {
    //now:当前的时间; lastExec:上次执行的时间; timer: 记录timeout的id; context: fn执行的上下文作用域；args:函数执行传递的参数
    var now, lastExec, timer, context, args;
    //scroll回调函数真正执行的核心函数
    var execute = function() {
        fn.apply(context, args);
        lastExec = now;
    };
    //闭包函数(绑定到scroll事件上的回调函数)
    return function() {
      context = this;
      args = arguments;
      now = Date.now();
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (lastExec) {
        //判断是否超过指定时间间隔，超过则执行
        var diff = delay - (now - lastExec);
        if (diff < 0) {
          execute();
        } else {
          timer = setTimeout(() => {
              execute();
          }, diff);
        }
      } else {
        execute();
      }
    };
  },
  //防抖函数
  debounce (fn,delay,mustRunDelay){
    var timer = null;
    var t_start;
    return function(){
      var context = this;
      var args = arguments;
      var t_curr = +new Date();
      clearTimeout(timer);
      if(!t_start){
        t_start = t_curr;
      }
      if(t_curr - t_start >= mustRunDelay) {
        fn.apply(context,args);
        t_start = t_curr
      } else {
        timer = setTimeout(function(){
          fn.apply(context,args);
        },delay);
      }
    }
  },
  /**
   * 资源位产出值上报
   */
  resourceStorage(){
    if(YunJi.getUrlParams('RSid')){
      var resourceStateDate = { //源位产出后端记录
        "resource_state_id": YunJi.getUrlParams('RSid'), // 预设资源位id
        "business_id":YunJi.getUrlParams('Bid') // 业务ID
      };
      if(YunJi.getUrlParams('Ctype')){// 内容类型
        resourceStateDate.content_type = YunJi.getUrlParams('Ctype')
      }
      if(YunJi.getUrlParams('Cid')){// 内容id
        resourceStateDate.content_id = YunJi.getUrlParams('Cid')
      }
      if(YunJi.getUrlParams('ATid')){// 活动场次id
        resourceStateDate.activity_time_id = YunJi.getUrlParams('ATid')
      }
      return resourceStateDate
    }else{ // 当本次进入没有资源位,有上一次的资源位缓存时,清除上一次的资源位数据
      return YunJi.removeStorage("resourceState");
    }
  }

}

export default YunJi = new YunJi();

if (YunJi.getPhoneType()) {
  var _sort = Array.prototype.sort;
  Array.prototype.sort = function (fn) {
    if (!!fn && typeof fn === 'function') {
      if (this.length < 2) return this;
      var i = 0, j = i + 1, l = this.length, tmp, r = false, t = 0;
      for (; i < l; i++) {
        for (j = i + 1; j < l; j++) {
          t = fn.call(this, this[i], this[j]);
          r = (typeof t === 'number' ? t : !!t ? 1 : 0) > 0 ? true : false;
          if (r) {
            tmp = this[i];
            this[i] = this[j];
            this[j] = tmp;
          }
        }
      }
      return this;
    } else {
      return _sort.call(this);
    }
  };
}


