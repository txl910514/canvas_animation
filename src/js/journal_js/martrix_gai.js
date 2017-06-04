/**
 * Created by txl-pc on 2017/6/1.
 */
(function(window, factory){
  if(typeof define === "function" && define.amd){
    //AMD
    define(factory);
  }else if(typeof module === "object" && module.exports){
    //CMD
    module.exports = factory();
  }else{
    //window
    window.martrix = factory();
  }

}(typeof window !== "undefined" ? window : this, function(){
  var martrix = function(selector, userOptions){
    "use strict";

    var options = {
      cW: 1368,
      cH: 600,
      wordColor: '#33ff33',
      fontSize: 16,
      speed: 0.13,
      words: "0123456789qwertyuiopasdfghjklzxcvbnm,./;'\[]QWERTYUIOP{}ASDFGHJHJKL:ZXCVBBNM<>?"
    }

    var canvas,
      ctx,
      W,
      H,
      clumns,
      wordsArr,
      drops = [],
      parity,
      xText,
      yText = [];


    //混合参数
    var mergeOptions = function(userOptions, options){
      Object.keys(userOptions).forEach(function(key){
        options[key] = userOptions[key];
      })
    }

    //draw
    var draw = function(){
      ctx.save();
      ctx.fillStyle = options.wordColor;
      ctx.font = options.fontSize + "px arial";
      ctx.fontWeight = options.fontWeight;
      xText = 0;
      for (var i = 0; i < drops.length; i++){
        parity = i % 2;
        if (parity) {
          if (i === 1) {
            if(yText[i] >= wordsArr.length) {
              yText[i] = 0;
            }
            xText = xText + yText[i]
          }
          if(xText >= wordsArr.length) {
            xText = 0;
          }
          var text = wordsArr[xText];
          ctx.fillText(text, i * options.fontSize, drops[i] * options.fontSize);
          if (drops[i] * options.fontSize > H && Math.random() > 0.98){
            drops[i] = 0;
          }
          drops[i]++;
          yText[i]++;
          xText ++;
        }
      }
      ctx.restore();

    }
    //初始化
    var initSetup = function(selector, userOptions){

      mergeOptions(userOptions, options);

      canvas = document.getElementById(selector);
      ctx = canvas.getContext('2d');

      canvas.height = H = options.cH;
      canvas.width = W = options.cW;

      clumns = options.cW / options.fontSize;
      wordsArr = options.words.split('')
      for(var i=0; i<clumns; i++){
        drops[i] = 1;
        yText[i] = 0;
      }

      (function drawFrame(){
        window.requestAnimationFrame(drawFrame);
        ctx.fillStyle = 'rgba(0,0,0,'+options.speed+')';
        // ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, W, H);

        draw();
        // setTimeout(drawFrame, 90)
      }())

    }

    initSetup(selector, userOptions);

  }

  return martrix;

}))