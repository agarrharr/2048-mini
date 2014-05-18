var board = function() {
  var tileLocations;
  var boardWidth;
  var padding;
  var pieceWidth;
  var svg;
  var square1;

  var initialize = function(options) {
    if(typeof options.boardWidth === 'undefined') { options.boardWidth = 100; }
    if(typeof options.padding === 'undefined') { options.padding = 5; }
    if(typeof options.tilesPerSide === 'undefined') { options.tilesPerSide = 4; }

    boardWidth = options.boardWidth;
    padding = options.padding;
    pieceWidth = (boardWidth - (padding * (options.tilesPerSide + 1))) / options.tilesPerSide;
    tileLocations = [
      [3, 2, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
  };

  var move = function(direction) {
    shiftBoard(direction);
    //addRandomPiece();
    drawBoard();
  };

  var shiftBoard = function(direction) {
    if(direction === 'down') {
      for(var j = 0; j < tileLocations[0].length; j++) {
        for(var i = tileLocations.length - 1; i >= 0; i--) {
          if(tileLocations[i][j] !== 0) {
            for(var k = i; k < tileLocations.length - 1; k++) {
              if(tileLocations[k+1][j] === 0) {
                tileLocations[k+1][j] = tileLocations[k][j];
                tileLocations[k][j] = 0;
              }
            }
          }
        }
      }
    }
  };

  var addRandomPiece = function() {

  };

  var drawBoard = function() {
    var colors = {
      1: '#eee4da',
      2: '#ede0c8',
      3: '#f2b179',
      4: '#f59563',
      5: '#f67c5f',
      6: '#f65e3b',
      7: '#edcf72',
      8: '#edcc61',
      9: '#edc850',
      10: '#edc53f',
      11: 'red'
    };
    for(var i = 0; i < tileLocations.length; i++) {
      for(var j = 0; j < tileLocations[i].length; j++) {
        if(tileLocations[i][j] > 0) {
          svg.append('rect')
            .transition()
            .attr('x', getLocation(j))
            .attr('y', getLocation(i))
            .attr('width', pieceWidth)
            .attr('height', pieceWidth)
            .style('fill', colors[tileLocations[i][j]]);
        }
      }
    }
  };

  var drawBackground = function() {
    var background = svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('fill', '#bbada0');

    for(var i = 0; i < 4; i++) {
      for(var j = 0; j < 4; j++) {
        svg.append('rect')
          .attr('x', getLocation(i))
          .attr('y', getLocation(j))
          .attr('width', pieceWidth)
          .attr('height', pieceWidth)
          .style('fill', 'rgba(238, 228, 218, 0.35)');
      }
    }
  };

  var createSvg = function() {
    svg = d3.select('body')
      .append('svg')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', boardWidth)
      .attr('height', boardWidth);
  };

  var getLocation = function(position) {
    return ((position + 1) * padding) + (position * pieceWidth);
  };

  var setBoard = function(locations) {
    tileLocations = locations;
  };

  var getBoard = function() {
    return tileLocations;
  };

  var public = {
    initialize: initialize,
    move: move,
    createSvg: createSvg,
    drawBackground: drawBackground,
    drawBoard: drawBoard
  };

  public._private = {
    shiftBoard: shiftBoard,
    getLocation: getLocation,
    setBoard: setBoard,
    getBoard: getBoard
  };

  return public;
}();