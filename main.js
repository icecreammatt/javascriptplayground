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
        players = [],
        tiles = [];

    function init() {
        WIDTH = config.width;
        HEIGHT = config.height;
        canvas = document.getElementById(config.canvasId);
        context = canvas.getContext('2d');
        backgroundColor = config.backgroundColor;
        squareSize = config.squareSize;
        grideLineSize = config.grideLineSize;

        createMap();

        clearScreen();

    };
    init();

    function createMap() {
      var rows = HEIGHT / squareSize;
      var columns = WIDTH / squareSize;
      var tileColumn = [];

      for (var y = 0, len = rows; y < len; y++){
        for (var x = 0, len = columns; x < len; x++){
          tileColumn.push(Tile(x,y,'floor'));
        };
        tiles.push(tileColumn);
        tileColumn = [];
      };

    };

    function clearScreen() {
      context.fillStyle = backgroundColor;
      context.fillRect(0,0, WIDTH, HEIGHT);
    };

    function drawSquare(x, y, color) {
      context.fillStyle = color || 'blue';
      context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    };

    function drawCircle(x, y, color) {
      context.beginPath();
      context.arc(x * squareSize + squareSize/2, y * squareSize + squareSize/2, squareSize/2, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = color;
      context.stroke();
    }

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
      //drawGrid();
      drawTiles();
      drawPlayers();
    }

    function update() {
      // Update logic
      window.requestAnimationFrame(update);
      players.forEach(function(player){
        player.update();
      });

      render();
    }

    function start() {
      update();
    }

    function Tile(x,y,type) {

      var _type = null,
          _color = 'black',
          _occupied = false,
          _position = { x: 0, y: 0 };

      setType(type);
      _position.x = x || 0;
      _position.y = y || 0;

      function setOccupied(val) {
        _occupied = val;
      }

      function isOccupied() {
        return !!_occupied;
      }

      function setType(type) {
        _type = type || 'floor';
        _occupied = false;
        switch (type) {
          case 'wall':
            _color = 'brown'
            _occupied = true;
            break;
          case 'water':
            _color = 'blue';
            _occupied = true;
            break;
          case 'door':
            _color = 'purple';
            _occupied = true;
            break;
          case 'stairs':
            _color = 'pink';
            _occupied = true;
            break;
          case 'floor':
            _color = 'gray';
            _occupied = false;
            break;
          default:
            _color = 'black';
            _occupied = true;
            break;
          }
      }

      function getColor() {
        return _occupied ? 'black' : _color;
      }

      function render() {
        drawSquare(_position.x, _position.y, getColor());
      }

      return {
        render: render,
        type: _type,
        position: _position,
        setOccupied: setOccupied,
        isOccupied: isOccupied
      };
    };

    function Character(name, color) {
      var position = { x: 0, y: 0 };

      var type = null;
      var currentPosition = null;
      var velocity = 2;
      var lastDirection = null;

      var setPosition = function(x,y) {
        if(canMove) {
          if(!!currentPosition) {
            currentPosition.setOccupied(false);
          }
          currentPosition = tiles[y][x];
          currentPosition.setOccupied(true);

          position.x = x;
          position.y = y;
        }

      }

      var render = function() {
        // drawSquare(position.x, position.y, color);
        drawCircle(position.x, position.y, color);
      }

      var update = function() {

        //if bullet or velocity > 1
        if(!!lastDirection && velocity > 1) {
          var collisionPoint = getCollision(lastDirection);
          move(lastDirection);
          if(lastDirection === 'left' && position.y === collisionPoint.y) {
            if(position.x <= collisionPoint.x) {
              setPosition(collisionPoint.x, position.y);
              // velocity = 1;
            }
          }
          if(lastDirection === 'right') {
            if(position.x >= collisionPoint.x && position.y === collisionPoint.y) {
              setPosition(collisionPoint.x, position.y);
              // velocity = 1;
            }
          }
          if(lastDirection === 'down') {
            if(position.y >= collisionPoint.y && position.x === collisionPoint.x) {
              setPosition(position.x, collisionPoint.y);
              velocity = 1;
            }
          }
          if(lastDirection === 'up') {
            if(position.y <= collisionPoint.y && position.x === collisionPoint.x) {
              setPosition(position.x, collisionPoint.y);
              velocity = 1;
            }
          }
        }
      }

      var getPosition = function() {
        return position;
      }

      var getCollision = function(direction) {
        var xstart = position.x;
        var ystart = position.y;

        var moveX = 0;
        var moveY = 0;

        if(direction === 'up') {
          moveY = -1;
        }
        else if(direction === 'down') {
          moveY = 1;
        }
        else if(direction === 'left') {
          moveX = -1;
        }
        else if(direction === 'right') {
          moveX = 1;
        }

        var objectCanMove = true;
        while(objectCanMove) {
          objectCanMove = canMove(xstart += moveX, ystart += moveY);
        }
        return { x: xstart, y: ystart }
      }

      //assumes integer values
      var canMove = function(x,y) {
        var result = false;
        if(position.y + y >= 0 &&
           position.x + x >= 0 &&
           position.y + y < tiles.length &&
           !!tiles[position.y + y] &&
           position.x + x < tiles[position.y + y].length &&
           !!tiles[position.y + y][position.x + x]) {

          // Move this logic out of canMove
          var tile = tiles[position.y + y][position.x + x];
          occupied = tile.isOccupied();
          if(!occupied) {
            return true;
          }
        }
        return false;
      }

      var move = function(direction) {
        switch (direction) {
          case 'up':
            if(canMove(0, -1 * velocity))
              setPosition(position.x, position.y - 1 * velocity);
            break;
          case 'down':
            if(canMove(0, 1 * velocity))
              setPosition(position.x, position.y + 1 * velocity);
            break;
          case 'left':
            if(canMove(-1 * velocity, 0))
              setPosition(position.x - 1 * velocity, position.y);
            break;
          case 'right':
            if(canMove(1 * velocity, 0))
              setPosition(position.x + 1 * velocity, position.y);
            break;
          default:
            break;
          }
          lastDirection = direction;
      };

      return {
        name: name,
        color: color,
        setPosition: setPosition,
        getPosition: getPosition,
        render: render,
        update: update,
        move: move,
        velocity: velocity
      }
    };

    function drawPlayers() {
      for(var i = 0; i < players.length; i++) {
        players[i].render();
      }
    };

    function drawTiles() {
      var rows = HEIGHT / squareSize;
      var columns = WIDTH / squareSize;

      for (var y = 0, len = rows; y < len; y++){
        for (var x = 0, len = columns; x < len; x++){
          tiles[y][x].render();
        };
      };
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
      tiles: tiles,
      start: start
    };

}(config));


g.start();

g.addPlayer('matt', 'blue');
g.addPlayer('chris', 'red');
g.addPlayer('stephen', 'green');

var matt = g.players[0];
g.players[1].setPosition(12,10);
g.players[2].setPosition(7,16);


key('w', function() { matt.move('up'); });
key('a', function() { matt.move('left'); });
key('s', function() { matt.move('down'); });
key('d', function() { matt.move('right'); });