/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(13);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(14);

var _search = __webpack_require__(16);

var _search2 = _interopRequireDefault(_search);

var _myajax = __webpack_require__(7);

var _myajax2 = _interopRequireDefault(_myajax);

var _car = __webpack_require__(3);

var _car2 = _interopRequireDefault(_car);

var _fl = __webpack_require__(5);

var _fl2 = _interopRequireDefault(_fl);

var _mine = __webpack_require__(6);

var _mine2 = _interopRequireDefault(_mine);

var _shouye = __webpack_require__(2);

var _shouye2 = _interopRequireDefault(_shouye);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadHeader: function loadHeader() {
		$('#header').load('view/shouye.html #shouyeHeader', function () {
			//点击进入搜索框
			$('.box').on('tap', function () {
				_search2.default.loadHeader();
				$('');
				_search2.default.loadContent();
				$('#footer').css('display', 'none');
			});
			//点击购物车
			$('#shouyeHeader .rt').on('tap', function () {
				_car2.default.loadHeader();
				_car2.default.loadContent();
				$('#footer').css('display', 'none');
			});
			//搜索框内容的请求
			var obj = {
				type: "get",
				url: "http://list.mogujie.com/module/mget?code=sketch%2ChotWord&callback=?"
			};
			_myajax2.default.myajax(obj, function (data) {
				$('.box .find').html(data.data.sketch.data.query);
			});
		});
	},
	loadContent: function loadContent() {
		$('#content').load('view/shouye.html #shouyeContent', function () {
			//轮播图及其功能
			var obj = {
				type: "get",
				url: "http://mce.mogucdn.com/jsonp/multiget/3?pids=51822%2C51827%2C41119%2C51833%2C51836%2C4604&callback=?"
			};
			_myajax2.default.myajax(obj, function (data) {
				//		   		console.log(data.data)
				//轮播图
				var obja = data.data[51822].list;
				//		   		console.log(obja)
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = obja[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var item = _step.value;

						$('#banner-swiper').append('<div class="swiper-slide banner-slide"><a href="' + item.link + '"><img src="' + item.image_800 + '" alt="" /></a></div>');
					}
					//实例化一个轮播图
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				var swiper = new Swiper('#banner', {
					pagination: '.swiper-pagination',
					autoplayDisableOnInteraction: false,
					autoplay: 2000,
					loop: true
				});

				//轮播图下面
				var objb = data.data[51827].list;
				//			    console.log(objb)
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = objb[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var item = _step2.value;

						$('.berbox').append('<a href="' + item.link + '" class="a">' + '<p class="top">' + item.title + '</p>' + '<p class="ctn">' + item.description + '</p>' + '<img src="' + item.image + '" alt="" />' + '</a>');
					}

					//抢购
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				var objc = data.data[41119].list[0];
				//			    console.log(objc.time)
				//			    console.log(objc)
				setInterval(function () {
					var time = Number(objc.time--);
					var h = parseInt(time / 3600);
					if (h >= 10) {
						h = h;
					} else {
						h = '0' + h;
					}
					var min = parseInt(time / 60 - parseInt(time / 3600) * 60);
					if (min >= 10) {
						min = min;
					} else {
						min = '0' + min;
					}
					var s = parseInt(time - parseInt(time / 60) * 60);
					if (s >= 10) {
						s = s;
					} else {
						s = '0' + s;
					}
					$('.lt').html('<p class="wd">' + objc.title + '.' + objc.viceTitle + '</p>' + '<span>' + h + '</span>&nbsp:' + '<span>' + min + '</span>&nbsp:' + '<span>' + s + '</span>');
				}, 1000);
				$('.qg .top').append('<div class="rt">' + '<a href="' + objc.moreLink + '">' + objc.moreTitle + '<b class="iconfont">&#xe63a;</b>' + '</a>' + '</div>');

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = objc.list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var item = _step3.value;

						$('#btm-wrapper').append('<div class="swiper-slide btm-swiper swiper-slide-active">' + '<a href="' + item.listUrl + '">' + '<img src="' + item.img + '" alt="" />' + '<p>' + item.title + '</p>' + '<p>￥' + item.salePrice + '<span>' + item.price + '</span> ' + '</p>' + '</a>' + '</div>');
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				var swiper1 = new Swiper('.btm .btm-container', {
					slidesPerView: 3.4,
					spaceBetween: 10,
					freeMode: true
				});
				//促销直达
				var objd = data.data[51833].list;
				//			    console.log(objd)
				$('.zd').append('<div class="ct">' + '<div class="zlt"><a href="' + objd[0].link + '">' + '<p>' + objd[0].title + '</p>' + '<p>' + objd[0].viceTitle + '</p>' + '<img src="' + objd[0].image + '" alt="" />' + '</a></div>' + '<div class="zrt">' + '<a href="' + objd[1].link + '">' + '<p>' + objd[1].title + '</p>' + '<p>' + objd[1].viceTitle + '</p>' + '<img src="' + objd[1].image + '" alt="" />' + '</a>' + '<a href="' + objd[2].link + '">' + '<p>' + objd[2].title + '</p>' + '<p>' + objd[2].viceTitle + '</p>' + '<img src="' + objd[2].image + '" alt="" />' + '</a>' + '</div>' + '</div>' + '<div class="bm">' + '<div><a href="' + objd[3].link + '">' + '<p>' + objd[3].title + '</p>' + '<p>' + objd[3].viceTitle + '</p>' + '<img src="' + objd[3].image + '" alt="" />' + '</a></div>' + '<div><a href="' + objd[4].link + '">' + '<p>' + objd[4].title + '</p>' + '<p>' + objd[4].viceTitle + '</p>' + '<img src="' + objd[4].image + '" alt="" />' + '</a></div>' + '<div><a href="' + objd[5].link + '">' + '<p>' + objd[5].title + '</p>' + '<p>' + objd[5].viceTitle + '</p>' + '<img src="' + objd[5].image + '" alt="" />' + '</a></div>' + '</div>');

				//hot-market
				var obje = data.data[51836].list;
				//			    	console.log(obje)
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = obje[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var item = _step4.value;

						$('.hmbm').append('<div><a href="' + item.link + '"><img src="' + item.image + '" alt="" /><span>' + item.title + '</span></a></div>');
					}
				} catch (err) {
					_didIteratorError4 = true;
					_iteratorError4 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion4 && _iterator4.return) {
							_iterator4.return();
						}
					} finally {
						if (_didIteratorError4) {
							throw _iteratorError4;
						}
					}
				}
			});
		});

		//猜你喜欢
		var objx = {
			type: "get",
			url: "https://list.mogujie.com/search?cKey=h5-shopping&fcid=&pid=9750&searchTag=&sort=pop&page=1&_version=61&_=1501118982433&callback=?"
		};
		_myajax2.default.myajax(objx, function (data) {
			var obj = data.result.wall.docs;
			//				console.log(obj);
			for (var item in obj) {
				$('.cxctn').append('<div class="cxbox">' + '<a href="' + obj[item].clientUrl + '">' + '<img src="' + obj[item].img + '" alt="" class="imgb"/>' +
				//							'<img src="'+obj[item].lefttop_taglist[0].img+'" class="imgs">'+
				'<div class="ds"></div>' + '<div class="dp">' + '<span class="sl">￥' + obj[item].price + '</span>' + '<span class="sr iconfont">' + obj[item].cfav + '&#xe684;</span>' + '</div>' + '</a>' + '</div>');
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = obj[item].props[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var items = _step5.value;

						$('.ds').eq(item).append('<span>' + items + '</span>');
					}
				} catch (err) {
					_didIteratorError5 = true;
					_iteratorError5 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion5 && _iterator5.return) {
							_iterator5.return();
						}
					} finally {
						if (_didIteratorError5) {
							throw _iteratorError5;
						}
					}
				}
			}
		});
	}
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(19);

