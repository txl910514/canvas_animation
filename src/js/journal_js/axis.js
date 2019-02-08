(function (window, factory) {
    if (typeof define === "function" && define.amd) {
        //AMD
        define(factory);
    } else if (typeof module === "object" && module.exports) {
        //CMD
        module.exports = factory();
    } else {
        //window
        window.Axis = factory();
    }
})(typeof window !== "undefined" ? window : this, function () {
    var Axis = function (options) {
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
                splitNumber: 2,
                axisTick: {
                    lineWidth: 1,
                    strokeStyle: '#333',
                    lengh: 5     
                },
                axisLabel: {
                    strokeStyle: '#333',
                    textAlign:'center'
                }
            },
            star: {
                R: 8,
                lineWidth: 1,
                fillStyle: '#333',
                strokeStyle: '#333'
            }
        }
        var mergeOptions = function (userOptions, options) {
            Object.keys(userOptions).forEach(function (key) {
                options[key] = userOptions[key];
            })
        }
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
        }
        this.origin = {
            x: this.options.padding.left,
            y: pageHeight - this.options.padding.bottom
        }

        this.vertexRight = {
            x: pageWidth - this.options.padding.left,
            y: pageHeight - this.options.padding.bottom
        }
        this.setOption = function (option) {
            mergeOptions(option, this.options);
            requestAnimationFrame(this.animate.bind(this));
        }
        this.checkRequestAnimationFrame();
    }

    Axis.prototype = {
        initAxis: function () {
            var that = this;
            var starData = this.options.starData || [];
            var lineData = this.options.lineData || [];
            var xMax = Math.max(...starData.map(v => v.x), ...lineData.map(v=> v.x)) || 0;
            var yMax = Math.max(...starData.map(v => v.y), ...lineData.map(v=> v.y)) || 0;
            var xAxisLengh = this.vertexRight.x - this.origin.x;
            var yAxisLengh = this.origin.y - this.vertexTop.y;
            var xAxisAve = xAxisLengh / xMax;
            var yAxisAve = yAxisLengh / yMax;
            this.xAxisAve = xAxisAve;
            this.yAxisAve = yAxisAve;
            this.xMax = xMax;
            this.yMax = yMax;
            this.strokeAxis();
            this.vertexTopArrow();
            this.vertexRightArrow();
            this.xAxisSplit();
            for (var i = 0; i < starData.length; i++) {
                (function (i) {
                    that.strokeStar(starData[i]);
                })(i)
            }
        },
        strokeAxis: function () {
            this.ctx.beginPath();
            this.ctx.moveTo(this.vertexTop.x, this.vertexTop.y);
            this.ctx.lineTo(this.origin.x, this.origin.y);
            this.ctx.lineTo(this.vertexRight.x, this.vertexRight.y);
            this.ctx.stroke();
        },
        xAxisSplit: function () {
            var splitNum = Math.ceil(this.xMax / this.options.xAxis.splitNumber) + 1;
            for (var i = 0; i < splitNum; i++) {
                this.ctx.lineWidth= this.options.xAxis.axisTick.lineWidth;  
                this.ctx.strokeStyle = this.options.xAxis.axisTick.strokeStyle; 
                this.ctx.beginPath();
                this.ctx.moveTo(this.origin.x + i * this.xAxisAve * this.options.xAxis.splitNumber, this.origin.y);
                this.ctx.lineTo(this.origin.x + i * this.xAxisAve * this.options.xAxis.splitNumber, this.origin.y + this.options.xAxis.axisTick.lengh);
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.strokeStyle = this.options.xAxis.axisLabel.strokeStyle;
                this.ctx.lineWidth= 1; 
                this.ctx.textAlign = this.options.xAxis.axisLabel.textAlign;
                this.ctx.beginPath();
                this.ctx.font = "15px Arial";
                this.ctx.strokeText( i * this.options.xAxis.splitNumber,  this.origin.x + i * this.xAxisAve * this.options.xAxis.splitNumber, this.origin.y + this.options.xAxis.axisTick.lengh + 15);
                this.ctx.closePath();
                this.ctx.stroke();
            } 

        },
        strokeStar: function (centerPos) {
            this.ctx.beginPath();
            for (var i = 0; i < 5; i++) {
                this.ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * this.options.star.R + centerPos.x * this.xAxisAve + this.vertexTop.x,
                    -Math.sin((18 + i * 72) / 180 * Math.PI) * this.options.star.R + centerPos.y  * this.yAxisAve - this.options.star.R);
                this.ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * this.options.star.R / 2 + centerPos.x * this.xAxisAve + this.vertexTop.x,
                    -Math.sin((54 + i * 72) / 180 * Math.PI) * this.options.star.R / 2 + centerPos.y * this.yAxisAve - this.options.star.R);
            }
            this.ctx.closePath();   
            //设置边框样式以及填充颜色       
            this.ctx.lineWidth= this.options.star.lineWidth;
            this.ctx.fillStyle = this.options.star.fillStyle;   
            this.ctx.strokeStyle = this.options.star.strokeStyle;   
            this.ctx.fill(); 
            this.ctx.stroke();
        },
        vertexTopArrow: function () {
            this.ctx.beginPath();
            this.ctx.moveTo(this.vertexTop.x, this.vertexTop.y);
            this.ctx.lineTo(this.vertexTop.x - this.options.arrow.width / 2, this.vertexTop.y + this.options.arrow.height);
            this.ctx.lineTo(this.vertexTop.x, this.vertexTop.y + this.options.arrow.height / 2);
            this.ctx.lineTo(this.vertexTop.x + this.options.arrow.width / 2, this.vertexTop.y + this.options.arrow.height);
            this.ctx.fill();
        },
        vertexRightArrow: function () {
            this.ctx.beginPath();
            this.ctx.moveTo(this.vertexRight.x, this.vertexRight.y);
            this.ctx.lineTo(this.vertexRight.x - this.options.arrow.height, this.vertexRight.y - this.options.arrow.width);
            this.ctx.lineTo(this.vertexRight.x - this.options.arrow.height / 2, this.vertexRight.y);
            this.ctx.lineTo(this.vertexRight.x - this.options.arrow.height, this.vertexRight.y + this.options.arrow.width);
            this.ctx.fill();
        },
        animate: function () {
            this.initAxis();
            // requestAnimationFrame(this.animate.bind(this));
        },
        checkRequestAnimationFrame: function () {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                    window[vendors[x] + 'CancelRequestAnimationFrame'];
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
    }
    return Axis;
})