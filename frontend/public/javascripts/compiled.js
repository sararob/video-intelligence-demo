/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	eval("\nconst blah = {\n  myfunction() {\n    return 'hi';\n  }\n\n};\n\nexport default blah;\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvanMvaW5kZXguanM/MmVlYyJdLCJuYW1lcyI6WyJibGFoIiwibXlmdW5jdGlvbiJdLCJtYXBwaW5ncyI6IjtBQUNBLE1BQU1BLE9BQU87QUFDWEMsZUFBYTtBQUNYLFdBQU8sSUFBUDtBQUNEOztBQUhVLENBQWI7O0FBT0EsZUFBZUQsSUFBZiIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jb25zdCBibGFoID0ge1xuICBteWZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnaGknO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgYmxhaDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9yZXNvdXJjZXMvanMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }
/******/ ]);