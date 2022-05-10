import './style.css';
import { Ship, Gameboard, Player } from "./factory-functions";

const gameFlow = (() => {
  const player = Player('me');
  const ai = Player('ai');
  const initialize = () => {
    player.gameboard = Gameboard();
    // player.gameboard.placeShips([[4, [8, 4]], [3, [5, 5]], [2, [3, 3]], [1, [1, 1]]]);

    ai.gameboard = Gameboard();
    ai.gameboard.placeShips([[4, [2, 2]], [3, [8, 3]], [2, [6, 6]], [1, [0, 9]]]);
  };
  const playerAttack = (coordinate) => {
    return player.attack(ai.gameboard, coordinate);
  };
  const aiAttack = () => {
    return ai.aiAttack(player.gameboard);
  };
  const aiNextAttack = (lastHitCoordinate) => {
    return ai.aiNextAttack(player.gameboard, lastHitCoordinate);
  };
  return {player,
          ai,
          initialize,
          playerAttack,
          aiAttack,
          aiNextAttack
          };
})();

const dragDrop = (() => {
  let _dragged;
  const initialize = () => {
    const shipDivs = document.querySelectorAll('.storaged-ship');
    shipDivs.forEach(ship => {
      const shipHead = ship.children[0];
      shipHead.draggable = true;
      ship.addEventListener('dragstart', _handleDragStart);
      ship.addEventListener('dragend', _handleDragEnd);
    });

    const boxDivs = document.querySelectorAll('.box.player');
    boxDivs.forEach(box => {
      box.addEventListener('dragover', _handleDragOver);
      box.addEventListener('dragenter', _handleDragEnter);
      box.addEventListener('dragleave', _handleDragLeave);
      box.addEventListener('drop', _handleDrop);
    });
  };
  function _handleDragStart(ev) {
    this.style.opacity = '0.4';
    _dragged = ev.target;
    ev.dataTransfer.setData('text/plain', this.id);
  };
  function _handleDragEnd(ev) {
    this.style.opacity = '1';
    const boxDivs = document.querySelectorAll('.box.player');
    boxDivs.forEach(box => {
      box.classList.remove('over');
    });
  };
  function _handleDragOver(ev) {
    ev.preventDefault();
    return false;
  };
  function _handleDragEnter(ev) {
    for (let i = 0; i < _dragged.parentElement.id[4]; i++) {
      const boxID = `${this.id[0]}${this.id[1]}${Number(this.id[2]) + i}`;
      document.querySelector(`#${boxID}`).classList.add('over');
    };
  };
  function _handleDragLeave(ev) {
    for (let i = 0; i < _dragged.parentElement.id[4]; i++) {
      const boxID = `${this.id[0]}${this.id[1]}${Number(this.id[2]) + i}`;
      document.querySelector(`#${boxID}`).classList.remove('over');
    };
  };
  function _handleDrop(ev) {
    ev.preventDefault();
    const shipLength = Number(ev.dataTransfer.getData('text/plain')[4]);
    const targetCoordinate = [Number(ev.target.id[1]), Number(ev.target.id[2])];
    const placeShipResult = gameFlow.player.gameboard.placeShip(shipLength, targetCoordinate);
    if (placeShipResult !== 'error, ship already in place' 
        && placeShipResult !== 'error, outside of gameboard') {
      const placedShip = _dragged.parentElement;
      placedShip.classList.add('hidden');
      placedShip.childNodes.forEach(shipbox => {shipbox.classList.add('hidden')});
      _restartPlayerGameboard();
    };
  };
  const _restartPlayerGameboard = () => {
    const playerBoardCon = document.querySelector('.player-board-con');
    const playerBoardMap = gameFlow.player.gameboard.getMap();
    const newPlayerGameboard = dom.createPlayerGameboard(true, playerBoardMap);
    playerBoardCon.replaceChild(newPlayerGameboard, playerBoardCon.children[0]);

    const boxDivs = document.querySelectorAll('.box.player');
    boxDivs.forEach(box => {
      if (!box.classList.contains('ship')) {
        box.addEventListener('dragover', _handleDragOver);
        box.addEventListener('dragenter', _handleDragEnter);
        box.addEventListener('dragleave', _handleDragLeave);
        box.addEventListener('drop', _handleDrop);
      };
    });
  };
  return {initialize
          };
})();

