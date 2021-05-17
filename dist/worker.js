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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/scripts/worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ "./src/scripts/worker.js":
/*!*******************************!*\
  !*** ./src/scripts/worker.js ***!
  \*******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DB_NAME = 'arithmethdoku';
var STORE_NAME = 'savedData';
var db;
var firstRequest = indexedDB.open(DB_NAME, 2);
firstRequest.onupgradeneeded = handleUpgrade;
firstRequest.onsuccess = handleSuccess;

firstRequest.onerror = function (e) {
  return console.log(e);
};

onmessage = function onmessage(_ref) {
  var data = _ref.data;

  var _createSenders = createSenders(data),
      sendSuccess = _createSenders.sendSuccess,
      sendError = _createSenders.sendError;

  var key = data.key,
      value = data.value,
      type = data.type;

  switch (type) {
    case 'ADD':
      if (db && key && value) {
        var _getWriter = getWriter(),
            trans = _getWriter.trans,
            store = _getWriter.store;

        var putRequest = store.put(value, key);

        putRequest.onsuccess = function () {
          console.log('success');
          sendSuccess();
        };

        putRequest.onerror = function () {
          console.log('error');
          sendError();
        };

        trans.oncomplete = function () {
          return console.log('complete!');
        };
      } else {
        sendError();
      }

      break;

    case 'GET':
      if (db && key) {
        var _getReader = getReader(),
            _trans = _getReader.trans,
            _store = _getReader.store;

        var getRequest = _store.get(key);

        getRequest.onsuccess = function () {
          console.log('success');
          sendSuccess(getRequest.result);
        };

        getRequest.onerror = function () {
          console.log('error');
          sendError();
        };

        _trans.oncomplete = function () {
          return console.log('complete!');
        };
      } else {
        sendError();
      }

      break;

    default:
      sendError("no match for ".concat(type));
  }
};

function handleUpgrade(e) {
  try {
    e.target.result.createObjectStore(STORE_NAME);
  } catch (e) {
    console.log(e);
  }
}

function handleSuccess(e) {
  db = e.target.result;

  if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.close();
    var newRequest = indexedDB.open(DB_NAME, db.version + 1);
    newRequest.onupgradeneeded = handleUpgrade;
    newRequest.onsuccess = handleSuccess;
  } else {
    console.log('Set up db!');
  }
}

function getReader() {
  var _db;

  var storeName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : STORE_NAME;
  var trans = (_db = db) === null || _db === void 0 ? void 0 : _db.transaction(storeName);
  var store = trans === null || trans === void 0 ? void 0 : trans.objectStore(storeName);
  return {
    trans: trans,
    store: store
  };
}

function getWriter() {
  var _db2;

  var storeName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : STORE_NAME;
  var trans = (_db2 = db) === null || _db2 === void 0 ? void 0 : _db2.transaction(storeName, 'readwrite');
  var store = trans === null || trans === void 0 ? void 0 : trans.objectStore(storeName);
  return {
    trans: trans,
    store: store
  };
}

function createSenders(_ref2) {
  var type = _ref2.type,
      requestId = _ref2.requestId;
  var responseDefaults = {
    type: type,
    requestId: requestId
  };
  return {
    sendSuccess: function sendSuccess(msg) {
      return postMessage(_objectSpread(_objectSpread({}, responseDefaults), {}, {
        status: 'success',
        result: msg
      }));
    },
    sendError: function sendError(msg) {
      return postMessage(_objectSpread(_objectSpread({}, responseDefaults), {}, {
        status: 'error',
        result: msg
      }));
    }
  };
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvd29ya2VyLmpzIl0sIm5hbWVzIjpbIkRCX05BTUUiLCJTVE9SRV9OQU1FIiwiZGIiLCJmaXJzdFJlcXVlc3QiLCJpbmRleGVkREIiLCJvcGVuIiwib251cGdyYWRlbmVlZGVkIiwiaGFuZGxlVXBncmFkZSIsIm9uc3VjY2VzcyIsImhhbmRsZVN1Y2Nlc3MiLCJvbmVycm9yIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJvbm1lc3NhZ2UiLCJkYXRhIiwiY3JlYXRlU2VuZGVycyIsInNlbmRTdWNjZXNzIiwic2VuZEVycm9yIiwia2V5IiwidmFsdWUiLCJ0eXBlIiwiZ2V0V3JpdGVyIiwidHJhbnMiLCJzdG9yZSIsInB1dFJlcXVlc3QiLCJwdXQiLCJvbmNvbXBsZXRlIiwiZ2V0UmVhZGVyIiwiZ2V0UmVxdWVzdCIsImdldCIsInJlc3VsdCIsInRhcmdldCIsImNyZWF0ZU9iamVjdFN0b3JlIiwib2JqZWN0U3RvcmVOYW1lcyIsImNvbnRhaW5zIiwiY2xvc2UiLCJuZXdSZXF1ZXN0IiwidmVyc2lvbiIsInN0b3JlTmFtZSIsInRyYW5zYWN0aW9uIiwib2JqZWN0U3RvcmUiLCJyZXF1ZXN0SWQiLCJyZXNwb25zZURlZmF1bHRzIiwibXNnIiwicG9zdE1lc3NhZ2UiLCJzdGF0dXMiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNB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RUFBRWE7QUFIbUIsU0FBZjtBQUFBO0FBTlQsR0FBUDtBQVlELEMiLCJmaWxlIjoid29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvZGlzdC9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvc2NyaXB0cy93b3JrZXIuanNcIik7XG4iLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZGVmaW5lUHJvcGVydHk7IiwiY29uc3QgREJfTkFNRSA9ICdhcml0aG1ldGhkb2t1J1xuY29uc3QgU1RPUkVfTkFNRSA9ICdzYXZlZERhdGEnXG5cbmxldCBkYlxuXG5jb25zdCBmaXJzdFJlcXVlc3QgPSBpbmRleGVkREIub3BlbihEQl9OQU1FLCAyKVxuZmlyc3RSZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGhhbmRsZVVwZ3JhZGVcbmZpcnN0UmVxdWVzdC5vbnN1Y2Nlc3MgPSBoYW5kbGVTdWNjZXNzXG5maXJzdFJlcXVlc3Qub25lcnJvciA9IChlKSA9PiBjb25zb2xlLmxvZyhlKVxuXG5vbm1lc3NhZ2UgPSAoeyBkYXRhIH0pID0+IHtcbiAgY29uc3QgeyBzZW5kU3VjY2Vzcywgc2VuZEVycm9yIH0gPSBjcmVhdGVTZW5kZXJzKGRhdGEpXG4gIGNvbnN0IHsga2V5LCB2YWx1ZSwgdHlwZSB9ID0gZGF0YVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ0FERCc6XG4gICAgICBpZiAoZGIgJiYga2V5ICYmIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHsgdHJhbnMsIHN0b3JlIH0gPSBnZXRXcml0ZXIoKVxuICAgICAgICBjb25zdCBwdXRSZXF1ZXN0ID0gc3RvcmUucHV0KHZhbHVlLCBrZXkpXG5cbiAgICAgICAgcHV0UmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3MnKVxuICAgICAgICAgIHNlbmRTdWNjZXNzKClcbiAgICAgICAgfVxuXG4gICAgICAgIHB1dFJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKVxuICAgICAgICAgIHNlbmRFcnJvcigpXG4gICAgICAgIH1cblxuICAgICAgICB0cmFucy5vbmNvbXBsZXRlID0gKCkgPT4gY29uc29sZS5sb2coJ2NvbXBsZXRlIScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZW5kRXJyb3IoKVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnR0VUJzpcbiAgICAgIGlmIChkYiAmJiBrZXkpIHtcbiAgICAgICAgY29uc3QgeyB0cmFucywgc3RvcmUgfSA9IGdldFJlYWRlcigpXG4gICAgICAgIGNvbnN0IGdldFJlcXVlc3QgPSBzdG9yZS5nZXQoa2V5KVxuXG4gICAgICAgIGdldFJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXNzJylcbiAgICAgICAgICBzZW5kU3VjY2VzcyhnZXRSZXF1ZXN0LnJlc3VsdClcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKVxuICAgICAgICAgIHNlbmRFcnJvcigpXG4gICAgICAgIH1cbiAgICAgICAgdHJhbnMub25jb21wbGV0ZSA9ICgpID0+IGNvbnNvbGUubG9nKCdjb21wbGV0ZSEnKVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZW5kRXJyb3IoKVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHNlbmRFcnJvcihgbm8gbWF0Y2ggZm9yICR7dHlwZX1gKVxuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVVwZ3JhZGUoZSkge1xuICB0cnkge1xuICAgIGUudGFyZ2V0LnJlc3VsdC5jcmVhdGVPYmplY3RTdG9yZShTVE9SRV9OQU1FKVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVTdWNjZXNzKGUpIHtcbiAgZGIgPSBlLnRhcmdldC5yZXN1bHRcbiAgaWYgKCFkYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKFNUT1JFX05BTUUpKSB7XG4gICAgZGIuY2xvc2UoKVxuICAgIGNvbnN0IG5ld1JlcXVlc3QgPSBpbmRleGVkREIub3BlbihEQl9OQU1FLCBkYi52ZXJzaW9uICsgMSlcbiAgICBuZXdSZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGhhbmRsZVVwZ3JhZGVcbiAgICBuZXdSZXF1ZXN0Lm9uc3VjY2VzcyA9IGhhbmRsZVN1Y2Nlc3NcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZygnU2V0IHVwIGRiIScpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UmVhZGVyKHN0b3JlTmFtZSA9IFNUT1JFX05BTUUpIHtcbiAgY29uc3QgdHJhbnMgPSBkYj8udHJhbnNhY3Rpb24oc3RvcmVOYW1lKVxuICBjb25zdCBzdG9yZSA9IHRyYW5zPy5vYmplY3RTdG9yZShzdG9yZU5hbWUpXG4gIHJldHVybiB7IHRyYW5zLCBzdG9yZSB9XG59XG5cbmZ1bmN0aW9uIGdldFdyaXRlcihzdG9yZU5hbWUgPSBTVE9SRV9OQU1FKSB7XG4gIGNvbnN0IHRyYW5zID0gZGI/LnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgJ3JlYWR3cml0ZScpXG4gIGNvbnN0IHN0b3JlID0gdHJhbnM/Lm9iamVjdFN0b3JlKHN0b3JlTmFtZSlcbiAgcmV0dXJuIHsgdHJhbnMsIHN0b3JlIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU2VuZGVycyh7IHR5cGUsIHJlcXVlc3RJZCB9KSB7XG4gIGNvbnN0IHJlc3BvbnNlRGVmYXVsdHMgPSB7XG4gICAgdHlwZSxcbiAgICByZXF1ZXN0SWQsXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHNlbmRTdWNjZXNzOiBtc2cgPT4gcG9zdE1lc3NhZ2Uoe1xuICAgICAgLi4ucmVzcG9uc2VEZWZhdWx0cyxcbiAgICAgIHN0YXR1czogJ3N1Y2Nlc3MnLFxuICAgICAgcmVzdWx0OiBtc2csXG4gICAgfSksXG4gICAgc2VuZEVycm9yOiBtc2cgPT4gcG9zdE1lc3NhZ2Uoe1xuICAgICAgLi4ucmVzcG9uc2VEZWZhdWx0cyxcbiAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgIHJlc3VsdDogbXNnLFxuICAgIH0pLFxuICB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ==