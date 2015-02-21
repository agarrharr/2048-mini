$(function() {
  board.drawBoard();
  $('body').on("keyup", function (e) {
    switch(e.keyCode) {
      case 37:
        board.move('left');
        break;
      case 38:
        board.move('up');
        break;
      case 39:
        board.move('right');
        break;
      case 40:
        board.move('down');
        break;
      default:
        break;
    }
  });
  $('a.restart-button').on('click', function() {
    board.restart();
  });
});

