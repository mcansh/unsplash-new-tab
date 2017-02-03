/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return $; });
/* unused harmony export $$ */

var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn);
};

NodeList.prototype.__proto__ = Array.prototype;

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach(function (elem, i) {
    elem.on(name, fn);
  });
};



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return authToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return applicationSecret; });
var authToken = '551c50eda7975cf9ef9aaa4e043667f7566231fb7f09992b748630f2bfd81e8b' || '20e1e756bf6725f1a12a260b6a6fe8775d14f48ca7dbf19a3ed86b8fc3f4adcc';

var applicationSecret = '087479c2e8aed540a1ff89cbc306a2a317d21df98bcee598119c7bcbd0837290' || 'b018b677f919ab742857d23bb26a345fd46d2b807dd9012d04bd5513af2392e6';



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bling__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tokens__ = __webpack_require__(1);

// import 'babel-polyfill';


var url = 'https://api.unsplash.com/photos/random?&featured&client_id=' + __WEBPACK_IMPORTED_MODULE_1__tokens__["a" /* authToken */];
var main = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('main');
var download = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('#download');
var moreButton = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('#more');
var profile = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('#profile');
var userName = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('#name');
var likePhoto = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('#like');
var photoLocation = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('#location');
var viewOnUnsplash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('#view');
var login = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('#login');
var accessToken = localStorage.getItem('accessToken');
var photoId = void 0;
var code = void 0;
var redirectURI = 'http://' + window.location.hostname;
var loginURL = 'https://unsplash.com/oauth/authorize?client_id=' + __WEBPACK_IMPORTED_MODULE_1__tokens__["a" /* authToken */] + '&redirect_uri=' + redirectURI + '&response_type=code&scope=public+read_user+write_likes';

if (accessToken === null || accessToken === undefined) {
  likePhoto.href = loginURL;
}

if (redirectURI === 'http://mcansh.local') {
  redirectURI = 'http://mcansh.local:5757/';
} else {
  redirectURI = 'https://mcansh.github.io/unsplash-new-tab/';
}

function redirectMe() {
  window.location.href = redirectURI;
}

login.href = loginURL;

fetch(url, {
  method: 'GET'
}).then(function (blob) {
  return blob.json();
}).then(function (data) {
  photoId = data.id;
  main.style.backgroundColor = data.color;
  main.style.backgroundImage = 'url(https://unsplash.com/photos/' + data.id + '/download)'; // would use `data.links.download` but that goes over http, thus throwing errors in console, this simply remakes that but over https

  viewOnUnsplash.href = data.links.html;
  profile.style.backgroundImage = 'url(' + data.user.profile_image.large + ')';
  download.href = data.links.download;
  userName.href = data.user.links.html;
  userName.textContent = data.user.name;
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('#like span').textContent = data.likes;

  if (data.location !== null) {
    photoLocation.textContent = data.user.location;
    photoLocation.href = 'https://unsplash.com/search/' + data.user.location;
  } else {
    photoLocation.remove();
  }
});

function showMoreMenu() {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('.popover').classList.toggle('is-visible');
}

function hideMoreMenu() {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('.popover').classList.remove('is-visible');
}

moreButton.addEventListener('click', showMoreMenu);
main.addEventListener('click', hideMoreMenu);

if (location.search.length) {
  (function () {
    var urlEnc = window.location.search;
    var urlDec = decodeURIComponent(urlEnc);

    var codeParam = /^code=/;
    var query = urlDec.split('?');

    if (query.length) {
      var params = query[1].split('&');
      params.forEach(function (param) {
        if (param.match(codeParam)) {
          code = param.replace(codeParam, '');
          code = code.replace('/', '');
        }
      });
    }

    if (code) {
      console.log('CODE: ' + code);
      window.code = code;
      logMeIn();
    } else {
      console.error('no login code = no login for you');
      redirectMe();
    }
  })();
}

// function showMe() {
//   fetch(`https://api.unsplash.com/me/?access_token=${accessToken}`, {
//     method: 'GET'
//   })
//     .then(blob => blob.json())
//     .then((data) => { console.log(data); });
// }

function logMeIn() {
  fetch('https://unsplash.com/oauth/token/?client_id=' + __WEBPACK_IMPORTED_MODULE_1__tokens__["a" /* authToken */] + '&client_secret=' + __WEBPACK_IMPORTED_MODULE_1__tokens__["b" /* applicationSecret */] + '&redirect_uri=' + redirectURI + '&code=' + code + '&grant_type=authorization_code', {
    method: 'POST'
  }).then(function (data) {
    return data.json();
  }).then(function (data) {
    accessToken = data.access_token;
    localStorage.setItem('accessToken', accessToken);
    redirectMe();
  }).catch(function (err) {
    console.error(err);
  });
}

function getPhotoStats() {
  fetch('https://api.unsplash.com/photos/' + photoId + '/stats?access_token=' + accessToken, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(function (blob) {
    return blob.json();
  }).then(function (data) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__bling__["a" /* $ */])('#like span').textContent = data.likes;
  }).catch(function (err) {
    console.error(err);
  });
}

function likeThePhoto(event) {
  event.preventDefault();
  fetch('https://api.unsplash.com/photos/' + photoId + '/like?access_token=' + accessToken, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(function () {
    likePhoto.classList.add('liked');
  });

  getPhotoStats();
}

function unlikeThePhoto(event) {
  event.preventDefault();
  fetch('https://api.unsplash.com/photos/' + photoId + '/like?access_token=' + accessToken, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(function () {
    likePhoto.classList.remove('liked');
  });

  getPhotoStats();
}

if (likePhoto.classList.contains('liked')) {
  likePhoto.addEventListener('click', unlikeThePhoto);
} else {
  likePhoto.addEventListener('click', likeThePhoto);
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map