"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Created by txl-pc on 2017/6/3.
 */
(function (window, factory) {
  if (typeof define === "function" && define.amd) {
    //AMD
    define(factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
    //CMD
    module.exports = factory();
  } else {
    //window
    window.martrix = factory();
  }
})(typeof window !== "undefined" ? window : void 0, function () {
  var martrix = function martrix(selector, userOptions) {
    "use strict";

    var options = {
      cW: 1368,
      cH: 600,
      wordColor: '#33ff33',
      fontSize: 16,
      speed: 0.13,
      words: "0123456789qwertyuiopasdfghjklzxcvbnm,./;'\[]QWERTYUIOP{}ASDFGHJHJKL:ZXCVBBNM<>?"
    };
    var canvas,
        ctx,
        W,
        H,
        clumns,
        wordsArr,
        drops = []; //混合参数

    var mergeOptions = function mergeOptions(userOptions, options) {
      Object.keys(userOptions).forEach(function (key) {
        options[key] = userOptions[key];
      });
    }; //draw


    var draw = function draw() {
      ctx.save();
      ctx.fillStyle = options.wordColor;
      ctx.font = options.fontSize + "px arial";
      ctx.fontWeight = options.fontWeight;

      for (var i = 0; i < drops.length; i++) {
        var text = wordsArr[Math.floor(Math.random() * wordsArr.length)];
        ctx.fillText(text, i * options.fontSize, drops[i] * options.fontSize);

        if (drops[i] * options.fontSize > H && Math.random() > 0.98) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      ctx.restore();
    }; //初始化


    var initSetup = function initSetup(selector, userOptions) {
      mergeOptions(userOptions, options);
      canvas = document.getElementById(selector);
      ctx = canvas.getContext('2d');
      canvas.height = H = options.cH;
      canvas.width = W = options.cW;
      clumns = options.cW / options.fontSize;
      wordsArr = options.words.split('');

      for (var i = 0; i < clumns; i++) {
        drops[i] = 1;
      }

      (function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        ctx.fillStyle = 'rgba(0,0,0,' + options.speed + ')';
        ctx.fillRect(0, 0, W, H);
        draw();
      })();
    };

    initSetup(selector, userOptions);
  };

  return martrix;
});