"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (window, factory) {
  if (typeof define === "function" && define.amd) {
    //AMD
    define(factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
    //CMD
    module.exports = factory();
  } else {
    //window
    window.Axis = factory();
  }
})(typeof window !== "undefined" ? window : void 0, function () {
  var Axis = function Axis(options) {
    var that = this;

    if (!options || !options.canvas) {
      throw 'Axis constructor: missing arguments canvas';
    }

    this.options = {
      canvas: null,
      padding: {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40
      },
      arrow: {
        width: 12,
        height: 20
      },
      xAxis: {
        splitNumber: 5,
        axisTick: {
          lineWidth: 1,
          strokeStyle: '#333',
          length: 5
        },
        axisLabel: {
          fillStyle: '#333',
          textAlign: 'center'
        },
        axisSplitLine: {
          lineWidth: 1,
          strokeStyle: '#eee'
        }
      },
      yAxis: {
        splitNumber: 5,
        axisTick: {
          lineWidth: 1,
          strokeStyle: '#333',
          length: 5
        },
        axisLabel: {
          fillStyle: '#333',
          textAlign: 'center'
        },
        axisSplitLine: {
          lineWidth: 1,
          strokeStyle: '#eee'
        }
      },
      star: {
        starLine: {
          lineWidth: 1,
          strokeStyle: '#333'
        },
        R: 8,
        lineWidth: 1,
        fillStyle: '#333',
        strokeStyle: '#333'
      },
      dotLine: {
        dot: {
          R: 3,
          lineWidth: 1,
          fillStyle: 'blue',
          strokeStyle: 'blue',
          label: {
            strokeStyle: '#333'
          }
        },
        line: {
          lineWidth: 1,
          strokeStyle: 'red'
        }
      }
    };

    var mergeOptions = function mergeOptions(userOptions, options) {
      Object.keys(userOptions).forEach(function (key) {
        options[key] = userOptions[key];
      });
    };

    mergeOptions(options, this.options);
    this.canvas = options.canvas;
    this.scaleAdaption = 1;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineWidth = 2;
    var pageWidth = parseInt(this.canvas.clientWidth);
    var pageHeight = parseInt(this.canvas.clientHeight);
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
    this.canvas.setAttribute("width", pageWidth * this.scaleAdaption);
    this.canvas.setAttribute("height", pageHeight * this.scaleAdaption);
    this.vertexTop = {
      x: this.options.padding.left,
      y: this.options.padding.top
    };
    this.origin = {
      x: this.options.padding.left,
      y: pageHeight - this.options.padding.bottom
    };
    this.vertexRight = {
      x: pageWidth - this.options.padding.left,
      y: pageHeight - this.options.padding.bottom
    };

    this.setOption = function (option) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      mergeOptions(option, this.options);
      requestAnimationFrame(this.animate.bind(this));
    };

    this.getAxisVertex = function () {
      return {
        vertexTop: this.vertexTop,
        origin: this.origin,
        vertexRight: this.vertexRight
      };
    };

    this.getAxisPoint = function (point) {
      return {
        x: this.origin.x + this.xAxisAve * point.x,
        y: this.origin.y - this.yAxisAve * point.y
      };
    };

    this.canvasTextAutoLine = function (text, x, y, roomWidth, fontSize) {
      var lineWidth = 0;
      var lastSubStrIndex = 0;
      console.log(this.ctx.measureText(text));

      if (this.ctx.measureText(text).width < roomWidth) {
        this.ctx.fillText(text, x, y);
      } else {
        for (var i = 0; i < text.length; i++) {
          lineWidth += this.ctx.measureText(text[i]).width;

          if (lineWidth > roomWidth - 10) {
            //减去initX,防止边界出现的问题
            this.ctx.fillText(text.substring(lastSubStrIndex, i), x, y - fontSize / 2);
            y += fontSize / 2;
            lineWidth = 0;
            lastSubStrIndex = i;
          }

          if (i == text.length - 1) {
            this.ctx.fillText(text.substring(lastSubStrIndex, i + 1), x, y);
          }
        }
      }
    };

    this.checkRequestAnimationFrame();
  };

  Axis.prototype = {
    initAxis: function initAxis() {
      var that = this;
      var starData = this.options.starData || [];
      var lineData = this.options.lineData || [];
      var xMax = Math.max.apply(Math, _toConsumableArray(starData.map(function (v) {
        return v.x;
      })).concat(_toConsumableArray(lineData.map(function (v) {
        return v.x;
      })))) || 0;
      var yMax = Math.max.apply(Math, _toConsumableArray(starData.map(function (v) {
        return v.y;
      })).concat(_toConsumableArray(lineData.map(function (v) {
        return v.y;
      })))) || 0;
      var xAxisLength = this.vertexRight.x - this.origin.x;
      var yAxisLength = this.origin.y - this.vertexTop.y;
      var xAxisAve = xAxisLength / xMax;
      var yAxisAve = yAxisLength / yMax;
      this.xAxisAve = xAxisAve;
      this.yAxisAve = yAxisAve;
      this.xMax = xMax;
      this.yMax = yMax;
      this.options.xAxis.splitData = Math.ceil(xMax / this.options.xAxis.splitNumber);
      this.options.yAxis.splitData = Math.ceil(yMax / this.options.yAxis.splitNumber);
      this.vertexTopArrow();
      this.vertexRightArrow();
      this.strokeAxis();
      this.xAxisSplit();
      this.yAxisSplit();
      this.autoDraw();
      this.strokeDotLine();

      for (var i = 0; i < starData.length; i++) {
        (function (i) {
          that.strokeStar(starData[i]);
        })(i);
      }
    },
    autoDraw: function autoDraw() {
      var custom = this.options.custom || [];
      console.log(custom);

      for (var i = 0; i < custom.length; i++) {
        typeof custom[i] === 'function' && custom[i](this.ctx);
      }
    },
    strokeDotLine: function strokeDotLine() {
      var lineData = this.options.lineData || [];
      var starLineData = this.options.starLineData || [];
      this.strokeStarLine(lineData, starLineData);
      this.strokeDotLineText(lineData);
    },
    strokeDotLineText: function strokeDotLineText(lineData) {
      if (lineData.length) {
        for (var i = 0; i < lineData.length; i++) {
          if (i < lineData.length - 1) {
            this.ctx.setLineDash([25, 5]);
            this.ctx.lineWidth = this.options.dotLine.line.lineWidth;
            this.ctx.strokeStyle = this.options.dotLine.line.strokeStyle;
            this.ctx.beginPath();
            this.ctx.moveTo(this.origin.x + this.xAxisAve * lineData[i].x, this.origin.y - this.yAxisAve * lineData[i].y);
            this.ctx.lineTo(this.origin.x + this.xAxisAve * lineData[i + 1].x, this.origin.y - this.yAxisAve * lineData[i + 1].y);
            this.ctx.stroke();
          }

          this.ctx.lineWidth = this.options.dotLine.dot.lineWidth;
          this.ctx.strokeStyle = this.options.dotLine.dot.strokeStyle;
          this.ctx.fillStyle = this.options.dotLine.dot.fillStyle;
          this.ctx.beginPath();
          this.ctx.arc(this.origin.x + this.xAxisAve * lineData[i].x, this.origin.y - this.yAxisAve * lineData[i].y, this.options.dotLine.dot.R, 0, 2 * Math.PI);
          this.ctx.fillStyle = this.options.dotLine.dot.label.strokeStyle;
          this.ctx.font = "12px Helvetica";
          this.ctx.fillText(i, this.origin.x + this.xAxisAve * lineData[i].x + 2 * this.options.dotLine.dot.R, this.origin.y - this.yAxisAve * lineData[i].y - 2 * this.options.dotLine.dot.R);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.stroke();
        }
      }
    },
    strokeStarLine: function strokeStarLine(lineData, starLineData) {
      if (lineData.length && starLineData.length) {
        for (var i = 0; i < starLineData.length; i++) {
          this.ctx.lineWidth = this.options.star.starLine.lineWidth;
          this.ctx.strokeStyle = this.options.star.starLine.strokeStyle;
          this.ctx.beginPath();
          this.ctx.moveTo(this.origin.x + this.xAxisAve * starLineData[i].x, this.origin.y - this.yAxisAve * starLineData[i].y);
          this.ctx.lineTo(this.origin.x + this.xAxisAve * lineData[lineData.length - 1].x, this.origin.y - this.yAxisAve * lineData[lineData.length - 1].y);
          this.ctx.stroke();
        }
      }
    },
    strokeAxis: function strokeAxis() {
      this.ctx.beginPath();
      this.ctx.moveTo(this.vertexTop.x, this.vertexTop.y);
      this.ctx.lineTo(this.origin.x, this.origin.y);
      this.ctx.lineTo(this.vertexRight.x, this.vertexRight.y);
      this.ctx.stroke();
    },
    strokeSplit: function strokeSplit(axisText) {},
    xAxisSplit: function xAxisSplit() {
      var splitNum = Math.floor(this.xMax / this.options.xAxis.splitData) + 1;

      for (var i = 0; i < splitNum; i++) {
        this.ctx.lineWidth = this.options.xAxis.axisTick.lineWidth;
        this.ctx.strokeStyle = this.options.xAxis.axisTick.strokeStyle;
        this.ctx.beginPath();
        this.ctx.moveTo(this.origin.x + i * this.xAxisAve * this.options.xAxis.splitData, this.origin.y);
        this.ctx.lineTo(this.origin.x + i * this.xAxisAve * this.options.xAxis.splitData, this.origin.y + this.options.xAxis.axisTick.length);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fillStyle = this.options.xAxis.axisLabel.fillStyle;
        this.ctx.lineWidth = 1;
        this.ctx.textAlign = this.options.xAxis.axisLabel.textAlign;
        this.ctx.beginPath();
        this.ctx.font = "12px Helvetica";
        this.ctx.fillText(i * this.options.xAxis.splitData, this.origin.x + i * this.xAxisAve * this.options.xAxis.splitData, this.origin.y + this.options.xAxis.axisTick.length + 15);
        this.ctx.closePath();
        this.ctx.stroke();

        if (i !== 0) {
          this.ctx.lineWidth = this.options.xAxis.axisSplitLine.lineWidth;
          this.ctx.strokeStyle = this.options.xAxis.axisSplitLine.strokeStyle;
          this.ctx.beginPath();
          this.ctx.moveTo(this.origin.x + i * this.xAxisAve * this.options.xAxis.splitData, this.origin.y);
          this.ctx.lineTo(this.origin.x + i * this.xAxisAve * this.options.xAxis.splitData, this.vertexTop.y);
          this.ctx.closePath();
          this.ctx.stroke();

          if (i === splitNum - 1) {
            if (this.origin.x + i * this.xAxisAve * this.options.xAxis.splitData < this.vertexRight.x) {
              this.ctx.beginPath();
              this.ctx.moveTo(this.vertexRight.x, this.origin.y);
              this.ctx.lineTo(this.vertexRight.x, this.vertexTop.y);
              this.ctx.closePath();
              this.ctx.stroke();
            }
          }
        }
      }
    },
    yAxisSplit: function yAxisSplit() {
      var splitNum = Math.floor(this.yMax / this.options.yAxis.splitData) + 1;

      for (var i = 0; i < splitNum; i++) {
        this.ctx.lineWidth = this.options.yAxis.axisTick.lineWidth;
        this.ctx.strokeStyle = this.options.yAxis.axisTick.strokeStyle;
        this.ctx.beginPath();
        this.ctx.moveTo(this.origin.x, this.origin.y - i * this.yAxisAve * this.options.yAxis.splitData);
        this.ctx.lineTo(this.origin.x - this.options.yAxis.axisTick.length, this.origin.y - i * this.yAxisAve * this.options.yAxis.splitData);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fillStyle = this.options.yAxis.axisLabel.fillStyle;
        this.ctx.lineWidth = 1;
        this.ctx.textAlign = this.options.yAxis.axisLabel.textAlign;
        this.ctx.beginPath();
        this.ctx.font = "12px Helvetica";
        this.ctx.fillText(i * this.options.yAxis.splitData, this.origin.x - this.options.yAxis.axisTick.length - 15, this.origin.y - i * this.yAxisAve * this.options.yAxis.splitData + 5);
        this.ctx.closePath();
        this.ctx.stroke();

        if (i !== 0) {
          this.ctx.lineWidth = this.options.yAxis.axisSplitLine.lineWidth;
          this.ctx.strokeStyle = this.options.yAxis.axisSplitLine.strokeStyle;
          this.ctx.beginPath();
          this.ctx.moveTo(this.origin.x, this.origin.y - i * this.yAxisAve * this.options.yAxis.splitData);
          this.ctx.lineTo(this.vertexRight.x, this.origin.y - i * this.yAxisAve * this.options.yAxis.splitData);
          this.ctx.closePath();
          this.ctx.stroke();

          if (i === splitNum - 1) {
            if (this.origin.y - i * this.yAxisAve * this.options.yAxis.splitData > this.vertexTop.y) {
              this.ctx.beginPath();
              this.ctx.moveTo(this.origin.x, this.vertexTop.y);
              this.ctx.lineTo(this.vertexRight.x, this.vertexTop.y);
              this.ctx.closePath();
              this.ctx.stroke();
            }
          }
        }
      }
    },
    strokeStar: function strokeStar(centerPos) {
      this.ctx.beginPath();

      for (var i = 0; i < 5; i++) {
        this.ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * this.options.star.R + centerPos.x * this.xAxisAve + this.vertexTop.x, -Math.sin((18 + i * 72) / 180 * Math.PI) * this.options.star.R + this.origin.y - centerPos.y * this.yAxisAve);
        this.ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * this.options.star.R / 2 + centerPos.x * this.xAxisAve + this.vertexTop.x, -Math.sin((54 + i * 72) / 180 * Math.PI) * this.options.star.R / 2 + this.origin.y - centerPos.y * this.yAxisAve);
      }

      this.ctx.closePath(); //设置边框样式以及填充颜色       

      this.ctx.lineWidth = this.options.star.lineWidth;
      this.ctx.fillStyle = this.options.star.fillStyle;
      this.ctx.strokeStyle = this.options.star.strokeStyle;
      this.ctx.fill();
      this.ctx.stroke();
    },
    vertexTopArrow: function vertexTopArrow() {
      this.ctx.setLineDash([]);
      this.ctx.beginPath();
      this.ctx.moveTo(this.vertexTop.x, this.vertexTop.y);
      this.ctx.lineTo(this.vertexTop.x - this.options.arrow.width / 2, this.vertexTop.y + this.options.arrow.height);
      this.ctx.lineTo(this.vertexTop.x, this.vertexTop.y + this.options.arrow.height / 2);
      this.ctx.lineTo(this.vertexTop.x + this.options.arrow.width / 2, this.vertexTop.y + this.options.arrow.height);
      this.ctx.fill();
    },
    vertexRightArrow: function vertexRightArrow() {
      this.ctx.beginPath();
      this.ctx.moveTo(this.vertexRight.x, this.vertexRight.y);
      this.ctx.lineTo(this.vertexRight.x - this.options.arrow.height, this.vertexRight.y - this.options.arrow.width);
      this.ctx.lineTo(this.vertexRight.x - this.options.arrow.height / 2, this.vertexRight.y);
      this.ctx.lineTo(this.vertexRight.x - this.options.arrow.height, this.vertexRight.y + this.options.arrow.width);
      this.ctx.fill();
    },
    animate: function animate() {
      this.initAxis(); // requestAnimationFrame(this.animate.bind(this));
    },
    checkRequestAnimationFrame: function checkRequestAnimationFrame() {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];

      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      }

      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }

      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
          clearTimeout(id);
        };
      }
    }
  };
  return Axis;
});