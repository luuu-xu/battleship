import { Ship, Gameboard, Player } from "./factory-functions";
import { describe, test } from "@jest/globals";

describe('Ship()', () => {
  describe('getMap()', () => {
    test(`getMap() shows that Ship() creates correct ship with length`, () => {
      expect(Ship(0, 2).getMap()).toEqual([0, 0]);
    });
  });

  describe('hit()', () => {
    test('hit() works normally', () => {
      const ship4 = Ship(0, 4);
      ship4.hit(1);
      expect(ship4.getMap()).toEqual([0, 'h', 0, 0]);
    });
    
    test('hit() does not hit the ship if number provided is outside', () => {
      const ship4 = Ship(0, 4);
      ship4.hit(5);
      expect(ship4.getMap()).toEqual([0, 0, 0, 0]);
    });
  });
  
  describe('isSunk()', () => {
    test('isSunk() works normally', () => {
      const ship2 = Ship(0, 2);
      ship2.hit(0);
      ship2.hit(1);
      expect(ship2.isSunk()).toBeTruthy();
    });
    
    test('isSunk() returns false if ship is not all hit', () => {
      const ship4 = Ship(0, 4);
      ship4.hit(0);
      ship4.hit(1);
      expect(ship4.isSunk()).toBeFalsy();
    });
  });
});

describe('Gameboard()', () => {
  describe('getMap()', () => {
    test('getMap() shows a correct 10x10 null gameboard(array of arrays)', () => {
      const gameboard = Gameboard();
      expect(gameboard.getMap()).toEqual(
        [
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null]
        ]
      );
    });
  });

  describe('placeShip()', () => {
    test('placeShip() works normally', () => {
      const gameboard = Gameboard();
      gameboard.placeShip(4, [0, 0]);
      gameboard.placeShip(3, [3, 3]);
      gameboard.placeShip(2, [5, 5]);
      expect(gameboard.getMap()).toEqual(
        [
          [   0,    0,    0,    0, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null,    1,    1,    1, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null,    2,    2, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null]
        ]
      );
    });

    test('placeShip() returns error if ship goes outside of the gameboard', () => {
      const gameboard = Gameboard();
      expect(gameboard.placeShip(4, [0, 7])).toBe('error, outside of gameboard');
      expect(gameboard.getMap()).toEqual(Array(10).fill(null).map(() => Array(10).fill(null)));
    });

    test('placeShip() returns error if ship is already in place', () => {
      const gameboard = Gameboard();
      gameboard.placeShip(4, [0, 3]);
      expect(gameboard.placeShip(3, [0, 6])).toBe('error, ship already in place');
      expect(gameboard.placeShip(3, [0, 1])).toBe('error, ship already in place');
    });
  });

  describe('placeShips()', () => {
    test('works normally', () => {
      const gameboard = Gameboard();
      gameboard.placeShips([[4, [4, 4]], [3, [3, 3]], [2, [2, 2]], [1, [1, 1]]]);
      expect(gameboard.getMap()).toEqual(
        [
          [null, null, null, null, null, null, null, null, null, null],
          [null,    3, null, null, null, null, null, null, null, null],
          [null, null,    2,    2, null, null, null, null, null, null],
          [null, null, null,    1,    1,    1, null, null, null, null],
          [null, null, null, null,    0,    0,    0,    0, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null, null, null]
        ]
      );
    });
  });

  describe('receiveAttack()', () => {
    test('receiveAttack() records missed shot', () => {
      const gameboard = Gameboard();
      gameboard.placeShip(4, [0, 3]);
      gameboard.receiveAttack([0, 0]);
      gameboard.receiveAttack([3, 3]);
      expect(gameboard.getMissedCoordinates()).toEqual([[0, 0], [3, 3]]);
    });

    test('receiveAttack() works normally when hits a ship', () => {
      const gameboard = Gameboard();
      gameboard.placeShip(4, [0, 3]);
      gameboard.receiveAttack([0, 4]);
      expect(gameboard.getShipList()[0].getMap()).toEqual([0, 'h', 0, 0]);
      gameboard.receiveAttack([0, 6]);
      expect(gameboard.getShipList()[0].getMap()).toEqual([0, 'h', 0, 'h']);
    });

    test('receiveAttack() hits the correct ship if multiple ships are present', () => {
      const gameboard = Gameboard();
      gameboard.placeShip(4, [0, 3]);
      gameboard.placeShip(3, [3, 3]);
      gameboard.receiveAttack([3, 4]);
      expect(gameboard.getShipList()[1].getMap()).toEqual([1, 'h', 1]);
    });
  });

  describe('reportAllSunk()', () => {
    test('reportAllSunk() works normally', () => {
      const gameboard = Gameboard();
      gameboard.placeShip(2, [0, 3]);
      gameboard.receiveAttack([0, 4]);
      expect(gameboard.reportAllSunk()).toBeFalsy();
      gameboard.receiveAttack([0, 3]);
      expect(gameboard.reportAllSunk()).toBeTruthy();
    });

    test('reportAllSunk() works with multiple ships', () => {
      const gameboard = Gameboard();
      gameboard.placeShip(1, [0, 0]);
      gameboard.placeShip(1, [9, 9]);
      gameboard.receiveAttack([0, 0]);
      expect(gameboard.reportAllSunk()).toBeFalsy();
      gameboard.receiveAttack([9, 9]);
      expect(gameboard.reportAllSunk()).toBeTruthy();
    });
  });
});