var _shouye = __webpack_require__(2);

var _shouye2 = _interopRequireDefault(_shouye);

var _footer = __webpack_require__(4);

var _footer2 = _interopRequireDefault(_footer);

var _fl = __webpack_require__(5);

var _fl2 = _interopRequireDefault(_fl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    loadHeader: function loadHeader(fl) {
        $('#header').load('view/car.html #carHeader', function () {
            $('#carHeader .left').on('tap', function () {
                if (fl == 'fl') {
                    _fl2.default.loadHeader();
                    _fl2.default.loadContent();
                    _footer2.default.loadFooter(1);
                    $('#footer').css('display', 'block');
                } else {
                    _shouye2.default.loadHeader();
                    _shouye2.default.loadContent();
                    _footer2.default.loadFooter(0);
                    $('#footer').css('display', 'block');
                }
            });
        });
    },
    loadContent: function loadContent() {
        $('#content').load('view/car.html #carContent', function () {
            $('#carContent .btn').on('tap', function () {
                _shouye2.default.loadHeader();
                _shouye2.default.loadContent();
                _footer2.default.loadFooter(0);
                $('#footer').css('display', 'block');
            });
        });
    }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(8);

var _car = __webpack_require__(3);

var _car2 = _interopRequireDefault(_car);

var _fl = __webpack_require__(5);

var _fl2 = _interopRequireDefault(_fl);

var _mine = __webpack_require__(6);

var _mine2 = _interopRequireDefault(_mine);

var _shouye = __webpack_require__(2);

var _shouye2 = _interopRequireDefault(_shouye);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadFooter: function loadFooter(indexx) {

		$('#footer').load('view/footer.html #Footer', function () {
			$('.lists li').eq(indexx).addClass('active').siblings().removeClass('active');
			$('.lists li').on('tap', function () {
				var index = $(this).index();
				$(this).addClass('active').siblings().removeClass('active');
				switch (index) {
					case 0:
						_shouye2.default.loadHeader();
						_shouye2.default.loadContent();
						break;
					case 1:
						_fl2.default.loadHeader();
						_fl2.default.loadContent();
						break;
					case 2:
						_car2.default.loadHeader();
						_car2.default.loadContent();
						$('#footer').css('display', 'none');
						break;
					case 3:
						_mine2.default.loadHeader();
						_mine2.default.loadContent();
						$('#footer').css('display', 'none');
					default:
						break;
				}
			});
		});
	}
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(22);

var _car = __webpack_require__(3);

var _car2 = _interopRequireDefault(_car);

var _myajax = __webpack_require__(7);

var _myajax2 = _interopRequireDefault(_myajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    loadHeader: function loadHeader() {
        $('#header').load('view/fl.html #flHeader', function () {
            $('#flHeader .rt').on('tap', function () {
                _car2.default.loadHeader('fl');
                _car2.default.loadContent();
                $('#footer').css('display', 'none');
            });
        });
    },
    loadContent: function loadContent() {
        $('#content').load('view/fl.html #flContent', function () {
            var obj = {
                url: "http://mce.mogucdn.com/jsonp/multiget/3?pids=41789%2C4604&callback=?",
                type: "get"
                //ajax请求左边数据
            };_myajax2.default.myajax(obj, function (data) {
                var add = data.data[41789].list;
                console.log(add);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = add[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;

                        $('#flContent .left').append('<div idt=' + item.maitKey + '  idb=' + item.miniWallkey + '>' + '<p>' + item.title + '</p>' + '</div>');
                    }

                    //点击右边选项后会从上面的ajax中获取数据用于下面
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                $('#flContent .left div').on('tap', function () {
                    //点击开始后先清空原来的数据
                    $('.right .top').html('');
                    var index = $(this).index();
                    $(this).addClass("dl").siblings().removeClass("dl");
                    //点击后调出右边上面数据
                    var idt = $(this).attr('idt');
                    console.log(idt);
                    var obja = { url: "http://mce.mogujie.com/jsonp/makeup/3?pid=" + idt + "&_=1501216757071&callback=?",
                        type: "get"
                    };
                    _myajax2.default.myajax(obja, function (data) {
                        var oj = data.data.categoryNavigation.list;
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = oj[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var item = _step2.value;

                                $('.right .top').append('<a href="' + item.link + '">' + '<img src="' + item.image + '" alt="" />' + '<span>' + item.title + '</span>' + '</a>');
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    });
                    //点击后调出右边上面数据
                    var idb = $(this).attr('idb');
                    console.log(idb);
                    var objb = { url: "https://list.mogujie.com/search?cKey=h5-cube&fcid=" + idb + "&page=1&_version=1&pid=&q=&_=1501229961360&callback=?",
                        type: "get"
                        //点击开始后先清空原来的数据
                    };$('.right .cent').html('');
                    $('.right .btm').html('');
                    _myajax2.default.myajax(objb, function (data) {
                        console.log(data.result.wall.docs);
                        //生成排序列表
                        var lists = data.result.sortFilter;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = lists[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var item = _step3.value;

                                $('.right .cent').append('<a href="javascript:;"><span>' + item.title + '</span></a>');
                            }
                            //生成内容区
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }

                        var words = data.result.wall.docs;
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = words[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var item = _step4.value;

                                if (item.title !== undefined) {
                                    $('.right .btm').append('<a href="' + item.link + '">' + '<img src="' + item.img + '" alt="" />' + '<p class="buy">已售' + item.sale + '</p>' + '<p class="msg">' + item.title + '</p>' + '<div>' + '<span>￥' + item.price + '</span>' + '<span>' + item.cfav + '<b class="iconfont">&#xe684;</b></span>' + '</div>' + '</a>');
                                }
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    });
                });
            });

            //刷新出现右上面的图案
            var obja = {
                url: "http://mce.mogujie.com/jsonp/makeup/3?pid=41888&_=1501216757071&callback=?",
                type: "get"
            };
            _myajax2.default.myajax(obja, function (data) {
                var oj = data.data.categoryNavigation.list;
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = oj[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var item = _step5.value;

                        $('.right .top').append('<a href="' + item.link + '">' + '<img src="' + item.image + '" alt="" />' + '<span>' + item.title + '</span>' + '</a>');
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            });
            //刷新出现下面的图案
            var objb = { url: "https://list.mogujie.com/search?cKey=h5-cube&fcid=10062603&page=1&_version=1&pid=&q=&_=1501229961360&callback=?",
                type: "get"
            };
            _myajax2.default.myajax(objb, function (data) {
                console.log(data.result.wall.docs);
                //生成排序列表
                var lists = data.result.sortFilter;
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = lists[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var item = _step6.value;

                        $('.right .cent').append('<a href="javascript:;"><span>' + item.title + '</span></a>');
                    }
                    //生成内容区
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                var words = data.result.wall.docs;
                console.log(words);
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = words[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var item = _step7.value;

                        if (item.title !== undefined) {
                            $('.right .btm').append('<a href="' + item.link + '">' + '<img src="' + item.img + '" alt="" />' + '<p class="buy">已售' + item.sale + '</p>' + '<p class="msg">' + item.title + '</p>' + '<div>' + '<span>￥' + item.price + '</span>' + '<span>' + item.cfav + '<b class="iconfont">&#xe684;</b></span>' + '</div>' + '</a>');
                        }
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }
            });
        });
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
				value: true
});

__webpack_require__(24);

var _shouye = __webpack_require__(2);

var _shouye2 = _interopRequireDefault(_shouye);

var _rejust = __webpack_require__(26);

var _rejust2 = _interopRequireDefault(_rejust);

var _footer = __webpack_require__(4);

var _footer2 = _interopRequireDefault(_footer);

var _toldbox = __webpack_require__(9);

var _toldbox2 = _interopRequireDefault(_toldbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
				loadHeader: function loadHeader() {
								$('#header').load('view/mine.html #mineHeader', function () {
												$('#mineHeader .left').on('tap', function () {
																_shouye2.default.loadHeader();
																_shouye2.default.loadContent();
																_footer2.default.loadFooter(0);
																$('#footer').css('display', 'block');
												});
								});
				},
				loadContent: function loadContent() {
								$('#content').load('view/mine.html #mineContent', function () {

												$('.minebox .dl').on('tap', function () {
																var username = $('.minebox .int1').val();
																var pwd = $('.minebox .int2').val();
																if (username == '' || pwd == '') {
																				_toldbox2.default.dl('请输入完整信息', 3200);
																} else {
																				if (String(localStorage.getItem('username')) != username) {
																								/*var username=$('.minebox .int1').val();
                        var pwd=$('.minebox .int2').val(); 
                        localStorage.setItem('username',username)
                        localStorage.setItem('pwd',pwd)
                        $('.minebox .int1').val('');
                        $('.minebox .int2').val(''); 
                        toldbox.tb('注册成功',3200)*/
																								_toldbox2.default.dl('用户名输入错误', 3200);
																								$('.minebox .int1').val('');
																								$('.minebox .int2').val('');
																				} else {
																								if (localStorage.getItem('pwd') != pwd) {
																												/*toldbox.tb('用户名重名',3200)
                            $('.minebox .int1').val('');
                            $('.minebox .int2').val(''); */
																												_toldbox2.default.dl('密码有误', 3200);
																												$('.minebox .int2').val('');
																								} else {
																												_toldbox2.default.dl('登录成功', 1200);
																												$('.minebox .int1').val('');
																												$('.minebox .int2').val('');
																												setTimeout(function () {
																																_shouye2.default.loadHeader();
																																_shouye2.default.loadContent();
																																_footer2.default.loadFooter(0);
																																$('#footer').css('display', 'block');
																												}, 1000);
																								}
																				}
																}
												});
												$('.dlp .zczh').on('tap', function () {
																_rejust2.default.loadHeader();
																_rejust2.default.loadContent();
																$('#footer').css('display', 'none');
												});
								});
				}
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	myajax: function myajax(obj, callback) {
		$.ajax({
			type: "get",
			url: obj.url,
			data: obj.data,
			dataType: obj.dataType,
			success: function success(data) {
				callback(data);
			}
		});
	}
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./footer.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./footer.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	dl: function dl(word, time) {
		setTimeout(function () {
			$('#mineContent .block').html(word);
			$('#mineContent .block').css('display', 'block');
			setTimeout(function () {
				$('#mineContent .block').css('display', 'none');
			}, time);
		}, 200);
	},
	zc: function zc(word, time) {
		setTimeout(function () {
			$('#rejustContent .block').html(word);
			$('#rejustContent .block').css('display', 'block');
			setTimeout(function () {
				$('#rejustContent .block').css('display', 'none');
			}, time);
		}, 200);
	}
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(11);

var _shouye = __webpack_require__(2);

var _shouye2 = _interopRequireDefault(_shouye);

var _footer = __webpack_require__(4);

var _footer2 = _interopRequireDefault(_footer);

__webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_shouye2.default.loadHeader();
_shouye2.default.loadContent();

_footer2.default.loadFooter(0);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./main.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./main.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 338840 */\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot\");\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont;\n  font-weight: normal; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n#container {\n  width: 100%;\n  max-width: 640px;\n  margin: 0 auto;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container .header {\n    height: 38px;\n    width: 100%;\n    font-size: 18px;\n    font-weight: bold; }\n    #container .header .commonHeader {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      text-align: center; }\n      #container .header .commonHeader .back {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .title {\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .moreInfo {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    overflow: auto;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container .footer {\n    height: 40px;\n    width: 100%;\n    background-color: #fff;\n    border-top: 1px solid #ccc; }\n    #container .footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container .footer ul li {\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container .footer ul li.active {\n          color: #f66; }\n", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./shouye.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./shouye.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 338840 */\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot\");\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont;\n  font-weight: normal; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n#container {\n  width: 100%;\n  max-width: 640px;\n  margin: 0 auto;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container .header {\n    height: 38px;\n    width: 100%;\n    font-size: 18px;\n    font-weight: bold; }\n    #container .header .commonHeader {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      text-align: center; }\n      #container .header .commonHeader .back {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .title {\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .moreInfo {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    overflow: auto;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container .footer {\n    height: 40px;\n    width: 100%;\n    background-color: #fff;\n    border-top: 1px solid #ccc; }\n    #container .footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container .footer ul li {\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container .footer ul li.active {\n          color: #f66; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #shouyeHeader {\n    width: 100%;\n    height: 37px;\n    border-bottom: 1px solid #EEEEEE;\n    position: relative;\n    line-height: 37px;\n    text-align: center;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    flex-direction: row;\n    color: #ccc; }\n    #container #shouyeHeader .left {\n      width: 40px;\n      height: 100%; }\n    #container #shouyeHeader .rt {\n      width: 40px;\n      height: 100%; }\n    #container #shouyeHeader .box {\n      flex: 1;\n      width: 226px;\n      height: 26px;\n      margin-top: 6px;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      line-height: 26px;\n      background: #eee;\n      border-radius: 5px;\n      font-size: 12px;\n      font-weight: normal; }\n      #container #shouyeHeader .box .iconfont {\n        margin-left: 5px;\n        margin-right: 5px; }\n  #container #shouyeContent {\n    background: #F6F6F6;\n    flex: 1;\n    overflow-x: hidden; }\n    #container #shouyeContent #banner {\n      width: 100%;\n      height: 130px; }\n      #container #shouyeContent #banner .swiper-pagination {\n        text-align: left; }\n    #container #shouyeContent .banner-slide {\n      text-align: center;\n      font-size: 18px;\n      background: #fff;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: -webkit-flex;\n      display: flex;\n      -webkit-box-pack: center;\n      -ms-flex-pack: center;\n      -webkit-justify-content: center;\n      justify-content: center;\n      -webkit-box-align: center;\n      -ms-flex-align: center;\n      -webkit-align-items: center;\n      align-items: center; }\n      #container #shouyeContent .banner-slide img {\n        width: 100%;\n        height: 100%; }\n    #container #shouyeContent .berbm {\n      width: 100%;\n      height: 95px;\n      padding-top: 10px;\n      margin-bottom: 10px;\n      background: #fff; }\n      #container #shouyeContent .berbm .berbox {\n        width: 100%;\n        height: 85px;\n        display: -webkit-box;\n        display: flex; }\n        #container #shouyeContent .berbm .berbox .a {\n          text-align: center;\n          display: inline-block;\n          flex: 1; }\n          #container #shouyeContent .berbm .berbox .a:nth-of-type(2) {\n            border-left: 1px solid #ccc;\n            border-right: 1px solid #ccc; }\n          #container #shouyeContent .berbm .berbox .a .top {\n            color: #ff6801;\n            font-size: 12px; }\n          #container #shouyeContent .berbm .berbox .a .ctn {\n            margin-top: 3px;\n            font-size: 13px;\n            width: 85px;\n            white-space: nowrap;\n            overflow: hidden;\n            text-overflow: ellipsis;\n            margin: 0 auto;\n            color: #555; }\n          #container #shouyeContent .berbm .berbox .a img {\n            width: 43px;\n            height: 43px;\n            margin-top: 10px; }\n    #container #shouyeContent .qg {\n      background: white;\n      list-style: none;\n      left: 0;\n      overflow: hidden;\n      margin-bottom: 10px; }\n      #container #shouyeContent .qg .top {\n        width: 96%;\n        height: 20px;\n        padding: 2%;\n        font-size: 13px;\n        position: relative; }\n        #container #shouyeContent .qg .top .lt {\n          display: inline-block;\n          height: 100%; }\n          #container #shouyeContent .qg .top .lt .wd {\n            display: inline-block;\n            height: 100%; }\n          #container #shouyeContent .qg .top .lt span {\n            display: inline-block;\n            width: 16px;\n            height: 16px;\n            padding: 1px;\n            background: black;\n            color: white;\n            text-align: center;\n            border-radius: 3px; }\n        #container #shouyeContent .qg .top .rt {\n          display: inline-block;\n          position: absolute;\n          right: 10px;\n          font-size: 12px; }\n          #container #shouyeContent .qg .top .rt a {\n            color: #B2B2B2; }\n      #container #shouyeContent .qg .btm {\n        clear: both;\n        overflow: hidden;\n        width: 100%; }\n        #container #shouyeContent .qg .btm .btm-swiper {\n          display: flex;\n          flex-direction: column;\n          text-align: center;\n          background: white; }\n          #container #shouyeContent .qg .btm .btm-swiper a {\n            display: inline-block;\n            width: 100%;\n            height: 130px; }\n          #container #shouyeContent .qg .btm .btm-swiper p {\n            text-align: center;\n            height: 18px;\n            line-height: 18px; }\n            #container #shouyeContent .qg .btm .btm-swiper p:nth-of-type(1) {\n              font-size: 13px;\n              color: #888;\n              width: 76px;\n              margin: 0 auto;\n              overflow: hidden;\n              text-overflow: ellipsis;\n              white-space: nowrap; }\n            #container #shouyeContent .qg .btm .btm-swiper p:nth-of-type(2) {\n              font-size: 12px;\n              color: #f66; }\n              #container #shouyeContent .qg .btm .btm-swiper p:nth-of-type(2) span {\n                text-decoration: line-through;\n                color: #999; }\n        #container #shouyeContent .qg .btm img {\n          display: inline-block;\n          width: 64px;\n          height: 64px;\n          margin-top: 5px; }\n    #container #shouyeContent .zd {\n      background: white;\n      width: 100%;\n      margin-bottom: 10px;\n      font-size: 12px; }\n      #container #shouyeContent .zd p:nth-of-type(1) {\n        color: black; }\n      #container #shouyeContent .zd p:nth-of-type(2) {\n        color: red; }\n      #container #shouyeContent .zd .tp {\n        width: 100%;\n        height: 34px;\n        line-height: 34px;\n        text-align: left;\n        font-size: 12px;\n        color: black;\n        box-sizing: border-box;\n        padding-left: 12px;\n        border-bottom: 1px solid #ccc; }\n      #container #shouyeContent .zd .ct {\n        width: 100%;\n        height: 136px;\n        display: flex;\n        border-bottom: 1px solid #ccc; }\n        #container #shouyeContent .zd .ct div {\n          display: flex;\n          flex: 1; }\n        #container #shouyeContent .zd .ct .zlt {\n          flex-direction: column;\n          justify-content: flex-end;\n          align-items: center; }\n          #container #shouyeContent .zd .ct .zlt p {\n            text-align: center; }\n          #container #shouyeContent .zd .ct .zlt img {\n            width: 85px;\n            height: 85px; }\n        #container #shouyeContent .zd .ct .zrt {\n          display: flex;\n          flex-direction: column;\n          border-left: 1px solid #ccc; }\n          #container #shouyeContent .zd .ct .zrt a {\n            line-height: 20px;\n            flex: 1;\n            position: relative; }\n            #container #shouyeContent .zd .ct .zrt a:nth-of-type(1) {\n              border-bottom: 1px solid #ccc; }\n            #container #shouyeContent .zd .ct .zrt a img {\n              height: 67px;\n              width: 68px;\n              position: absolute;\n              right: 0;\n              top: 0; }\n            #container #shouyeContent .zd .ct .zrt a p {\n              width: 90%;\n              margin-left: 20px;\n              font-size: 12px; }\n      #container #shouyeContent .zd .bm {\n        width: 100%;\n        height: 110px;\n        display: flex; }\n        #container #shouyeContent .zd .bm div {\n          flex: 1; }\n          #container #shouyeContent .zd .bm div a {\n            width: 100%;\n            height: 100%;\n            display: block;\n            display: flex;\n            flex-direction: column;\n            justify-content: flex-end;\n            align-items: center; }\n            #container #shouyeContent .zd .bm div a img {\n              width: 68px;\n              height: 67px; }\n    #container #shouyeContent .hot-market {\n      width: 100%;\n      background: white;\n      margin-bottom: 10px; }\n      #container #shouyeContent .hot-market .hmtp {\n        width: 100%;\n        height: 20px;\n        line-height: 20px;\n        text-align: center;\n        font-size: 13px;\n        padding-top: 10px; }\n        #container #shouyeContent .hot-market .hmtp span {\n          color: #ccc; }\n      #container #shouyeContent .hot-market .hmbm {\n        width: 100%;\n        height: 327px;\n        display: flex;\n        flex-flow: wrap; }\n        #container #shouyeContent .hot-market .hmbm div {\n          text-align: center;\n          width: 80px;\n          height: 71px; }\n          #container #shouyeContent .hot-market .hmbm div a {\n            display: block;\n            width: 80px;\n            line-height: 71px; }\n            #container #shouyeContent .hot-market .hmbm div a img {\n              display: block;\n              width: 51px;\n              height: 51px;\n              margin: 0 auto; }\n            #container #shouyeContent .hot-market .hmbm div a span {\n              display: block;\n              width: 68px;\n              height: 20px;\n              line-height: 20px;\n              text-align: center;\n              font-size: 13px;\n              margin: 0 auto;\n              font-size: 12px;\n              color: black; }\n    #container #shouyeContent .cx {\n      width: 100%; }\n      #container #shouyeContent .cx .cxh {\n        width: 100%;\n        height: 16px;\n        padding: 13px 0 10px;\n        background: #F6F6F6;\n        font-size: 13px;\n        text-align: center; }\n      #container #shouyeContent .cx .cxctn {\n        width: 100%;\n        display: flex;\n        flex-flow: wrap;\n        background: white; }\n        #container #shouyeContent .cx .cxctn .cxbox {\n          background: white;\n          height: 265px;\n          width: 47%;\n          margin-left: 2%;\n          margin-top: 5px; }\n          #container #shouyeContent .cx .cxctn .cxbox a {\n            width: 100%;\n            height: 100%;\n            display: block;\n            text-align: center;\n            position: relative; }\n            #container #shouyeContent .cx .cxctn .cxbox a .imgb {\n              width: 150px;\n              height: 200px; }\n            #container #shouyeContent .cx .cxctn .cxbox a .imgs {\n              position: absolute;\n              left: 3px;\n              top: 0;\n              width: 28px;\n              height: 28px; }\n            #container #shouyeContent .cx .cxctn .cxbox a .ds {\n              width: 138px;\n              height: 36px;\n              margin: 0 auto;\n              font-size: 12px;\n              display: flex;\n              flex-wrap: wrap;\n              color: #888;\n              overflow: hidden; }\n              #container #shouyeContent .cx .cxctn .cxbox a .ds span {\n                height: 16px;\n                background: #EFF3F6;\n                margin-left: 5px;\n                margin-top: 2px; }\n            #container #shouyeContent .cx .cxctn .cxbox a .dp {\n              width: 138px;\n              height: 20px;\n              margin: 0 auto;\n              clear: both; }\n              #container #shouyeContent .cx .cxctn .cxbox a .dp .sl {\n                float: left;\n                height: 20px;\n                font-size: 14px;\n                color: black;\n                font-weight: bold; }\n              #container #shouyeContent .cx .cxctn .cxbox a .dp .sr {\n                float: right;\n                height: 20px;\n                font-size: 12px;\n                color: #ccc; }\n", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(17);

var _shouye = __webpack_require__(2);

var _shouye2 = _interopRequireDefault(_shouye);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadHeader: function loadHeader() {
		$('#header').load('view/search.html #searchHeader', function () {
			//点击后返回首页
			$('.left').on('tap', function () {
				_shouye2.default.loadHeader();
				_shouye2.default.loadContent();
				$('#footer').css('display', 'block');
			});
			//请求搜索框数据
			$.ajax({
				type: "get",
				url: "http://list.mogujie.com/module/mget?code=sketch%2ChotWord&callback=?",
				success: function success(data) {
					$('.box').append('<input type="text" placeholder="' + data.data.sketch.data.query + '" class="find"/>');
				}
			});
		});
	},
	loadContent: function loadContent() {
		$('#content').load('view/search.html #searchContent', function () {
			//显示搜索记录
			if (String(localStorage.getItem('history')) == 'null') {
				$('.scont').append('<span class="sh">暂无历史搜索</span>');
			} else {
				$('.scont').append('<span class="sh hs">' + localStorage.getItem('history') + '</span>');
			}
			//点击后清空历史记录
			$('.srt').on('tap', function () {
				localStorage.clear();
			});
			//请求热搜数据
			$.ajax({
				type: 'get',
				url: "http://list.mogujie.com/module/mget?code=sketch%2ChotWord&callback=?",
				success: function success(res) {
					var obj = res.data.hotWord.data;
					console.log(obj);
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var item = _step.value;

							$('.hot .cont').append('<a href="' + item.link + '"style=color:' + item.color + '>' + item.frontword + '</a>');
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
				}
			});
		});
	}
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./search.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./search.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 338840 */\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot\");\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont;\n  font-weight: normal; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n#container {\n  width: 100%;\n  max-width: 640px;\n  margin: 0 auto;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container .header {\n    height: 38px;\n    width: 100%;\n    font-size: 18px;\n    font-weight: bold; }\n    #container .header .commonHeader {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      text-align: center; }\n      #container .header .commonHeader .back {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .title {\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .moreInfo {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    overflow: auto;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container .footer {\n    height: 40px;\n    width: 100%;\n    background-color: #fff;\n    border-top: 1px solid #ccc; }\n    #container .footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container .footer ul li {\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container .footer ul li.active {\n          color: #f66; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #searchHeader {\n    width: 100%;\n    height: 37px;\n    border-bottom: 1px solid #EEEEEE;\n    position: relative;\n    line-height: 37px;\n    text-align: center;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    flex-direction: row;\n    color: #ccc; }\n    #container #searchHeader .left {\n      width: 40px;\n      height: 100%; }\n    #container #searchHeader .rt {\n      width: 40px;\n      height: 100%;\n      font-size: 12px;\n      font-weight: normal;\n      color: #666; }\n    #container #searchHeader .box {\n      flex: 1;\n      width: 226px;\n      height: 20px;\n      margin-top: 8px;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      line-height: 20px;\n      border: 1px solid #ccc;\n      border-radius: 5px;\n      font-size: 12px;\n      font-weight: normal; }\n      #container #searchHeader .box .find {\n        width: 100%;\n        height: 19px;\n        display: block;\n        border: none;\n        outline: none;\n        box-sizing: border-box;\n        margin-left: 8px; }\n  #container #searchContent {\n    flex: 1; }\n    #container #searchContent .history {\n      width: 100%;\n      height: 80px;\n      border-bottom: 1px solid #F4F4F4; }\n      #container #searchContent .history .stop {\n        width: 100%;\n        height: 20px;\n        font-size: 12px;\n        margin-top: 10px;\n        color: #999;\n        position: relative; }\n        #container #searchContent .history .stop .slt {\n          margin-left: 8px;\n          margin-right: 3px; }\n        #container #searchContent .history .stop .srt {\n          position: absolute;\n          right: 10px;\n          font-size: 15px; }\n      #container #searchContent .history .scont {\n        width: 100%;\n        height: 60px; }\n        #container #searchContent .history .scont .sh {\n          height: 20px;\n          margin-left: 8px;\n          font-size: 13px;\n          color: #999; }\n        #container #searchContent .history .scont .hs {\n          margin-left: 8px;\n          font-size: 13px;\n          color: #333; }\n    #container #searchContent .hot {\n      width: 100%; }\n      #container #searchContent .hot .top {\n        width: 100%;\n        height: 20px;\n        font-size: 12px;\n        margin: 10px 0;\n        color: #999;\n        padding-left: 10px;\n        box-sizing: border-box; }\n      #container #searchContent .hot .cont {\n        width: 90%;\n        margin: 0 auto; }\n        #container #searchContent .hot .cont a {\n          height: 16px;\n          padding: 2px;\n          display: inline-block;\n          line-height: 16px;\n          text-align: center;\n          border: 1px solid #ccc;\n          margin: 5px 3px;\n          font-size: 13px;\n          color: #666;\n          border-radius: 5px; }\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./car.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./car.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 338840 */\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot\");\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont;\n  font-weight: normal; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n#container {\n  width: 100%;\n  max-width: 640px;\n  margin: 0 auto;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container .header {\n    height: 38px;\n    width: 100%;\n    font-size: 18px;\n    font-weight: bold; }\n    #container .header .commonHeader {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      text-align: center; }\n      #container .header .commonHeader .back {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .title {\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .moreInfo {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    overflow: auto;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container .footer {\n    height: 40px;\n    width: 100%;\n    background-color: #fff;\n    border-top: 1px solid #ccc; }\n    #container .footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container .footer ul li {\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container .footer ul li.active {\n          color: #f66; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #carHeader {\n    width: 100%;\n    height: 37px;\n    border-bottom: 1px solid #EEEEEE;\n    position: relative;\n    line-height: 37px;\n    text-align: center;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    flex-direction: row;\n    color: #5E5E5E;\n    background: #FAFAFA; }\n    #container #carHeader .left {\n      width: 40px;\n      height: 100%;\n      font-size: 12px; }\n    #container #carHeader .rt {\n      width: 60px;\n      height: 100%;\n      font-size: 12px;\n      font-weight: normal; }\n      #container #carHeader .rt b {\n        font-size: 15px;\n        color: #ccc; }\n    #container #carHeader .box {\n      flex: 1;\n      line-height: 37px;\n      border-radius: 5px;\n      text-align: center;\n      font-size: 15px;\n      font-weight: normal; }\n  #container #carContent {\n    flex: 1;\n    width: 100%;\n    height: 100%;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: vertical;\n    flex-direction: column;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: vertical;\n    flex-direction: column;\n    -webkit-box-pack: center;\n    justify-content: center;\n    -webkit-box-align: center;\n    align-items: center;\n    background: #F6F6F6; }\n    #container #carContent .carp {\n      width: 108px;\n      height: 108px;\n      background: #DDD5D7;\n      border-radius: 54px;\n      line-height: 108px;\n      text-align: center;\n      font-size: 60px;\n      color: white;\n      font-weight: normal; }\n    #container #carContent .carc {\n      font-size: 13px;\n      margin: 10px 0;\n      color: #666; }\n    #container #carContent .btn {\n      padding: 5px 20px;\n      background: #FF5777;\n      height: 20px;\n      line-height: 20px;\n      text-align: center;\n      color: white;\n      font-size: 14px;\n      border-radius: 5px; }\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 338840 */\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot\");\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont;\n  font-weight: normal; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n#container {\n  width: 100%;\n  max-width: 640px;\n  margin: 0 auto;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container .header {\n    height: 38px;\n    width: 100%;\n    font-size: 18px;\n    font-weight: bold; }\n    #container .header .commonHeader {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      text-align: center; }\n      #container .header .commonHeader .back {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .title {\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .moreInfo {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    overflow: auto;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container .footer {\n    height: 40px;\n    width: 100%;\n    background-color: #fff;\n    border-top: 1px solid #ccc; }\n    #container .footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container .footer ul li {\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container .footer ul li.active {\n          color: #f66; }\n\n#Footer {\n  width: 100%;\n  height: 40px; }\n  #Footer ul {\n    width: 100%;\n    height: 100%; }\n    #Footer ul li {\n      color: #9A9A9A;\n      font-size: 12px; }\n      #Footer ul li .iconfont {\n        font-size: 18px;\n        font-weight: normal; }\n      #Footer ul li.active {\n        color: #f66; }\n      #Footer ul li b {\n        margin-top: 3px; }\n", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./fl.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./fl.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 338840 */\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot\");\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont;\n  font-weight: normal; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n#container {\n  width: 100%;\n  max-width: 640px;\n  margin: 0 auto;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container .header {\n    height: 38px;\n    width: 100%;\n    font-size: 18px;\n    font-weight: bold; }\n    #container .header .commonHeader {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      text-align: center; }\n      #container .header .commonHeader .back {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .title {\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .moreInfo {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    overflow: auto;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container .footer {\n    height: 40px;\n    width: 100%;\n    background-color: #fff;\n    border-top: 1px solid #ccc; }\n    #container .footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container .footer ul li {\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container .footer ul li.active {\n          color: #f66; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #flHeader {\n    width: 100%;\n    height: 37px;\n    border-bottom: 1px solid #EEEEEE;\n    position: relative;\n    line-height: 37px;\n    text-align: center;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    flex-direction: row;\n    color: #ccc; }\n    #container #flHeader .left {\n      width: 40px;\n      height: 100%; }\n    #container #flHeader .rt {\n      width: 40px;\n      height: 100%;\n      font-size: 18px;\n      font-weight: normal; }\n    #container #flHeader .box {\n      flex: 1;\n      width: 226px;\n      height: 24px;\n      margin-top: 5px;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      line-height: 24px;\n      border-radius: 5px;\n      font-weight: normal;\n      color: #9E9E9E;\n      background: #eee;\n      overflow: hidden; }\n      #container #flHeader .box b {\n        font-weight: normal;\n        margin-left: 5px;\n        font-size: 12px; }\n      #container #flHeader .box .find {\n        background: #eee;\n        color: #ccc;\n        width: 100%;\n        height: 24px;\n        display: block;\n        border: none;\n        outline: none;\n        box-sizing: border-box;\n        margin-left: 8px;\n        font-size: 12px; }\n  #container #flContent {\n    flex: 1;\n    height: 100%;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    flex-direction: row; }\n    #container #flContent .left {\n      width: 22%;\n      height: 100%;\n      overflow-y: auto; }\n      #container #flContent .left div {\n        width: 100%;\n        height: 38px;\n        background: #F6F6F6;\n        display: flex;\n        flex-direction: column;\n        justify-content: center; }\n        #container #flContent .left div p {\n          height: 15px;\n          line-height: 15px;\n          text-align: center;\n          font-size: 12px; }\n        #container #flContent .left div:nth-of-type(1) {\n          background: white; }\n          #container #flContent .left div:nth-of-type(1) p {\n            box-sizing: border-box;\n            height: 15px;\n            line-height: 15px;\n            text-align: center;\n            border-left: 4px solid #FF5577;\n            font-size: 12px;\n            color: #FF5577; }\n    #container #flContent .left::-webkit-scrollbar {\n      width: 0px;\n      height: 1px; }\n    #container #flContent .right {\n      width: 78%;\n      height: 100%;\n      overflow-y: auto; }\n      #container #flContent .right .top {\n        width: 94%;\n        padding: 10px 3%;\n        display: flex;\n        flex-wrap: wrap;\n        border-bottom: 1px solid #ccc; }\n        #container #flContent .right .top a {\n          display: block;\n          width: 75px;\n          height: 81px;\n          margin: 8px 0;\n          text-align: center;\n          color: #666; }\n          #container #flContent .right .top a img {\n            width: 55px;\n            height: 55px; }\n          #container #flContent .right .top a span {\n            font-size: 13px;\n            display: block; }\n      #container #flContent .right .cent {\n        width: 100%;\n        height: 40px;\n        display: -webkit-box;\n        display: flex; }\n        #container #flContent .right .cent a {\n          text-decoration: none;\n          flex: 1;\n          height: 40px;\n          line-height: 40px;\n          text-align: center;\n          font-size: 12px;\n          color: #333; }\n          #container #flContent .right .cent a span {\n            display: block;\n            width: 100%;\n            height: 15px;\n            line-height: 15px;\n            margin-top: 12px; }\n      #container #flContent .right .btm {\n        margin-top: 1px solid #ccc;\n        display: flex;\n        flex-wrap: wrap;\n        width: 100%; }\n        #container #flContent .right .btm a {\n          width: 48%;\n          height: 187px;\n          margin-top: 5px;\n          margin-left: 1%;\n          display: flex;\n          flex-direction: column;\n          justify-content: center;\n          align-items: center;\n          color: #666;\n          position: relative;\n          font-size: 13px; }\n          #container #flContent .right .btm a img {\n            width: 114px;\n            height: 146px;\n            border: none; }\n          #container #flContent .right .btm a .buy {\n            position: absolute;\n            left: 3px;\n            top: 120px;\n            width: 60px;\n            height: 20px;\n            padding: 0 10px;\n            line-height: 20px;\n            text-align: center;\n            background: linear-gradient(to right, rgba(0, 0, 0, 0.7), transparent);\n            overflow: hidden;\n            text-overflow: ellipsis;\n            white-space: nowrap;\n            color: white; }\n          #container #flContent .right .btm a .msg {\n            width: 90%;\n            height: 20px;\n            overflow: hidden;\n            text-overflow: ellipsis;\n            white-space: nowrap;\n            text-align: center; }\n          #container #flContent .right .btm a div {\n            width: 90%;\n            height: 20px; }\n            #container #flContent .right .btm a div span {\n              display: inline-block;\n              height: 20px;\n              width: 40px; }\n              #container #flContent .right .btm a div span:nth-of-type(1) {\n                color: #f66; }\n              #container #flContent .right .btm a div span:nth-of-type(2) {\n                float: right; }\n    #container #flContent .right::-webkit-scrollbar {\n      width: 0px;\n      height: 1px; }\n", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./mine.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./mine.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 338840 */\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot\");\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont;\n  font-weight: normal; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n#container {\n  width: 100%;\n  max-width: 640px;\n  margin: 0 auto;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container .header {\n    height: 38px;\n    width: 100%;\n    font-size: 18px;\n    font-weight: bold; }\n    #container .header .commonHeader {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      text-align: center; }\n      #container .header .commonHeader .back {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .title {\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .moreInfo {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    overflow: auto;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container .footer {\n    height: 40px;\n    width: 100%;\n    background-color: #fff;\n    border-top: 1px solid #ccc; }\n    #container .footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container .footer ul li {\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container .footer ul li.active {\n          color: #f66; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #mineHeader {\n    width: 100%;\n    height: 37px;\n    border-bottom: 1px solid #EEEEEE;\n    position: relative;\n    line-height: 37px;\n    text-align: center;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    flex-direction: row;\n    color: #5E5E5E;\n    background: #FAFAFA; }\n    #container #mineHeader .left {\n      width: 40px;\n      height: 100%;\n      font-size: 12px; }\n    #container #mineHeader .rt {\n      width: 60px;\n      height: 100%;\n      font-size: 14px;\n      font-weight: normal; }\n    #container #mineHeader .box {\n      flex: 1;\n      line-height: 37px;\n      border-radius: 5px;\n      text-align: center;\n      font-size: 15px;\n      font-weight: bold; }\n  #container #mineContent {\n    flex: 1;\n    width: 100%;\n    height: 100%;\n    background: white;\n    overflow: hidden; }\n    #container #mineContent .minebox {\n      width: 100%;\n      height: 80%;\n      margin-top: 15%;\n      overflow: hidden;\n      text-align: center; }\n      #container #mineContent .minebox .zh {\n        height: 16px;\n        font-size: 12px;\n        color: #666;\n        margin-top: 12px; }\n      #container #mineContent .minebox .int1, #container #mineContent .minebox .int2 {\n        height: 30px;\n        width: 90%;\n        border: none;\n        border-bottom: 1px solid #ededed;\n        font-size: 20px;\n        color: black;\n        text-align: center;\n        margin-top: 15px;\n        outline: none;\n        placeholder: #ccc;\n        letter-spacing: 3px; }\n      #container #mineContent .minebox input::-webkit-input-placeholder {\n        color: #F3F1EE; }\n      #container #mineContent .minebox .dl {\n        width: 90%;\n        height: 40px;\n        margin: 0 auto;\n        background: #FF1877;\n        border-radius: 3px;\n        color: white;\n        font-size: 15px;\n        line-height: 40px;\n        text-align: center;\n        margin-top: 20px; }\n      #container #mineContent .minebox .dlp {\n        width: 90%;\n        margin: 0 auto;\n        text-align: center;\n        font-size: 12px;\n        margin-top: 10px; }\n        #container #mineContent .minebox .dlp a:nth-of-type(1) {\n          float: left;\n          color: #999; }\n        #container #mineContent .minebox .dlp a:nth-of-type(2) {\n          float: right;\n          color: #f66;\n          text-decoration: none; }\n      #container #mineContent .minebox .qq {\n        width: 90%;\n        height: 90px;\n        margin: 0 auto;\n        margin-top: 100px;\n        border-radius: 45px; }\n        #container #mineContent .minebox .qq a {\n          display: block;\n          width: 90px;\n          height: 90px;\n          margin: 0 auto;\n          background: url(\"https://s10.mogucdn.com/p1/150803/upload_ieztmnzwmztdsoddgizdambqgyyde_210x210.png\");\n          background-size: 100%; }\n    #container #mineContent .block {\n      width: 150px;\n      height: 30px;\n      font-size: 13px;\n      color: white;\n      text-align: center;\n      background: #666;\n      border-radius: 5px;\n      margin: 0 auto;\n      line-height: 30px;\n      display: none; }\n", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(27);

var _mine = __webpack_require__(6);

var _mine2 = _interopRequireDefault(_mine);

var _toldbox = __webpack_require__(9);

var _toldbox2 = _interopRequireDefault(_toldbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	loadHeader: function loadHeader() {
		$('#header').load('view/rejust.html #rejustHeader', function () {
			$('#rejustHeader .left').on('tap', function () {
				_mine2.default.loadHeader();
				_mine2.default.loadContent();
				$('#footer').css('display', 'none');
			});
		});
	},
	loadContent: function loadContent() {
		$('#content').load('view/rejust.html #rejustContent', function () {
			$('.rejustbox .zc').on('tap', function () {
				var username = $('.rejustbox .int1').val();
				var pwd = $('.rejustbox .int2').val();
				if (username == '' || pwd == '') {
					_toldbox2.default.zc('请输入完整信息', 3200);
				} else {
					if (String(localStorage.getItem('username')) != username) {
						var username = $('.rejustbox .int1').val();
						var pwd = $('.rejustbox .int2').val();
						localStorage.setItem('username', username);
						localStorage.setItem('pwd', pwd);
						$('.rejustbox .int1').val('');
						$('.rejustbox .int2').val('');
						_toldbox2.default.zc('注册成功', 3200);
					} else {
						if (localStorage.getItem('username') == username) {
							_toldbox2.default.zc('用户名重名', 3200);
							$('.rejustbox .int1').val('');
							$('.rejustbox .int2').val('');
						}
					}
				}
			});
		});
	}
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./rejust.scss", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./rejust.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\np,\nblockquote,\ndl,\ndt,\ndd,\nul,\nol,\nli,\npre,\nform,\nfieldset,\nlegend,\nbutton,\ninput,\ntextarea,\nth,\ntd {\n  margin: 0;\n  padding: 0; }\n\nbody,\nbutton,\ninput,\nselect,\ntextarea {\n  font: 12px/1.5tahoma, arial, \\5b8b\\4f53; }\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: 100%; }\n\naddress,\ncite,\ndfn,\nem,\nvar {\n  font-style: normal; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: couriernew, courier, monospace; }\n\nsmall {\n  font-size: 12px; }\n\nul,\nol {\n  list-style: none; }\n\na {\n  text-decoration: none; }\n\na:hover {\n  text-decoration: underline; }\n\nsup {\n  vertical-align: text-top; }\n\nsub {\n  vertical-align: text-bottom; }\n\nlegend {\n  color: #000; }\n\nfieldset,\nimg {\n  border: 0; }\n\nbutton,\ninput,\nselect,\ntextarea {\n  font-size: 100%; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n@font-face {\n  font-family: 'iconfont';\n  /* project id 338840 */\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot\");\n  src: url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.eot?#iefix\") format(\"embedded-opentype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.woff\") format(\"woff\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.ttf\") format(\"truetype\"), url(\"//at.alicdn.com/t/font_616rr5590saqyqfr.svg#iconfont\") format(\"svg\"); }\n\n.iconfont {\n  font-family: iconfont;\n  font-weight: normal; }\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n#container {\n  width: 100%;\n  max-width: 640px;\n  margin: 0 auto;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container .header {\n    height: 38px;\n    width: 100%;\n    font-size: 18px;\n    font-weight: bold; }\n    #container .header .commonHeader {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex;\n      -webkit-box-orient: horizontal;\n      flex-direction: row;\n      text-align: center; }\n      #container .header .commonHeader .back {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .title {\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n      #container .header .commonHeader .moreInfo {\n        width: 50px;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n  #container #content {\n    width: 100%;\n    overflow: auto;\n    -webkit-box-flex: 1;\n    flex: 1; }\n  #container .footer {\n    height: 40px;\n    width: 100%;\n    background-color: #fff;\n    border-top: 1px solid #ccc; }\n    #container .footer ul {\n      width: 100%;\n      height: 100%;\n      display: -webkit-box;\n      display: flex; }\n      #container .footer ul li {\n        -webkit-box-flex: 1;\n        flex: 1;\n        display: -webkit-box;\n        display: flex;\n        -webkit-box-orient: vertical;\n        flex-direction: column;\n        -webkit-box-pack: center;\n        justify-content: center;\n        -webkit-box-align: center;\n        align-items: center; }\n        #container .footer ul li.active {\n          color: #f66; }\n\n#container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  flex-direction: column; }\n  #container #rejustHeader {\n    width: 100%;\n    height: 37px;\n    border-bottom: 1px solid #EEEEEE;\n    position: relative;\n    line-height: 37px;\n    text-align: center;\n    display: -webkit-box;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    flex-direction: row;\n    color: #5E5E5E;\n    background: #FAFAFA; }\n    #container #rejustHeader .left {\n      width: 40px;\n      height: 100%;\n      font-size: 12px; }\n    #container #rejustHeader .rt {\n      width: 60px;\n      height: 100%;\n      font-size: 14px;\n      font-weight: normal; }\n    #container #rejustHeader .box {\n      flex: 1;\n      line-height: 37px;\n      border-radius: 5px;\n      text-align: center;\n      font-size: 15px;\n      font-weight: bold; }\n  #container #rejustContent {\n    flex: 1;\n    width: 100%;\n    height: 100%;\n    background: white;\n    overflow: hidden; }\n    #container #rejustContent .rejustbox {\n      width: 100%;\n      height: 80%;\n      margin-top: 15%;\n      overflow: hidden;\n      text-align: center; }\n      #container #rejustContent .rejustbox .zh {\n        height: 16px;\n        font-size: 12px;\n        color: #666;\n        margin-top: 12px; }\n      #container #rejustContent .rejustbox .int1, #container #rejustContent .rejustbox .int2 {\n        height: 30px;\n        width: 90%;\n        border: none;\n        border-bottom: 1px solid #ededed;\n        font-size: 20px;\n        color: black;\n        text-align: center;\n        margin-top: 15px;\n        outline: none;\n        placeholder: #ccc;\n        letter-spacing: 3px; }\n      #container #rejustContent .rejustbox input::-webkit-input-placeholder {\n        color: #F3F1EE; }\n      #container #rejustContent .rejustbox .zc {\n        width: 90%;\n        height: 40px;\n        margin: 0 auto;\n        background: #FF1877;\n        border-radius: 3px;\n        color: white;\n        font-size: 15px;\n        line-height: 40px;\n        text-align: center;\n        margin-top: 20px; }\n    #container #rejustContent .block {\n      width: 150px;\n      height: 30px;\n      font-size: 13px;\n      color: white;\n      text-align: center;\n      background: #666;\n      border-radius: 5px;\n      margin: 0 auto;\n      line-height: 30px;\n      display: none; }\n", ""]);

// exports


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map