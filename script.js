$(document).ready(function() {
  var APP = {
    setWeatherText(str) {
      document.getElementById('weather').innerText = str;
    },
    setDateText(str) {
      document.getElementById('time').innerText = str;
    },
    getDate: function() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth(); // not +1
      var day = now.getDate();
      var hour = now.getHours();
      var minutes = now.getMinutes();
      var week = now.getDay();
      // 0年,1月,2日,3时,4分,5星期

      if (minutes < 9) minutes = '0' + minutes;

      return [year, month, day, hour, minutes, week];
    },
    getCoveredDate: function(date) {
      var week = date[5];
      var nong = window.chineseLunar.solarToLunar(new Date(date[0], date[1], date[2]), 'MD');
      return [nong, week];
    },
    getCity(callback) {
      var cityUrl = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
      $.getScript(cityUrl, function(script) {
        var city = window.remote_ip_info;
        if (callback) callback(city.city);
      });
    },
    getWeather: function(city, callback) {
      var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&city=" + city + "&day=0&dfc=3";

      // ajax
      $.ajax({
        url: url,
        dataType : "script",
        scriptCharset : "gbk",
        success: function(data) {
          var w = window.SWther.w;
          if (w[city] && callback) callback(w[city]);
        }
      });
    },
    setBackground: function(url) {
      var styleVal = 'background-image:url("'+url+'")';
      document.getElementById('quick').setAttribute('style', styleVal);
    },
    initBaiduSuggestion: function() {
      BaiduSuggestion.bind("baidu_search",
      {
          "XOffset": 8,     // 提示框位置横向偏移量,单位px
          "YOffset": -1,     // 提示框位置纵向偏移量,单位px
          "width": 539,     // 提示框宽度，单位px
          "fontColor": "#3B3B3B",     // 提示框文字颜色
          "fontColorHI": "black",     // 提示框高亮选择时文字颜色
          "fontSize": "16px",      // 文字大小
          "fontFamily": "Microsoft YaHei",     // 文字字体
          "borderColor": "#b6b6b6",     // 提示框的边框颜色
          "bgcolorHI": "#ddd",     // 提示框高亮选择的颜色
          "sugSubmit": true     // 选中提示框中词条时是否提交表单
      }
      , function(txt){
      });
    },
    initForm() {
      $('#search-form').on('submit', function(e) {
        var data = BaiduHttps.useHttps();
        console.log(data);
      });
    },
    setFocus() {
      setTimeout(function() {
        $('#baidu_search').focus();
      }, 500);
    }
  };

  // date
  function setDate() {
    var date = APP.getDate();
    var coveredDate = APP.getCoveredDate(date);
    var str = date[0] + '年' + date[1] + '月' + date[2] + '日 ' + date[3] + ':' + date[4];
    str += ' 星期' + coveredDate[1];
    str += ' 农历：' + coveredDate[0];
    APP.setDateText(str);
  }

  // weather
  function setWeather() {
    var weather = window.Cookies.get('weather');
    if (weather) {
      console.log("cache = " + weather);
      APP.setWeatherText(weather);
      return;
    } else {
      APP.getCity(function(city) {
        APP.getWeather(city, function(weather) {
          if (weather[0]) {
            var obj = weather[0];
            console.log(obj);
            var str = city + ' | ';
            str += '白天：' + obj.s1 + ' ';
            str += '夜间：' + obj.s2 + ' | ';
            str += obj.t1 + '℃~' + obj.t2 + '℃';
            console.log(str);

            var exp = new Date(new Date().getTime() + 120 * 60 * 1000);  // 120 minutes
            window.Cookies.set('weather', str, { expires: exp });
            APP.setWeatherText(str);
          }
        });
        // getCity end
      });
      // else end
    }
  }
  
  setDate();
  setWeather();
  APP.setBackground('https://static.hinpc.com/images/2017/BingWallpaper-2017-04-19.jpg');
  APP.initBaiduSuggestion();
  APP.initForm();
  APP.setFocus();
});