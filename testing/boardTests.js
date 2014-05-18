(function() {
  module('sync Module', {
    setup: function() {
    },
    teardown: function() {
    }
  });

  test("shiftBoard('down')", function() {
    board._private.setBoard([
      [2, 0, 3, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]);
    board._private.shiftBoard('down');
    deepEqual(board._private.getBoard(), [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 3, 0],
      [1, 1, 1, 1]
    ]);
  });

  test("shiftBoard('up')", function() {
    board._private.setBoard([
      [2, 0, 3, 0],
      [0, 1, 0, 0],
      [1, 0, 1, 0],
      [0, 0, 0, 1]
    ]);
    board._private.shiftBoard('up');
    deepEqual(board._private.getBoard(), [
      [2, 1, 3, 1],
      [1, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  test('getLocation()', function() {
    board.initialize({boardWidth: 100, padding: 5, tilesPerSide: 4});

    equal(board._private.getLocation(0), 5);
    equal(board._private.getLocation(1), 28.75);
    equal(board._private.getLocation(2), 52.5);
    equal(board._private.getLocation(3), 76.25);
  });
})();