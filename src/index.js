import './style.css';
import { Ship, Gameboard, Player } from "./factory-functions";

const gameFlow = (() => {
  const player = Player('me');
  const ai = Player('ai');
  const initialize = () => {
    player.gameboard = Gameboard();
    player.gameboard.placeShips([[4, [8, 4]], [3, [5, 5]], [2, [3, 3]], [1, [1, 1]]]);

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
          }
})();

const dom = (() => {
  const initialize = () => {
    gameFlow.initialize();
    
    const headerDiv = _createDiv('header-con');
    const header = document.createElement('h1');
    header.innerText = 'Battleship';
    headerDiv.append(header);

    const announceDiv = _createDiv('announce-con');

    const mainDiv = _createDiv('main-con');
    const playerBoardDiv = _createDiv('player-board-con');
    const playerBoardMap = gameFlow.player.gameboard.getMap();
    const playerBoard = _createPlayerGameboard(true, playerBoardMap);
    playerBoardDiv.append(playerBoard);
    mainDiv.append(playerBoardDiv);

    const aiBoardDiv = _createDiv('ai-board-con');
    const startBtn = _createStartBtn();
    startBtn.addEventListener('click', _startGame);
    aiBoardDiv.append(startBtn);
    mainDiv.append(aiBoardDiv);

    const footerDiv = _createDiv('footer-con');

    document.body.append(headerDiv, announceDiv, mainDiv, footerDiv);
  };
  const _createDiv = (...divNames) => {
    const div = document.createElement('div');
    divNames.forEach(divName => div.classList.add(divName));
    return div;
  };
  const _createPlayerGameboard = (isPlayer, boardMap) => {
    const gameboardDiv = _createDiv(isPlayer ? 'player-board' : 'ai-board');
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const box = _createDiv('box', isPlayer ? 'player' : 'ai');
        box.id = `p${i}${j}`;
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
    const aiBoard = _createPlayerGameboard(false, aiBoardMap);
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
    if (isWon) {
      announceDiv.innerText = 'You won!';
    } else {
      announceDiv.innerText = 'You lost!';
    };
    const resetBtn = document.createElement('button');
    resetBtn.innerText = 'Reset';
    resetBtn.className = 'reset-btn';
    resetBtn.addEventListener('click', () => {
      document.body.replaceChildren();
      dom.initialize();
    });
    announceDiv.append(resetBtn);
    const boxes = document.querySelectorAll('.box.ai');
    boxes.forEach(box => {box.outerHTML = box.outerHTML});
  };
  return {initialize
          }
})();

dom.initialize();