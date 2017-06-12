var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var CANVAS_MID_X;
var CANVAS_MID_Y;
var WHEEL_PERCENTAGE = .85;
var WHEEL_RADIUS;
var ROTATION_RESISTANCE =  -45;
var ENTER_KEY = 13;
var MAX_ROTATION_SPEED = 450;

var lastTime;
var delta;
var runTime = 0.0;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var wedgeColorA = "#AAAAAA";
var wedgeColorB = "#BBBBBB";
var wedgeColorC = "#CCCCCC";
var wedgeSubdiv;
var wheelRotation = 90;
var rotationSpeed = 0;

var btn_addWedge = document.getElementById("add-wedge");
var wedge_input = document.getElementById("wedge-input");
var wedge_list = document.getElementById("wedge-list");
var templates = document.getElementById("templates");
var spin_wheel = document.getElementById("spin-wheel");
var clear_list = document.getElementById("clear-list");

var name_list = [];

function setup() {
  CANVAS_WIDTH = canvas.width;
  CANVAS_HEIGHT = canvas.height;
  CANVAS_MID_X = CANVAS_WIDTH / 2;
  CANVAS_MID_Y = CANVAS_HEIGHT / 2;
  WHEEL_RADIUS = CANVAS_MID_X * WHEEL_PERCENTAGE;
  lastTime = Date.now();
  // name_list
  var saved_list = localStorage.getItem('wheel_items');
  if (saved_list && !name_list.length) {
    name_list = JSON.parse(saved_list);
  }

  if (!name_list || !name_list.length) {
    name_list = ['E.Honda', 'Chun Li', 'M.Bison', 'Ryu']
  }

  registerInputListeners();
  renderList();
  loop();
}

function refreshList() {
  renderList();
  localStorage.setItem('wheel_items', JSON.stringify(name_list));
}

function addItem() {
  if (wedge_input && !wedge_input.value) return;
  name_list.push(wedge_input.value);
  wedge_input.value = '';
  refreshList()
}

function removeItem(index) {
  name_list.splice(index, 1);
  refreshList();
}

function spinWheel() {
  rotationSpeed = MAX_ROTATION_SPEED;
}

function clearList() {
  name_list = [];
  refreshList();
}

function registerInputListeners() {
  btn_addWedge.onclick = addItem;
  wedge_input.onkeyup = function (e) {
    if (e.keyCode === ENTER_KEY) {
      addItem();
    }
  };
  spin_wheel.onclick = spinWheel;
  clear_list.onclick = clearList;
}

function renderList() {
  var record_elem = templates.getElementsByTagName('listitem')[0];
  if (record_elem && wedge_list) {
    wedge_list.innerHTML = null;
    var i = 0;
    name_list.forEach(function (elem) {
      var template = record_elem.innerHTML;
      var instance = document.createElement('div');
      instance.innerHTML = template;
      var content = instance.getElementsByClassName('content')[0];
      var button = instance.getElementsByTagName('button')[0];
      if (content && button) {
        content.innerHTML = '';
        var contentDiv = document.createElement('span');
        contentDiv.innerText = elem;
        content.appendChild(contentDiv);
        button.setAttribute('data-ID', i + '');
        button.onclick = function (e) {
          removeItem(e.target.getAttribute('data-id'));
        };
      }
      wedge_list.appendChild(instance);
      i++;
    });
  }
}

// Canvas Methods
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
  context.clearRect(0 ,0, CANVAS_WIDTH, CANVAS_HEIGHT);
  var now = Date.now();
  delta = (now - lastTime) / 1000;
  if (delta > 0) {
    runTime += delta;
    wheelRotation += delta * rotationSpeed;
  }
  lastTime = Date.now();
  wedgeSubdiv = 360 / name_list.length;

  var x;
  var y;
  var wedgeRotation;
  var list_len = name_list.length;
  for (var i = 0; i < list_len; i++) {
    context.beginPath();
    wedgeRotation = i * wedgeSubdiv + wheelRotation;
    x = CANVAS_MID_X + Math.cos(degRad(wedgeRotation)) * WHEEL_RADIUS;
    y = CANVAS_MID_Y + Math.sin(degRad(wedgeRotation)) * WHEEL_RADIUS;
    context.moveTo(CANVAS_MID_X, CANVAS_MID_Y);

    var value = i % 3;
    if (list_len % 2) {
      switch (value) {
        case 0:
          fillColor(wedgeColorA);
          break;
        case 1:
          fillColor(wedgeColorB);
          break;
        case 2:
          fillColor(wedgeColorC);
          break;
      }
    } else {
      fillColor( i % 2 ? wedgeColorA : wedgeColorB);
    }
    context.arc(CANVAS_MID_X, CANVAS_MID_Y, WHEEL_RADIUS, degRad(wedgeRotation), degRad(wedgeRotation + wedgeSubdiv));
    context.fill();
  }

  for (i = 0; i < name_list.length; i++) {
    context.beginPath();
    wedgeRotation = (i * wedgeSubdiv + wheelRotation) + wedgeSubdiv / 2;
    context.textAlign = "center";
    context.font = "26px Josefin Sans";
    fillColor("#FFFFFF");
    context.fillText(name_list[i], CANVAS_MID_X + Math.cos(degRad(wedgeRotation)) * (WHEEL_RADIUS * .75), CANVAS_MID_Y + Math.sin(degRad(wedgeRotation)) * (WHEEL_RADIUS * .75));
  }

  fillColor("#000000");
  context.beginPath();
  context.moveTo(CANVAS_WIDTH / 2 + 45, 25);
  context.lineTo(CANVAS_WIDTH / 2 - 45, 25);
  context.lineTo(CANVAS_WIDTH / 2, 65);
  context.fill();
  rotationSpeed += ROTATION_RESISTANCE * delta;
  if (rotationSpeed < 0) {
    rotationSpeed = 0;
  }
  requestAnimationFrame(loop);
}

setup();
