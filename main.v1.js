/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));


/**
 * main function
 * 
 */
$(document).ready(function() {
  var engines = {
    baidu: '百度',
    google: '谷歌',
    bing: '必应'
  };

  var searchLink = {
    baidu: 'https://www.baidu.com/s?wd=',
    google: 'https://www.google.com/search?q=',
    bing: 'https://cn.bing.com/search?q='
    // case '1':url="https://www.google.com.hk/search?q=";break;
    // case '3':url="http://www.yahoo.com.cn/search?p=";break;
    // case '4':url="http://www.sogou.com/web?ie=utf8&query=";break;
    // case '5':url="http://www.so.com/s?ie=utf-8&src=360sou_home&q=";break;
  };

  var focusInputField = function() {
    $('#word').focus();
  };

  var initBaidu = function() {
    BaiduSuggestion.bind('word', {
      "XOffset": 0, //提示框位置横向偏移量,单位px 
      "YOffset": 0, //提示框位置纵向偏移量,单位px 
      "width": 350, //提示框宽度，单位px 
      "fontColor": "#00838f", //提示框文字颜色 
      "fontColorHI": "#fff",	//提示框高亮选择时文字颜色 
      "fontSize": "16px",	//文字大小 
      "fontFamily": "宋体",	//文字字体 
      "borderColor": "#ccc", //提示框的边框颜色 
      "bgcolorHI": "#00838f",	//提示框高亮选择的颜色 
      "sugSubmit": false	//选中提示框中词条时是否提交表单 
    }, function(txt) {  // 选择后的回调
      $('#searchForm').submit();
    });

    focusInputField();
  };

  var getEngine = function() {
    var type = $('#engine').data('type');
    return type;
  };

  var setEngine = function(type) {
    $('#engine').data('type', type);
    $('#engineName').text(engines[type]);
    Cookies.set('searchEngine', type, { expires: 365 });
  };

  var setInitSearchEngine = function() {
    var engine = Cookies.get('searchEngine');
    if (engine) {
      setEngine(engine);
    } else {
      setEngine('baidu');
    }
  };

  var initGoSearch = function() {
    window.goSearch = function() {
      var url = '';
      var type = getEngine();
      var val = $('#word').val();

      $('#word').val('');

      window.open(searchLink[type] + val);

      $('#word').blur(); // 防止form再次提交

      setTimeout(function() {
        focusInputField();
      }, 1000);

      return false;  // 阻止原页面刷新
    };

    $('#engine').click(function() {
      $('#engine ul').toggleClass('active');
    });

    $('#engine ul li').click(function() {
      var val = $(this).text();
      var type = $(this).data('type');

      setEngine(type);
      focusInputField();
    });
  };

	var initSmoothScroll = function() {
		smoothScroll.init({
			after: function(anchor, toggle) {
				$('.j-scroll').removeClass('active');
				$(toggle).addClass('active');
			}
		});
	};

	var initTodayInfo = function() {
		var text = '';
		var date = new Date();
		var month = date.getMonth() + 1;
		var dateDay = date.getDate();
		var day = date.getDay();
		var weeks = {
			'1': '一',
			'2': '二',
			'3': '三',
			'4': '四',
			'5': '五',
			'6': '六',
			'7': '天'
		};

		text += month + '月' + dateDay + '日' + ' 星期' + weeks[day];

		var mapKey = 'LY5BZ-FMILF-5MHJZ-JOKXA-2C3XO-KTB3Y';
		var caiyunKey = 'Qpqfaya5hBGmIlGb';
		$.ajax({
			url: 'http://apis.map.qq.com/ws/location/v1/ip?output=jsonp&key=' + mapKey,
			dataType: 'jsonp'
		}).done(function(res) {
			var status = parseInt(res.status);
			if (status === 0) {
				var city = res.result.ad_info.city ? res.result.ad_info.city : res.result.ad_info.province;
				var lnglat = res.result.location.lng + ',' + res.result.location.lat;
				text += ' ' + city;

				$.ajax({
					url: 'https://api.caiyunapp.com/v2/'+ caiyunKey +'/'+ lnglat +'/forecast.jsonp',
					dataType: 'jsonp'
				}).done(function(res2) {
					if (res2.status === 'ok') {
						var temperature = res2.result.hourly.temperature[0].value + '℃';
						text += ' ' + temperature;
						text += ' ' + res2.result.hourly.description;
						text += ' ' + '（天气数据来自: 彩云天气）'
						$('.today-info').text(text);
					}
				});
			}
		});

		$('.today-info').text(text);
	};

	setInitSearchEngine();
	initTodayInfo();
  initBaidu();
  initGoSearch();
	initSmoothScroll();
});
