"use strict";

/**
 * Created by txl-pc on 2017/6/3.
 */
function Arrow() {
  this.x = 0; //初始位置

  this.y = 0;
  this.rotation = 0; //初始旋转角度

  this.color = '#ffff00';
}

Arrow.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, this.y); //将坐标移到this.x 和 this.y

  context.rotate(this.rotation); //设置旋转角度

  context.lineWidth = 5; //设置线宽

  context.fillStyle = this.color; //设置填充色

  context.beginPath(); //路径开始

  context.moveTo(-70, -5);
  context.lineTo(0, -5);
  context.lineTo(0, -20);
  context.lineTo(30, 0);
  context.lineTo(0, 20);
  context.lineTo(0, 5);
  context.lineTo(-70, 5);
  context.closePath(); //路径闭合

  context.stroke(); //描边

  context.fill(); //填充

  context.restore();
};