var board = function() {
  var initialized = false;
  var tileLocations;
  var score;
  var scoreForTurn;
  var boardWidth;
  var tilesPerSide;
  var padding;
  var pieceWidth;
  var svg;
  var square1;
  var drawOnCanvas;

  var initialize = function(options) {
    if(typeof options === 'undefined') { options = {}; }
    if(typeof options.boardWidth === 'undefined') { options.boardWidth = 500; }
    if(typeof options.padding === 'undefined') { options.padding = 15; }
    if(typeof options.tilesPerSide === 'undefined') { options.tilesPerSide = 4; }
    if(typeof options.drawOnCanvas === 'undefined') { options.drawOnCanvas = true; }

    boardWidth = options.boardWidth;
    tilesPerSide = options.tilesPerSide;
    padding = options.padding;
    pieceWidth = (boardWidth - (padding * (options.tilesPerSide + 1))) / options.tilesPerSide;
    drawOnCanvas = options.drawOnCanvas;
    tileLocations = [
      [{value: 0}, {value: 0}, {value: 0}, {value: 0}],
      [{value: 0}, {value: 0}, {value: 0}, {value: 0}],
      [{value: 0}, {value: 2}, {value: 0}, {value: 0}],
      [{value: 0}, {value: 0}, {value: 1}, {value: 0}]
    ];
    score = 0;

    initialized = true;
  };

  var move = function(direction) {
    if(!initialized) { initialize(); }

    if(shiftBoard(direction)) {
      setTimeout(addRandomPiece, 100);
    }
  };

  var shiftBoard = function(direction) {
    var shifted = false;
    var i, j, k;
    var innerStart, innerEnd, innerIncrement;
    var backwardsLoopStart, backwardsLoopEnd, backwardsLoopIncrement;
    var currentValue;
    var coordinates;
    var furthestBack;
    scoreForTurn = 0;

    if(direction === 'down' || direction === 'right') {
      innerStart = function() { return tileLocations.length - 1; };
      innerEnd = function() { return i >= 0; };
      innerIncrement = function() { i--; };
      backwardsLoopStart = function() { return i; };
      backwardsLoopEnd = function() { return k < tileLocations.length - 1; };
      backwardsLoopIncrement = function() { k++; };
    } else if(direction === 'up' || direction === 'left') {
      innerStart = function() { return 0; };
      innerEnd = function() { return i < tileLocations.length; };
      innerIncrement = function() { i++; };
      backwardsLoopStart = function() { return i; };
      backwardsLoopEnd = function() { return k > 0; };
      backwardsLoopIncrement = function() { k--; };
    }
    if(direction === 'up' || direction === 'down') {
      coordinates = function() { return {x: j, y: k}; };
      currentValue = function() { return tileLocations[i][j].value; };
    } else if(direction === 'left' || direction === 'right') {
      coordinates = function() { return {x: k, y: j}; };
      currentValue = function() { return tileLocations[j][i].value; };
    }
    for(j = 0; j < tileLocations.length; j++) {
      furthestBack = undefined;
      for(i = innerStart(); innerEnd(); innerIncrement()) {
        if(currentValue() !== 0) {
          for(k = backwardsLoopStart(); backwardsLoopEnd(); backwardsLoopIncrement()) {
            if(typeof furthestBack !== undefined && furthestBack === k) {
              break;
            }
            var results = movePiece(coordinates(), direction);
            if(results.shifted) {
              shifted = true;
              if(results.combined) {
                furthestBack = k;
                break;
              }
            }
          }
        }
      }
    }
    incrementScore();

    return shifted;
  };

  var movePiece = function(from, direction) {
    var to = getNewLocation(from, direction);
    var newLocationIsEmpty = tileLocations[to.y][to.x].value === 0;
    var newLocationisTheSameValue = tileLocations[to.y][to.x].value === tileLocations[from.y][from.x].value;

    if(newLocationIsEmpty) {
      tileLocations[to.y][to.x].value = tileLocations[from.y][from.x].value;
      tileLocations[from.y][from.x].value = 0;

      if(typeof tileLocations[from.y][from.x].rect !== 'undefined') {
        tileLocations[from.y][from.x].rect.select('rect')
          .transition()
            .attr('x', getLocation(to.x))
            .attr('y', getLocation(to.y));
        tileLocations[from.y][from.x].rect.select('text')
          .transition()
            .attr('x', getLocation(to.x) + pieceWidth / 2)
            .attr('y', getLocation(to.y) + pieceWidth / 2 + 20);
        tileLocations[to.y][to.x].rect = tileLocations[from.y][from.x].rect;
        tileLocations[from.y][from.x].rect = undefined;
      }
      return {shifted: true, combined: false};
    } else if(newLocationisTheSameValue) {
      tileLocations[to.y][to.x].value++;
      tileLocations[from.y][from.x].value = 0;

      incrementScoreForTurn(tileLocations[to.y][to.x].value);

      if(typeof tileLocations[to.y][to.x].rect !== 'undefined') {
        tileLocations[to.y][to.x].rect.select('rect')
          .transition()
            .attr('width', 0)
            .attr('height', 0);
        tileLocations[to.y][to.x].rect.select('text')
          .transition()
            .text('')
            .attr('fill', 'none');
        tileLocations[to.y][to.x].rect = undefined;
      }

      if(typeof tileLocations[from.y][from.x].rect !== 'undefined') {
        tileLocations[from.y][from.x].rect.select('rect')
          .transition()
            .attr('x', getLocation(to.x))
            .attr('y', getLocation(to.y))
            .style('fill', getColorFromValue(tileLocations[to.y][to.x].value));
        tileLocations[from.y][from.x].rect.select('text')
          .transition()
            .text(getNumberFromValue(tileLocations[to.y][to.x].value))
            .attr('x', getLocation(to.x) + pieceWidth / 2)
            .attr('y', getLocation(to.y) + pieceWidth / 2 + 20);
        tileLocations[to.y][to.x].rect = tileLocations[from.y][from.x].rect;
        tileLocations[from.y][from.x].rect = undefined;
      }
      return {shifted: true, combined: true};
    } else {
      return {shifted: false, combined: false};
    }
  };

  var getNewLocation = function(from, direction) {
    var alterDirection = {
      "up": function(location) {
        return {x: location.x, y: location.y - 1};
      },
      "down": function(location) {
        return {x: location.x, y: location.y + 1};
      },
      "left": function(location) {
        return {x: location.x - 1, y: location.y};
      },
      "right": function(location) {
        return {x: location.x + 1, y: location.y};
      },
    };
    return alterDirection[direction](from);
  };

  var addRandomPiece = function() {
    var newLocation = getRandomEmptyTile();
    if(locationIsEmpty(newLocation)) {
      var value = getRandomValue();
      tileLocations[newLocation.y][newLocation.x].value = value;
      drawTile({x: newLocation.x, y: newLocation.y}, value);
    } else {
      addRandomPiece();
    }
  };

  var getRandomValue = function() {
    return random(1, 2);
  };

  var getRandomEmptyTile = function() {
    return {x: random(0, tilesPerSide - 1), y: random(0, tilesPerSide - 1)};
  };

  var random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var locationIsEmpty = function(location) {
    return tileLocations[location.y][location.x].value === 0;
  };

  var drawBoard = function() {
    if(!initialized) { initialize(); }
    createSvg();
    drawBackground();

    for(var i = 0; i < tileLocations.length; i++) {
      for(var j = 0; j < tileLocations[i].length; j++) {
        if(tileLocations[i][j].value > 0) {
          drawTile({x: j, y: i}, tileLocations[i][j].value);
        }
      }
    }
  };

  var drawTile = function(location, value) {
    if(drawOnCanvas) {
      tileLocations[location.y][location.x].rect = svg.append('g');
      tileLocations[location.y][location.x].rect.append('rect')
        .style('fill', getColorFromValue(tileLocations[location.y][location.x].value))
        .attr('x', getLocation(location.x) + pieceWidth / 2 - 15)
        .attr('y', getLocation(location.y) + pieceWidth / 2 + 20)
        .attr('width', 0)
        .attr('height', 0)
        .attr('rx', 5)
        .attr('ry', 5);
      tileLocations[location.y][location.x].rect.append('text')
        .text(getNumberFromValue(tileLocations[location.y][location.x].value))
        .style('fill', '#776e65')
        .style('font-size', '50px')
        .attr('text-anchor', 'middle')
        .attr('x', getLocation(location.x) + pieceWidth / 2)
        .attr('y', getLocation(location.y) + pieceWidth / 2 + 20);
      tileLocations[location.y][location.x].rect.select('rect')
        .transition()
          .attr('x', getLocation(location.x))
          .attr('y', getLocation(location.y))
          .attr('width', pieceWidth)
          .attr('height', pieceWidth);
    }
  };

  var drawBackground = function() {
    var background = svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('rx', 5)
      .attr('ry', 5)
      .style('fill', '#bbada0');

    for(var i = 0; i < tilesPerSide; i++) {
      for(var j = 0; j < tilesPerSide; j++) {
        svg.append('rect')
          .attr('x', getLocation(i))
          .attr('y', getLocation(j))
          .attr('width', pieceWidth)
          .attr('height', pieceWidth)
          .attr('rx', 5)
          .attr('ry', 5)
          .style('fill', 'rgba(238, 228, 218, 0.35)');
      }
    }
  };

  var incrementScore = function(value) {
    score += scoreForTurn;
    $('.score-container').html(score);
  };

  var incrementScoreForTurn = function(value) {
    scoreForTurn += getNumberFromValue(value);
  };

  var createSvg = function() {
    svg = d3.select('.game-container')
      .append('svg')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', boardWidth)
      .attr('height', boardWidth);
  };

  var getLocation = function(position) {
    return ((position + 1) * padding) + (position * pieceWidth);
  };

  var getColorFromValue = function(value) {
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
    return colors[value];
  };

  var getNumberFromValue = function(value) {
    var numbers = {
      1: 2,
      2: 4,
      3: 8,
      4: 16,
      5: 32,
      6: 64,
      7: 128,
      8: 256,
      9: 512,
      10: 1024,
      11: 2048
    };
    return numbers[value];
  };

  var setBoard = function(locations) {
    var row = [];
    tileLocations = [];
    for(var i = 0; i < locations.length; i++) {
      for(var j = 0; j < locations[i].length; j++) {
        row.push({value: locations[i][j]});
      }
      tileLocations.push(row);
      row = [];
    }
  };

  var getBoard = function() {
    var simplifiedTileLocations = [];
    var row = [];
    for(var i = 0; i < tileLocations.length; i++) {
      for(var j = 0; j < tileLocations[i].length; j++) {
        row.push(tileLocations[i][j].value);
      }
      simplifiedTileLocations.push(row);
      row = [];
    }
    return simplifiedTileLocations;
  };

  var getTileLocations = function() {
    return tileLocations;
  };

  var getScore = function() {
    return score;
  };

  var public = {
    move: move,
    drawBoard: drawBoard
  };

  public._private = {
    initialize: initialize,
    shiftBoard: shiftBoard,
    movePiece: movePiece,
    getNewLocation: getNewLocation,
    getLocation: getLocation,
    setBoard: setBoard,
    getBoard: getBoard,
    getTileLocations: getTileLocations,
    getScore: getScore
  };

  return public;
}();