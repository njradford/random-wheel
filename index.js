var names = ["Nixon", "Dixon", "Layer"];
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var wedgeColorA = "#FFFFFF";
var wedgeColorB = "#FFFFFF";
var wheelRotation = 90;
var rectX = 0;
var rectSpeed = 100;

var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var lastTime;
var delta;
var runTime = 0.0;

function setup() {
  CANVAS_WIDTH = canvas.width;
  CANVAS_HEIGHT = canvas.height;
  loop();
  lastTime = Date.now();
}

function fill(color) {
  context.fillStyle = color;
}

function loop() {
  var now = Date.now();
  delta = (now - lastTime) / 1000;
  if (delta > 0) {
    runTime += delta;
    rectX += delta * rectSpeed;
  }

  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  fill("#000000");
  context.fillRect(rectX, rectX, 40, 40);
  lastTime = Date.now();
  requestAnimationFrame(loop);
}

setup();
