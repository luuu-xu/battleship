import './style.css';

const Ship = (shipIndex, length) => {
  const _shipIndex = shipIndex;
  const _length = length;
  let _map = Array(_length).fill(_shipIndex);
  const getShipIndex = () => _shipIndex;
  const getMap = () => _map;
  const hit = (n) => {
    if (n >= 0 && n <= _map.length) {
      _map[n] = 'h';
    };
  };
  const isSunk = () => {
    return (_map.every(element => element === 'h'));
  };
  return {getShipIndex,
          getMap, 
          hit, 
          isSunk};
};

const Gameboard = () => {
  let _map = Array(10).fill(null).map(() => Array(10).fill(null));
  let _shipList = [];
  let _shipIndex = 0;
  let _attackedCoordinates = [];
  let _missedCoordinates = [];
  const getMap = () => _map;
  const getShipList = () => _shipList;
  const getAttackedCoordinates = () => _attackedCoordinates;
  const getMissedCoordinates = () => _missedCoordinates;
  const _checkPlaceShipAllow = (length, coordinate) => {
    const x = coordinate[0];
    const y = coordinate[1];
    for (let i = 0; i < length; i++) {
      if (_map[x][y + i] !== null) {
        return false;
      };
    };
    return true;
  };
  const placeShip = (length, coordinate) => {
    const x = coordinate[0];
    const y = coordinate[1];

    if ((y + length) > 10) {
      return 'error, outside of gameboard';
    } else if (!_checkPlaceShipAllow(length, coordinate)) {
      return 'error, ship already in place';
    } else {
      _map[x].fill(_shipIndex, y, y + length);
    };

    const ship = Ship(_shipIndex, length);
    ship.startCoordinate = coordinate;
    _shipList.push(ship);
  
    _shipIndex++;
  };
  const placeShips = (placeShipArray) => {
    placeShipArray.forEach(element => {
      placeShip(element[0], element[1]);
    });
  };
  const receiveAttack = (coordinate) => {
    const x = coordinate[0];
    const y = coordinate[1];

    // hits nothing, records coordinate
    if (_map[x][y] === null) {
      _attackedCoordinates.push(coordinate);
      _missedCoordinates.push(coordinate);
      // console.log('hits nothing');
      return false;
    } else {
      // hits a ship, sends hit() to the ship
      const ship = _shipList[_map[x][y]];
      const n = y - ship.startCoordinate[1];
      ship.hit(n);
      _attackedCoordinates.push(coordinate);
      // console.log('hits ship!');
      return true;
    };
  };
  const reportAllSunk = () => {
    return _shipList.every(ship => ship.isSunk());
  };
  return {getMap,
          getShipList,
          getAttackedCoordinates,
          getMissedCoordinates,
          placeShip,
          placeShips,
          receiveAttack,
          reportAllSunk}
};

const Player = (name) => {
  let _name = name;
  const getName = () => _name;
  const attack = (gameboard, coordinate) => {
    return gameboard.receiveAttack(coordinate);
  };
  const aiAttack = (gameboard) => {
    const random = () => Math.floor(Math.random() * 10);
    let randomCoordinate = [random(), random()];

    // uncomment to test 'aiAttack() does not attack twice the same coordinate'
    // randomCoordinate = [0, 0];

    function checkAttacked () {
      const attackedCoordinates = gameboard.getAttackedCoordinates();
      return attackedCoordinates.some(e => JSON.stringify(e) === JSON.stringify(randomCoordinate));
    };
    
    if (!checkAttacked()) {
      const result = gameboard.receiveAttack(randomCoordinate);
      return [result, randomCoordinate];
    } else {
      while (checkAttacked()) {
        randomCoordinate = [random(), random()];
        if (!checkAttacked()) {
          const result = gameboard.receiveAttack(randomCoordinate);
          return [result, randomCoordinate];
        };
      };
    };
  };
  return {getName,
          attack,
          aiAttack}
};

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
  return {player,
          ai,
          initialize,
          playerAttack,
          aiAttack
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
  function _aiHits() {
    const aiHitResult = gameFlow.aiAttack();
    const aiCoordinate = aiHitResult[1];
    // console.log(aiCoordinate);
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
  return {initialize
          }
})();

dom.initialize();

export { Ship, Gameboard, Player };