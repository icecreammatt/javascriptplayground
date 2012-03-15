console.log('Hello World');

var config = {
  canvasId: 'canvas',
  width: 1280,
  height: 720,
  backgroundColor: '#CCC'
};

(function(){
    var canvas,
        context,
        WIDTH,
        HEIGHT,
        backgroundColor;
    
    (function init() {
        WIDTH = config.width;
        HEIGHT = config.height;
        canvas = document.getElementById(config.canvasId);
        context = canvas.getContext('2d');
        backgroundColor = config.backgroundColor;
        
        context.fillStyle = backgroundColor;
        context.fillRect(0,0,WIDTH,HEIGHT);
    }());
    
}(config));