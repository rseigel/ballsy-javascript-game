"use strict";

function FrontWall(parentWall, layer, id) {
	Wall.call(this, layer, id);
	this.parentWall = parentWall;
}
FrontWall.prototype = Object.create(Wall.prototype);

FrontWall.prototype.update = function(delta) {
	powerupjs.GameObject.prototype.update.call(this,delta);

	// Ensure certain properties are identical
	this.position = this.parentWall.position;
	this.diameterY = this.parentWall.diameterY;
	this.frontColor = this.parentWall.frontColor;
	this.sideColor = this.parentWall.sideColor;
};

FrontWall.prototype.draw = function() {
	powerupjs.Canvas2D.drawPath(this.calculateWallPath('holeRight'), this.frontColor, this.strokeColor);
	powerupjs.Canvas2D.drawPath(this.calculateWallPath('rightSide'), this.sideColor, this.strokeColor);
};
