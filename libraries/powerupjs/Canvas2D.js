"use strict";

var powerupjs = (function (powerupjs) {

    function Canvas2D_Singleton() {
        this._canvas = null;
        this._canvasContext = null;
        this._pixeldrawingCanvas = null;
        this._canvasOffset = powerupjs.Vector2.zero;
    }

    Object.defineProperty(Canvas2D_Singleton.prototype, "offset",
        {
            get: function () {
                return this._canvasOffset;
            }
        });

    Object.defineProperty(Canvas2D_Singleton.prototype, "scale",
        {
            get: function () {
                return new powerupjs.Vector2(this._canvas.width / powerupjs.Game.size.x,
                    this._canvas.height / powerupjs.Game.size.y);
            }
        });

    Canvas2D_Singleton.prototype.initialize = function (divName, canvasName) {
        this._canvas = document.getElementById(canvasName);
        this._div = document.getElementById(divName);

        if (this._canvas.getContext)
            this._canvasContext = this._canvas.getContext('2d');
        else {
            alert('Your browser is not HTML5 compatible.!');
            return;
        }

        this._pixeldrawingCanvas = document.createElement('canvas');

        window.onresize = this.resize;
        this.resize();
    };

    Canvas2D_Singleton.prototype.clear = function () {
        this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
    };

    Canvas2D_Singleton.prototype.resize = function () {
        var gameCanvas = powerupjs.Canvas2D._canvas;
        var gameArea = powerupjs.Canvas2D._div;
        var widthToHeight = powerupjs.Game.size.x / powerupjs.Game.size.y;
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;
        var newWidthToHeight = newWidth / newHeight;

        if (newWidthToHeight > widthToHeight) {
            newWidth = newHeight * widthToHeight;
        } else {
            newHeight = newWidth / widthToHeight;
        }
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';

        gameArea.style.marginTop = (window.innerHeight - newHeight) / 2 + 'px';
        gameArea.style.marginLeft = (window.innerWidth - newWidth) / 2 + 'px';
        gameArea.style.marginBottom = (window.innerHeight - newHeight) / 2 + 'px';
        gameArea.style.marginRight = (window.innerWidth - newWidth) / 2 + 'px';

        gameCanvas.width = newWidth;
        gameCanvas.height = newHeight;

        var offset = powerupjs.Vector2.zero;
        if (gameCanvas.offsetParent) {
            do {
                offset.x += gameCanvas.offsetLeft;
                offset.y += gameCanvas.offsetTop;
            } while ((gameCanvas = gameCanvas.offsetParent));
        }
        powerupjs.Canvas2D._canvasOffset = offset;
    };

    Canvas2D_Singleton.prototype.drawImage = function (sprite, position, rotation, scale, origin, sourceRect, mirror) {
        var canvasScale = this.scale;

        position = typeof position !== 'undefined' ? position : powerupjs.Vector2.zero;
        rotation = typeof rotation !== 'undefined' ? rotation : 0;
        scale = typeof scale !== 'undefined' ? scale : 1;
        origin = typeof origin !== 'undefined' ? origin : powerupjs.Vector2.zero;
        sourceRect = typeof sourceRect !== 'undefined' ? sourceRect : new powerupjs.Rectangle(0, 0, sprite.width, sprite.height);

        this._canvasContext.save();
        if (mirror) {
            this._canvasContext.scale(scale * canvasScale.x * -1, scale * canvasScale.y);
            this._canvasContext.translate(-position.x - sourceRect.width, position.y);
            this._canvasContext.rotate(rotation);
            this._canvasContext.drawImage(sprite, sourceRect.x, sourceRect.y,
                sourceRect.width, sourceRect.height,
                sourceRect.width - origin.x, -origin.y,
                sourceRect.width, sourceRect.height);
        }
        else {
            this._canvasContext.scale(scale * canvasScale.x, scale * canvasScale.y);
            this._canvasContext.translate(position.x, position.y);
            this._canvasContext.rotate(rotation);
            this._canvasContext.drawImage(sprite, sourceRect.x, sourceRect.y,
                sourceRect.width, sourceRect.height,
                -origin.x, -origin.y,
                sourceRect.width, sourceRect.height);
        }
        this._canvasContext.restore();
    };

    Canvas2D_Singleton.prototype.drawText = function (text, position, origin, color, textAlign, fontname, fontsize) {
        var canvasScale = this.scale;

        position = typeof position !== 'undefined' ? position : powerupjs.Vector2.zero;
        origin = typeof origin !== 'undefined' ? origin : powerupjs.Vector2.zero;
        color = typeof color !== 'undefined' ? color : powerupjs.Color.black;
        textAlign = typeof textAlign !== 'undefined' ? textAlign : "top";
        fontname = typeof fontname !== 'undefined' ? fontname : "Courier New";
        fontsize = typeof fontsize !== 'undefined' ? fontsize : "20px";

        this._canvasContext.save();
        this._canvasContext.scale(canvasScale.x, canvasScale.y);
        this._canvasContext.translate(position.x - origin.x, position.y - origin.y);
        this._canvasContext.textBaseline = 'top';
        this._canvasContext.font = fontsize + " " + fontname;
        this._canvasContext.fillStyle = color.toString();
        this._canvasContext.textAlign = textAlign;
        this._canvasContext.fillText(text, 0, 0);
        this._canvasContext.restore();
    };

    Canvas2D_Singleton.prototype.drawPixel = function (x, y, color) {
        var canvasscale = this.scale;
        this._canvasContext.save();
        this._canvasContext.scale(canvasscale.x, canvasscale.y);
        this._canvasContext.fillStyle = color.toString();
        this._canvasContext.fillRect(x, y, 1, 1);
        this._canvasContext.restore();
    };

    Canvas2D_Singleton.prototype.drawRectangle = function (x, y, width, height, fillColor, alpha) {
        var canvasScale = this.scale;

        // Set defaults
        fillColor = typeof fillColor !== 'undefined' ? fillColor : 'none';
        alpha = typeof alpha !== 'undefined' ? alpha : 1;

        this._canvasContext.save();
        this._canvasContext.scale(canvasScale.x, canvasScale.y);
        this._canvasContext.globalAlpha = alpha;
        this._canvasContext.fillStyle = fillColor;
        this._canvasContext.fillRect(x, y, width, height);
        this._canvasContext.strokeRect(x, y, width, height);
        this._canvasContext.restore();
    };

    Canvas2D_Singleton.prototype.drawCircle = function(cx, cy, radius, fillColor, strokeColor, alpha) {
        var canvasScale = this.scale;

        // Set default
        fillColor = typeof fillColor !== 'undefined' ? fillColor : Color.red;
        strokeColor = typeof strokeColor !== 'undefined' ? strokeColor : Color.red;
        alpha = typeof alpha !== 'undefined' ? alpha : 1;

        this._canvasContext.save();
        this._canvasContext.scale(canvasScale.x, canvasScale.y);
        this._canvasContext.beginPath();
        this._canvasContext.arc(cx, cy, radius, 0, 2 * Math.PI, false); 
        this._canvasContext.globalAlpha = alpha;
        if (fillColor !== 'none') {
            this._canvasContext.fillStyle = fillColor;
            this._canvasContext.fill(); 
        }
        if (strokeColor !== 'none') {
            this._canvasContext.lineWidth = 5;
            this._canvasContext.strokeStyle = strokeColor;
            this._canvasContext.stroke();
        }
        this._canvasContext.restore();
    };

    Canvas2D_Singleton.prototype.drawEllipse = function(centerX, centerY, width, height, 
                                                        fillColor, strokeColor) {
        var canvasScale = this.scale;

        // Set default
        fillColor = typeof fillColor !== 'undefined' ? fillColor : Color.red;
        strokeColor = typeof strokeColor !== 'undefined' ? strokeColor : Color.red;

        this._canvasContext.save();
        this._canvasContext.scale(canvasScale.x, canvasScale.y);

        // Draw Ellipse
        this._canvasContext.beginPath();
        this._canvasContext.moveTo(centerX, centerY - height/2); // Top-center
        this._canvasContext.bezierCurveTo(
            centerX + width/2, centerY - height/2, // C1
            centerX + width/2, centerY + height/2, // C2
            centerX, centerY + height/2); // A2
        this._canvasContext.bezierCurveTo(
            centerX - width/2, centerY + height/2, // C3
            centerX - width/2, centerY - height/2, // C4
            centerX, centerY - height/2); // A1
        if (fillColor !== 'none') {
            this._canvasContext.fillStyle = fillColor;
            this._canvasContext.fill(); 
        }
        if (strokeColor !== 'none') {
            this._canvasContext.lineWidth = 5;
            this._canvasContext.strokeStyle = strokeColor;
            this._canvasContext.stroke();
        }
        this._canvasContext.restore();
    };

    Canvas2D_Singleton.prototype.drawPath = function (shapeObject, fillColor, strokeColor) {
        var canvasScale = this.scale;
        var xPoints = shapeObject.xPoints;
        var yPoints = shapeObject.yPoints;
        var pathType = shapeObject.pathType;

        // Set default
        fillColor = typeof fillColor !== 'undefined' ? fillColor : Color.red;
        strokeColor = typeof strokeColor !== 'undefined' ? strokeColor : Color.red;

        this._canvasContext.save();
        this._canvasContext.scale(canvasScale.x, canvasScale.y);
        this._canvasContext.beginPath();
        this._canvasContext.moveTo(xPoints[0], yPoints[0]);
        for (var i = 1; i < xPoints.length; i++) {
            switch(pathType[i-1]) {
                case "line":
                    this._canvasContext.lineTo(xPoints[i], yPoints[i]);
                    break;
                case "bezierCurve":
                    this._canvasContext.bezierCurveTo(
                        xPoints[i][0], yPoints[i][0],
                        xPoints[i][1], yPoints[i][1],
                        xPoints[i][2], yPoints[i][2]);
                    break;
            } 
        }
        this._canvasContext.closePath();
        if (fillColor !== 'none') {
            this._canvasContext.fillStyle = fillColor;
            this._canvasContext.fill(); 
        }
        if (strokeColor !== 'none') {
            this._canvasContext.lineWidth = 5;
            this._canvasContext.strokeStyle = strokeColor;
            this._canvasContext.stroke();
        }
        this._canvasContext.restore();

    };

    powerupjs.Canvas2D = new Canvas2D_Singleton();

    return powerupjs;

})(powerupjs || {});
