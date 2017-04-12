var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var CANVAS_MID_X;
var CANVAS_MID_Y;
var WHEEL_PERCENTAGE = .85;
var WHEEL_RADIUS;
var ROTATION_RESISTANCE =  -45;

var lastTime;
var delta;
var runTime = 0.0;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var wedgeColorA = "#AAAAAA";
var wedgeColorB = "#CCCCCC";
var wedgeColorC = "#BBBBBB";
var wedges = 7;
var wedgeSubdiv;
var wheelRotation = 90;
var rotationSpeed = 450;

function setup() {
  CANVAS_WIDTH = canvas.width;
  CANVAS_HEIGHT = canvas.height;
  CANVAS_MID_X = CANVAS_WIDTH / 2;
  CANVAS_MID_Y = CANVAS_HEIGHT / 2;
  WHEEL_RADIUS = CANVAS_MID_X * WHEEL_PERCENTAGE;
  lastTime = Date.now();
  wedgeSubdiv = 360 / wedges;
  loop();
}

function fillColor(color) {
  context.fillStyle = color;
}

function strokeColor(color) {
  context.strokeStyle = color;
}

function degRad(deg) {
  return deg * (Math.PI / 180);
}

function loop() {
  var now = Date.now();
  delta = (now - lastTime) / 1000;
  if (delta > 0) {
    runTime += delta;
    wheelRotation += delta * rotationSpeed;
  }
  lastTime = Date.now();

  var x;
  var y;
  var wedgeRotation;
  for (var i = 0; i <= wedges; i++) {
    context.beginPath();
    wedgeRotation = i * wedgeSubdiv + wheelRotation;
    x = CANVAS_MID_X + Math.cos(degRad(wedgeRotation)) * WHEEL_RADIUS;
    y = CANVAS_MID_Y + Math.sin(degRad(wedgeRotation)) * WHEEL_RADIUS;

    context.moveTo(CANVAS_MID_X, CANVAS_MID_Y);

    if (wedges % 2 != 0) {
      if (i % 3 == 0) {
        fillColor(wedgeColorA);
      } else if (i % 3 == 1) {
        fillColor(wedgeColorB);
      }else if (i % 3 == 2) {
        fillColor(wedgeColorC);
      }
    } else {
      if (i % 2 == 0) {
        fillColor(wedgeColorA);
      } else {
        fillColor(wedgeColorB);
      }
    }
    context.arc(CANVAS_MID_X, CANVAS_MID_Y, WHEEL_RADIUS, degRad(wedgeRotation), degRad(wedgeRotation + wedgeSubdiv));
    context.fill();
  }

  rotationSpeed += ROTATION_RESISTANCE * delta;
  if (rotationSpeed < 0) {
    rotationSpeed = 0;
  }
  requestAnimationFrame(loop);
}

setup();
