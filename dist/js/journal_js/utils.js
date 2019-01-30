"use strict";

/**
 * Created by txl-pc on 2017/6/3.
 */
//将utils定义为window对象下的一个属性，属性值为对象
window.utils = {}; //在utils对象上定义捕获坐标的方法

window.utils.captureMouse = function (element, event) {
  //定义一个名为mouse的对象
  var mouse = {
    x: 0,
    y: 0
  };
  var x, y; //获取鼠标位于当前屏幕的位置， 并作兼容处理

  if (event.pageX || event.pageY) {
    x = event.pageX;
    y = event.pageY;
  } else {
    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  } //将当前的坐标值减去元素的偏移位置，即为鼠标位于当前canvas的位置


  x -= element.offsetLeft;
  y -= element.offsetTop;
  mouse.x = x;
  mouse.y = y; //返回值为mouse对象

  return mouse;
};

window.utils.captureRect = function (element, event) {
  //定义一个名为mouse的对象
  var mouse = {
    x: 0,
    y: 0
  };
  var x, y;
  var winX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft || event.pageX;
  var winY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop || event.pageY;
  var canBox = element.getBoundingClientRect(); //将当前的坐标值减去元素的偏移位置，即为鼠标位于当前canvas的位置

  x = (winX - canBox.left) * (element.width / canBox.width);
  y = (winY - canBox.top) * (element.height / canBox.height);
  mouse.x = x;
  mouse.y = y; //返回值为mouse对象

  return mouse;
};

window.utils.captureTouch = function (element, event) {
  var mouse = {
    x: 0,
    y: 0
  };
  var x, y;
  var touch_event = event.changedTouches[0];

  if (touch_event.pageX || touch_event.pageY) {
    x = touch_event.pageX;
    y = touch_event.pageY;
  } else {
    x = touch_event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = touch_event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  } //将当前的坐标值减去元素的偏移位置，即为鼠标位于当前canvas的位置


  x -= element.offsetLeft;
  y -= element.offsetTop;
  mouse.x = x;
  mouse.y = y;
  return mouse;
};