/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Gameboard\": () => (/* binding */ Gameboard),\n/* harmony export */   \"Player\": () => (/* binding */ Player),\n/* harmony export */   \"Ship\": () => (/* binding */ Ship)\n/* harmony export */ });\nconst Ship = (shipIndex, length) => {\n  const _shipIndex = shipIndex;\n  const _length = length;\n  let _map = Array(_length).fill(_shipIndex);\n  const getShipIndex = () => _shipIndex;\n  const getMap = () => _map;\n  const hit = (n) => {\n    if (n >= 0 && n <= _map.length) {\n      _map[n] = 'h';\n    };\n  };\n  const isSunk = () => {\n    return (_map.every(element => element === 'h'));\n  };\n  return {getShipIndex,\n          getMap, \n          hit, \n          isSunk};\n};\n\nconst Gameboard = () => {\n  let _map = Array(10).fill(null).map(() => Array(10).fill(null));\n  let _shipList = [];\n  let _shipIndex = 0;\n  let _attackedCoordinates = [];\n  let _missedCoordinates = [];\n  const getMap = () => _map;\n  const getShipList = () => _shipList;\n  const getAttackedCoordinates = () => _attackedCoordinates;\n  const getMissedCoordinates = () => _missedCoordinates;\n  const _checkPlaceShipAllow = (length, coordinate) => {\n    const x = coordinate[0];\n    const y = coordinate[1];\n    for (let i = 0; i < length; i++) {\n      if (_map[x][y + i] !== null) {\n        return false;\n      };\n    };\n    return true;\n  };\n  const placeShip = (length, coordinate) => {\n    const x = coordinate[0];\n    const y = coordinate[1];\n\n    if ((y + length) > 10) {\n      return 'error, outside of gameboard';\n    } else if (!_checkPlaceShipAllow(length, coordinate)) {\n      return 'error, ship already in place';\n    } else {\n      _map[x].fill(_shipIndex, y, y + length);\n    };\n\n    const ship = Ship(_shipIndex, length);\n    ship.startCoordinate = coordinate;\n    _shipList.push(ship);\n  \n    _shipIndex++;\n  };\n  const placeShips = (placeShipArray) => {\n    placeShipArray.forEach(element => {\n      placeShip(element[0], element[1]);\n    });\n  };\n  const receiveAttack = (coordinate) => {\n    const x = coordinate[0];\n    const y = coordinate[1];\n\n    // hits nothing, records coordinate\n    if (_map[x][y] === null) {\n      _attackedCoordinates.push(coordinate);\n      _missedCoordinates.push(coordinate);\n    } else {\n      // hits a ship, sends hit() to the ship\n      const ship = _shipList[_map[x][y]];\n      const n = y - ship.startCoordinate[1];\n      ship.hit(n);\n      _attackedCoordinates.push(coordinate);\n    };\n  };\n  const reportAllSunk = () => {\n    return _shipList.every(ship => ship.isSunk());\n  };\n  return {getMap,\n          getShipList,\n          getAttackedCoordinates,\n          getMissedCoordinates,\n          placeShip,\n          placeShips,\n          receiveAttack,\n          reportAllSunk}\n};\n\nconst Player = (name) => {\n  let _name = name;\n  const getName = () => _name;\n  const attack = (gameboard, coordinate) => {\n    gameboard.receiveAttack(coordinate);\n  };\n  const aiAttack = (gameboard) => {\n    const random = () => Math.floor(Math.random() * 10);\n    let randomCoordinate = [random(), random()];\n\n    // uncomment to test 'aiAttack() does not attack twice the same coordinate'\n    // randomCoordinate = [0, 0];\n\n    function checkAttacked () {\n      const attackedCoordinates = gameboard.getAttackedCoordinates();\n      return attackedCoordinates.some(e => JSON.stringify(e) === JSON.stringify(randomCoordinate));\n    };\n    \n    if (!checkAttacked()) {\n      // console.log('did not attack this');\n      gameboard.receiveAttack(randomCoordinate);\n    } else {\n      // console.log('attacked this alrady');\n      while (checkAttacked()) {\n        randomCoordinate = [random(), random()];\n        if (!checkAttacked()) {\n          gameboard.receiveAttack(randomCoordinate);\n          break;\n        };\n      };\n    };\n  };\n  return {getName,\n          attack,\n          aiAttack}\n};\n\nconst gameFlow = (() => {\n  const initialize = () => {\n    const player = Player('me');\n    player.gameboard = Gameboard();\n    player.gameboard.placeShips([[4, [4, 4]], [3, [3, 3]], [2, [2, 2]], [1, [1, 1]]]);\n\n    const ai = Player('ai');\n    ai.gameboard = Gameboard();\n    ai.gameboard.placeShips([[4, [4, 4]], [3, [3, 3]], [2, [2, 2]], [1, [1, 1]]]);\n  };\n  return {initialize\n          }\n})();\n\nconst dom = (() => {\n  const initialize = () => {\n    // document.body.appendChild('<p>ss</p>');\n    const p = document.createElement('p');\n    document.body.appendChild(p);\n  };\n  return {initialize\n          }\n})();\n\ndom.initialize();\n\n\n\n//# sourceURL=webpack://battleship/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;