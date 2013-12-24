var config = {
  canvasId: 'canvas',
  width: 600,
  height: 600,
  backgroundColor: '#CCC',
  squareSize: 25,
  grideLineSize: 1
};

var g = (function(){
  "using strict";
    var canvas,
        context,
        WIDTH,
        HEIGHT,
        backgroundColor,
        squareSize,
        grideLineSize,
        players = []

    function init() {
        WIDTH = config.width;
        HEIGHT = config.height;
        canvas = document.getElementById(config.canvasId);
        context = canvas.getContext('2d');
        backgroundColor = config.backgroundColor;
        squareSize = config.squareSize;
        grideLineSize = config.grideLineSize;

        clearScreen();
    };
    init();

    function clearScreen() {
      context.fillStyle = backgroundColor;
      context.fillRect(0,0, WIDTH, HEIGHT);
    };

    function drawSquare(x, y, color) {
      context.fillStyle = color || 'blue';
      context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    };

    function drawGrid() {
      var rows = HEIGHT / squareSize;
      var columns = WIDTH / squareSize;
      context.fillStyle = 'gray';

      // Draw Rows
      for(var y = 0; y < rows; y++) {
          context.fillRect(0, y * squareSize, WIDTH, grideLineSize);
      }

      // Draw Columns
      for(var x = 0; x < columns; x++) {
          context.fillRect(x * squareSize, 0, grideLineSize, HEIGHT);
      }
    };

    function render() {
      // Render all items on the screen
      clearScreen();
      drawGrid();
      drawPlayers();
    }

    function update() {
      // Update logic
      window.requestAnimationFrame(update);
      render();
    }

    function start() {
      update();
    }

    function Character(name, color) {
      var position = { x: 0, y: 0 };

      var move = function(direction) {
        switch (direction) {
          case 'up':
            position.y -= 1;
            break;
          case 'down':
            position.y += 1;
            break;
          case 'left':
            position.x -= 1;
            break;
          case 'right':
            position.x += 1;
            break;
          default:
            break;
          }
      };

      return {
        name: name,
        color: color,
        position: position,
        move: move
      }
    };

    function drawPlayers() {
      for(var i = 0; i < players.length; i++) {
        drawSquare(players[i].position.x,
          players[i].position.y,
          players[i].color);
      }
    };

    function addPlayer(name, color) {
      var character = Character(name,color);
      players.push(character);
    };

    return {
      clearScreen: clearScreen,
      drawGrid: drawGrid,
      drawSquare: drawSquare,
      render: render,
      update: update,
      addPlayer: addPlayer,
      players: players,
      start: start
    };

}(config));


g.start();

g.addPlayer('matt', 'blue');
g.addPlayer('chris', 'red');
g.addPlayer('stephen', 'green');

var matt = g.players[0];
g.players[1].position.x = 12;
g.players[1].position.y = 10;

g.players[2].position.x = 7;
g.players[2].position.y = 16;

key('w', function() { matt.move('up'); });
key('a', function() { matt.move('left'); });
key('s', function() { matt.move('down'); });
key('d', function() { matt.move('right'); });