const dom = (() => {
  const initialize = () => {
    gameFlow.initialize();
    
    const headerDiv = _createDiv('header-con');
    const header = document.createElement('h1');
    header.innerText = 'Battleship';
    headerDiv.append(header);

    const announceDiv = _createDiv('announce-con');
    announceDiv.classList.add('hidden');

    const shipStorageDiv = _createDiv('ship-storage-con');
    const playerShipStorage = _createPlayerShipStorage();
    const aiShipStorageDiv = _createDiv('ai-ship-storage-con');
    shipStorageDiv.append(playerShipStorage, aiShipStorageDiv);

    const mainDiv = _createDiv('main-con');
    const playerBoardDiv = _createDiv('player-board-con');
    const playerBoardMap = gameFlow.player.gameboard.getMap();
    const playerBoard = createPlayerGameboard(true, playerBoardMap);
    playerBoardDiv.append(playerBoard);
    mainDiv.append(playerBoardDiv);

    const aiBoardDiv = _createDiv('ai-board-con');
    const startBtn = _createStartBtn();
    startBtn.addEventListener('click', _startGame);
    aiBoardDiv.append(startBtn);
    mainDiv.append(aiBoardDiv);

    const fillerDiv = _createDiv('filler-div');

    const footerDiv = _createDiv('footer-con');

    document.body.append(headerDiv, announceDiv, shipStorageDiv, mainDiv, fillerDiv, footerDiv);

    dragDrop.initialize();
  };
  const _createDiv = (...divNames) => {
    const div = document.createElement('div');
    divNames.forEach(divName => div.classList.add(divName));
    return div;
  };
  const _createShipDiv = (length, idName) => {
    const div = _createDiv('storaged-ship');
    div.id = idName;
    for (let i = 0; i < length; i++) {
      const box = _createDiv('shipbox');
      box.id = `s${i}`;
      div.append(box);
    };
    return div;
  };
  const _createShipDivs = (lengthArray) => {
    const playerShipStorage = _createDiv('player-ship-storage');
    lengthArray.forEach(length => {
      playerShipStorage.append(_createShipDiv(length, `ship${length}`));
    });
    return playerShipStorage;
  };
  const _createPlayerShipStorage = () => {
    return _createShipDivs([4, 3, 1, 1, 3, 2, 2, 2]);
  };
  const createPlayerGameboard = (isPlayer, boardMap) => {
    const gameboardDiv = _createDiv(isPlayer ? 'player-board' : 'ai-board');
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const box = _createDiv('box', isPlayer ? 'player' : 'ai');
        box.id = isPlayer ? `p${i}${j}` : `a${i}${j}`;
        if (boardMap[i][j] !== null) {
          box.classList.add(boardMap[i][j]);
          box.classList.add('ship');
        };
        gameboardDiv.appendChild(box);
      };
    };
    return gameboardDiv;
  };
  const _createStartBtn = () => {
    const gameboardDiv = _createDiv('ai-start');
    const startBtn = document.createElement('button');
    startBtn.innerText = 'Start';
    startBtn.className = 'start-btn';
    gameboardDiv.append(startBtn);
    return gameboardDiv;
  };
  const _startGame = () => {
    const aiBoardMap = gameFlow.ai.gameboard.getMap();
    const aiBoard = createPlayerGameboard(false, aiBoardMap);
    const aiBoardDiv = document.querySelector('.ai-board-con');
    const aiStart = document.querySelector('.ai-start');
    aiBoardDiv.replaceChild(aiBoard, aiStart);

    const boxes = document.querySelectorAll('.box.ai');
    boxes.forEach(box => {
      box.addEventListener('click', () => {_aiBoxListener(box)}
      );
    });
  };
  function _aiBoxListener(box) {
    const coordinate = [box.id[1], box.id[2]];
    const result = gameFlow.playerAttack(coordinate);
    if (!result) {
      box.classList.add('miss');
      box.innerText = '⋅';
      box.outerHTML = box.outerHTML;
      _aiHits();
    } else {
      box.classList.add('hit');
      box.innerText = '×';
      box.outerHTML = box.outerHTML;

      if(gameFlow.ai.gameboard.reportAllSunk()) {
        _announcePlayerWon(true);
      } else {
        _aiHits();
      };
    };
  };
  let _aiLastHit = false;
  let _aiLastHitCoordinate;
  function _aiHits() {
    let aiHitResult;
    if (!_aiLastHit) {
      aiHitResult = gameFlow.aiAttack();
      if (aiHitResult[0]) {
        _aiLastHit = true;
        _aiLastHitCoordinate = aiHitResult[1];
      } else {
        _aiLastHit = false;
        _aiLastHitCoordinate = null;
      };
    } else {
      aiHitResult = gameFlow.aiNextAttack(_aiLastHitCoordinate);
      if (aiHitResult[0]) {
        _aiLastHit = true;
        _aiLastHitCoordinate = aiHitResult[1];
      } else {
        _aiLastHit = false;
        _aiLastHitCoordinate = null;
      };
    };
    const aiCoordinate = aiHitResult[1];
    const aiHitBox = document.querySelector(`#p${aiCoordinate[0]}${aiCoordinate[1]}`);
    if (!aiHitResult[0]) {
      aiHitBox.innerText = '⋅';
      aiHitBox.classList.add('miss');
    } else {
      aiHitBox.innerText = '×';
      aiHitBox.classList.add('hit');

      if (gameFlow.player.gameboard.reportAllSunk()) {
        _announcePlayerWon(false);
      };
    };
  };
  const _announcePlayerWon = (isWon) => {
    const announceDiv = document.querySelector('.announce-con');
    announceDiv.classList.remove('hidden');
    if (isWon) {
      announceDiv.innerText = 'You won!';
    } else {
      announceDiv.innerText = 'You lost!';
    };
    const resetBtn = document.createElement('button');
    resetBtn.innerText = 'Reset';
    resetBtn.className = 'reset-btn';
    resetBtn.addEventListener('click', () => {
      announceDiv.classList.add('hidden');
      document.body.replaceChildren();
      dom.initialize();
    });
    announceDiv.append(resetBtn);
    const boxes = document.querySelectorAll('.box.ai');
    boxes.forEach(box => {box.outerHTML = box.outerHTML});
  };
  return {initialize,
          createPlayerGameboard
          };
})();

dom.initialize();