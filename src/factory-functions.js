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
    
    if (!_checkCoordinateAttacked(gameboard, randomCoordinate)) {
      const result = gameboard.receiveAttack(randomCoordinate);
      return [result, randomCoordinate];
    } else {
      while (_checkCoordinateAttacked(gameboard, randomCoordinate)) {
        randomCoordinate = [random(), random()];
        if (!_checkCoordinateAttacked(gameboard, randomCoordinate)) {
          const result = gameboard.receiveAttack(randomCoordinate);
          return [result, randomCoordinate];
        };
      };
    };
  };
  const aiNextAttack = (gameboard, lastHitCoordinate) => {
    const possibleCoordinates = _aiNextAttackPossibleCoordinates(gameboard, lastHitCoordinate);

    if (possibleCoordinates.length) {
      let pickedCoordinate = possibleCoordinates[Math.floor(possibleCoordinates.length * Math.random())];
      const result = gameboard.receiveAttack(pickedCoordinate);
      return [result, pickedCoordinate];
    } else {
      return aiAttack(gameboard);
    };
  };
  function _checkCoordinateAttacked (gameboard, coordinate) {
    const attackedCoordinates = gameboard.getAttackedCoordinates();
    return attackedCoordinates.some(ele => JSON.stringify(ele) === JSON.stringify(coordinate));
  };
  function _aiNextAttackPossibleCoordinates (gameboard, lastHitCoordinate) {
    const lastX = lastHitCoordinate[0];
    const lastY = lastHitCoordinate[1];
    const possibleCoordinates = [];
    if (lastX >= 1) {
      if (!_checkCoordinateAttacked(gameboard, [lastX - 1, lastY])) {
        possibleCoordinates.push([lastX - 1, lastY]);
      };
    };
    if (lastX <= 8) {
      if (!_checkCoordinateAttacked(gameboard, [lastX + 1, lastY])) {
        possibleCoordinates.push([lastX + 1, lastY]);
      };
    };
    if (lastY >= 1) {
      if (!_checkCoordinateAttacked(gameboard, [lastX, lastY - 1])) {
        possibleCoordinates.push([lastX, lastY - 1]);
      };
    };
    if (lastY <= 8) {
      if (!_checkCoordinateAttacked(gameboard, [lastX, lastY + 1])) {
        possibleCoordinates.push([lastX, lastY + 1]);
      };
    };
    return possibleCoordinates;
  };
  return {getName,
          attack,
          aiAttack,
          aiNextAttack}
};

export { Ship, Gameboard, Player };