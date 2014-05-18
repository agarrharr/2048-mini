$(function() {
  board.initialize({boardWidth: 100, padding: 5, tilesPerSide: 4});
  board.createSvg();
  board.drawBackground();
  board.drawBoard();

  d3.select('#upButton').on("click", function () {
    board.move('up');
  });
  d3.select('#downButton').on("click", function () {
    board.move('down');
  });
  d3.select('#leftButton').on("click", function () {
    board.move('left');
  });
  d3.select('#rightButton').on("click", function () {
    board.move('right');
  });
});