describe('Player()', () => {
  describe('attack()', () => {
    const player = Player('me');
    const ai = Player('ai');
    ai.gameboard = Gameboard();
    ai.gameboard.placeShip(3, [0, 0]);

    test('attack() works normally', () => {
      player.attack(ai.gameboard, [0, 0]);
      expect(ai.gameboard.getShipList()[0].getMap()).toEqual(['h', 0, 0]);
    });

    test('attack() works on multiple ships', () => {
      ai.gameboard.placeShip(1, [1, 1]);
      player.attack(ai.gameboard, [0, 1]);
      player.attack(ai.gameboard, [1, 1]);
      expect(ai.gameboard.getShipList()[0].getMap()).toEqual(['h', 'h', 0]);
      expect(ai.gameboard.getShipList()[1].getMap()).toEqual(['h']);
    });

    test('attack() also trigers pushing into _attackedCoordinates and _missedCoordinate', () => {
      player.attack(ai.gameboard, [2, 2]);
      expect(ai.gameboard.getAttackedCoordinates()).toEqual([[0, 0], [0, 1], [1, 1], [2, 2]]);
      expect(ai.gameboard.getMissedCoordinates()).toEqual([[2, 2]]);
    });
  });

  describe('aiAttack()', () => {
    const player = Player('me');
    const ai = Player('ai');
    player.gameboard = Gameboard();
    player.gameboard.placeShip(3, [0, 0]);

    test('aiAttack() works normally', () => {
      ai.aiAttack(player.gameboard);
      // console.log(player.gameboard.getAttackedCoordinates());
      expect(player.gameboard.getAttackedCoordinates().length).toBe(1);
    });

    test('aiAttack() does not attack twice the same coordinate', () => {
      ai.aiAttack(player.gameboard);
      // console.log(player.gameboard.getAttackedCoordinates());
      expect(player.gameboard.getAttackedCoordinates().length).toBe(2);
    });
  });

  // describe('aiNextAttack()', () => {
  //   const player = Player('me');
  //   const ai = Player('ai');
  //   player.gameboard = Gameboard();

  //   test('aiNextAttack() works normally', () => {
  //     expect(ai.aiNextAttack(player.gameboard, [5, 5])).toEqual([[4, 5], [6, 5], [5, 4], [5, 6]]);
  //   });

  //   test('aiNextAttack() works well with edge cases', () => {
  //     expect(ai.aiNextAttack(player.gameboard, [0, 1])).toEqual([[1, 1], [0, 0], [0, 2]]);
  //     expect(ai.aiNextAttack(player.gameboard, [9, 9])).toEqual([[8, 9], [9, 8]]);
  //   });
  // });
});