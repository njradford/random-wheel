'use strict';

var target = document.getElementById('ad-crawler-data');
var nameList;

(function populate() {

  var saved_list = localStorage.getItem('wheel_items');
  if (saved_list) {
    nameList = JSON.parse(saved_list);
  }

  var hash = window.location.hash;
  var hashString = hash.substr(1, hash.length - 1);
  if (hashString.length) {
    var queryList = JSON.parse(decodeURI(hashString));
    if (queryList.length) {
      nameList = queryList;
    }
  }
  if (nameList) {
    target.innerText = nameList.toString();
  }
}());
