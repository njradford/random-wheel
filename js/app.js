var CANVAS_MID_X;
var CANVAS_MID_Y;
var WHEEL_PERCENTAGE = .975;
var WHEEL_RADIUS;
var ROTATION_RESISTANCE =  -45;
var ENTER_KEY = 13;
var MAX_ROTATION_SPEED = 450;

var lastTime;
var delta;
var runTime = 0.0;
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var wedgeColorA = '#AAAAAA';
var wedgeColorB = '#BBBBBB';
var wedgeColorC = '#DDDDDD';
var wedgeColorD = '#CCCCCC';
var wedgeSubdiv;
var wheelRotation = 90;
var rotationSpeed = 0;

var btn_addWedge = document.getElementById('add-wedge');
var wedge_input = document.getElementById('wedge-input');
var wedge_list = document.getElementById('wedge-list');
var spin_wheel = document.getElementById('spin-wheel');
var clear_list = document.getElementById('clear-list');
var copy_link = document.getElementById('copy-link');
var templates = document.getElementById('templates');
var clipboard = document.getElementById('clipboard');


var mobile_break = 425;
var desktop_canvas_size = 500;
var mobile_canvas_size = 500;
var wedge_text_position = .65; // Distance Along Radius

var nameList = [];
var name_lists = [
  ['E.Honda', 'Chun Li', 'M.Bison', 'Cammy'],
  ['Ringo', 'George', 'John', 'Paul'],
  ['Roy', 'Gee', 'Biv'],
  ['Tina', 'Chris', 'David', 'Jerry'],
  ['Like This', 'Like That'],
  ['Mystery', 'Comedy', 'Action', 'Drama'],
  ['Charmander', 'Squirtle', 'Bulbasaur'],
  ['Rock', 'Paper', 'Scissors']
];

var blank_message = 'Add some values in the pane.';
var is_mobile = false;
var last_width = 0;
var dirty = false;

function setup() {
  clipboard.style.opacity = 0;
  clipboard.style.width = 0;
  clipboard.style.height = 0;
  CANVAS_MID_X = canvas.width / 2;
  CANVAS_MID_Y = canvas.height / 2;
  WHEEL_RADIUS = CANVAS_MID_X * WHEEL_PERCENTAGE;
  lastTime = Date.now();

  var saved_list = JSON.parse(localStorage.getItem('wheel_items'));

  if (!saved_list || !saved_list.length) {
    nameList = name_lists[getRandomInt(0, name_lists.length)];
  } else {
    nameList = saved_list;
  }

  var hash = window.location.hash;
  var hashString = hash.substr(1, hash.length - 1);
  if (hashString.length) {
    var queryList = JSON.parse(decodeURIComponent(hashString));
    if (queryList.length) {
      nameList = queryList;
    }
  }

  checkIfMobile();
  resizeCanvas();
  registerInputListeners();
  renderList();
  loop();
  refreshList();
}

function refreshList() {
  renderList();
  if (!dirty) {
    dirty = true;
  } else {
    localStorage.setItem('wheel_items', JSON.stringify(nameList));
  }
}

function addItem() {
  if (wedge_input && !wedge_input.value) return;
  nameList.push(wedge_input.value);
  wedge_input.value = '';
  refreshList()
}

function removeItem(index) {
  nameList.splice(index, 1);
  refreshList();
}

function spinWheel() {
  rotationSpeed += (MAX_ROTATION_SPEED / 2) * (Math.random() * (1.75 - .75) + .75);
  rotationSpeed = rotationSpeed > MAX_ROTATION_SPEED ? MAX_ROTATION_SPEED : rotationSpeed;
}

function clearList() {
  nameList = [];
  refreshList();
}

function copyLink() {
  clipboard.innerText = encodeURI( window.location.href + '#' + JSON.stringify(nameList) );
  clipboard.select();
  document.execCommand('copy');
  clipboard.blur();
}

function resizeCanvas() {
  canvas.width = is_mobile ? mobile_canvas_size : desktop_canvas_size;
  canvas.height = is_mobile ? mobile_canvas_size : desktop_canvas_size;
  canvas.style.width = is_mobile ? mobile_canvas_size : desktop_canvas_size;
  canvas.style.height = is_mobile ? mobile_canvas_size : desktop_canvas_size;
  CANVAS_MID_X = canvas.width / 2;
  CANVAS_MID_Y = canvas.height / 2;
  WHEEL_RADIUS = CANVAS_MID_X * WHEEL_PERCENTAGE;
}

function checkIfMobile() {
  is_mobile = window.innerWidth < mobile_break;
  if (last_width > mobile_break && is_mobile) {
    resizeCanvas();
  }

  if (last_width < mobile_break && !is_mobile) {
    resizeCanvas();
  }

  last_width = window.innerWidth;
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
  copy_link.onclick = copyLink;
}

function renderList() {
  var record_elem = templates.getElementsByTagName('listitem')[0];
  if (record_elem && wedge_list) {
    wedge_list.innerHTML = null;
    var i = 0;
    nameList.forEach(function (elem) {
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
        button.setAttribute('data-id', i + '');
        button.onclick = function (e) {
          var id = e.target.getAttribute('data-id');
          if (!id) {
            id = e.target.parentNode.getAttribute('data-id');
          }
          removeItem(id);
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
  checkIfMobile();
  context.clearRect(0 ,0, canvas.width, canvas.height);
  var now = Date.now();
  delta = (now - lastTime) / 1000;
  if (delta > 0) {
    runTime += delta;
    wheelRotation += delta * rotationSpeed;
  }
  lastTime = Date.now();
  wedgeSubdiv = 360 / nameList.length;

  var x;
  var y;
  var wedgeRotation;
  var list_len = nameList.length;
  for (var i = 0; i < list_len; i++) {
    context.beginPath();
    wedgeRotation = i * wedgeSubdiv + wheelRotation;
    x = CANVAS_MID_X + Math.cos(degRad(wedgeRotation)) * WHEEL_RADIUS;
    y = CANVAS_MID_Y + Math.sin(degRad(wedgeRotation)) * WHEEL_RADIUS;
    context.moveTo(CANVAS_MID_X, CANVAS_MID_Y);

    strokeColor('#CDCDCD');
    switch (i % 3) {
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

    if (i === list_len - 1) {
      fillColor(wedgeColorD);
    }

    context.arc(CANVAS_MID_X, CANVAS_MID_Y, WHEEL_RADIUS, degRad(wedgeRotation), degRad(wedgeRotation + wedgeSubdiv));
    context.fill();
    if (i !== 0) {
      context.stroke();
    }
  }

  for (i = 0; i < nameList.length; i++) {
    context.beginPath();
    wedgeRotation = (i * wedgeSubdiv + wheelRotation) + wedgeSubdiv / 2;
    context.textAlign = 'center';
    context.font = canvas.width / (is_mobile ? 18 : 24) + 'px Josefin Sans';
    fillColor('#FFFFFF');
    context.save();
    context.translate(
        CANVAS_MID_X + Math.cos(degRad(wedgeRotation)) * (WHEEL_RADIUS * wedge_text_position),
        CANVAS_MID_Y + Math.sin(degRad(wedgeRotation)) * (WHEEL_RADIUS * wedge_text_position)
    );
    context.rotate(degRad(wedgeRotation + 180));
    context.fillText(nameList[i], 0, 0);
    context.restore();
  }

  fillColor('#000000');
  context.beginPath();
  context.moveTo(CANVAS_MID_X + canvas.width / 32, canvas.height / 64);
  context.lineTo(CANVAS_MID_X - canvas.width / 32, canvas.height / 64);
  context.lineTo(CANVAS_MID_X, canvas.height / 18);
  context.fill();

  if (!nameList.length) {
    context.beginPath();
    context.textAlign = 'center';
    context.font = canvas.width / (is_mobile ? 18 : 24) + 'px Josefin Sans';
    fillColor('#000000');
    context.fillText(blank_message, CANVAS_MID_X, CANVAS_MID_Y);
  } else {
    context.beginPath();
    context.arc(CANVAS_MID_X, CANVAS_MID_Y, WHEEL_RADIUS / 32, 0, 2 * Math.PI);
    context.fill();
  }

  rotationSpeed += ROTATION_RESISTANCE * delta;

  if (rotationSpeed < 0) {
    rotationSpeed = 0;
  }

  requestAnimationFrame(loop);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

setup();

