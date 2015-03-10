"use strict";

function Wall(layer, id) {
	powerupjs.GameObject.call(this, layer, id);

	// Some physical properties of the wall
	this.strokeColor = 'none'; 
	this.fillColor = 'none';
	this.scoreFrontColor = "#FFC800";
	this.scoreSideColor = "#B28C00";
	this.defaultFrontColor = '#0018FF';
	this.defaultSideColor = '#0010B2';
	this.frontColor = this.defaultFrontColor;
	this.sideColor = this.defaultSideColor;
	this._minVelocity = -250;
	this._minDiameterY = 200;
	this._maxDiameterY = 300;
	this.diameterX = 100;
	this.diameterY = 200;
	this.wallWidth = this.diameterX;
	this.wallThickness = this.wallWidth / 9;	
	this.smartWall = false;
	this.smartWallRate = 2;

	this.initX = powerupjs.Game.size.x + 100;
	this.position = this.randomHolePosition();
	this.velocity = new powerupjs.Vector2(this._minVelocity, 0);
}
Wall.prototype = Object.create(powerupjs.GameObject.prototype);

Object.defineProperty(Wall.prototype, "minDiameterY",
	{
		get: function () {
			return this._minDiameterY;
		}

	});

Object.defineProperty(Wall.prototype, "maxDiameterY",
	{
		get: function () {
			return this._maxDiameterY;
		}

	});

Object.defineProperty(Wall.prototype, "resetXOffset",
	{
		get: function () {
			return this.initX - this.diameterX / 2;
		}

	});

Object.defineProperty(Wall.prototype, "boundingBox",
	{
		get: function () {
			return new powerupjs.Rectangle(this.position.x - this.diameterX / 2,
				                           this.position.y - this.diameterY / 2,
				                           this.diameterX, this.diameterY);
		}
	});

Wall.prototype.reset = function() {
    var playingState = powerupjs.GameStateManager.get(ID.game_state_playing);

	this.frontColor = this.defaultFrontColor;
	this.sideColor = this.defaultSideColor;
	this.diameterY = this.randomHoleSize();
	this.position = this.randomHolePosition();
	this.scored = false;
	// Smart wall = moving hole
	if (playingState.score.score >= playingState.initSmartWallScore )
		this.smartWall = true;
	else
		this.smartWall = false;
};

Wall.prototype.update = function(delta) {
	//GameObject.prototype.update.call(this,delta);

	// Contains all playing objects
    var playingState = powerupjs.GameStateManager.get(ID.game_state_playing);

	// If wall goes off screen
	if (playingState.isOutsideWorld(this)) {
		this.reset();
		//this.velocity = new Vector2(this._minVelocity - (20 * score.score), 0);
	}

	// Move the hole
	if (this.smartWall)
		this.moveHole(delta);

	// Determine if user collides with wall.
	if (this.position.x <= playingState.user.boundingBox.right &&
		this.position.x > playingState.user.boundingBox.center.x) {
		if (this.isColliding(playingState.user)) {
			playingState.lives -= 1;
			playingState.isDying = true;
		}
	// If no collision and wall is behind user, score it. 
	} else if (this.position.x <= playingState.user.boundingBox.center.x && !this.scored) {
		playingState.score.score += 1;
		this.frontColor = this.scoreFrontColor;
		this.sideColor = this.scoreSideColor;
		this.scored = true;
		sounds.beep.play();
	}

	// Add moving hole
	//this.position.y += 1;
};

Wall.prototype.draw = function() {
	powerupjs.Canvas2D.drawPath(this.calculateWallPath('topFront'), this.frontColor, this.strokeColor);
	powerupjs.Canvas2D.drawPath(this.calculateWallPath('holeLeft'), this.frontColor, this.strokeColor);
	powerupjs.Canvas2D.drawPath(this.calculateWallPath('bottomFront'), this.frontColor, this.strokeColor);
	powerupjs.Canvas2D.drawPath(this.calculateWallPath('holeSide'), this.sideColor, this.strokeColor);
};

Wall.prototype.moveHole = function(delta) {

	if (this.boundingBox.bottom > powerupjs.Game.size.y || 
		this.boundingBox.top < 0)
		this.smartWallRate *= -1;

	this.position.y += this.smartWallRate;
};

Wall.prototype.isColliding = function(user) {
	var userCenter = { x : user.boundingBox.center.x,
	 				   y : user.boundingBox.center.y};
 	var holeTop = this.position.y - this.diameterY / 2;
	var holeBottom = this.position.y + this.diameterY / 2;
	var overlap = this.position.x - userCenter.x;
	var theta = Math.acos(overlap / (user.width / 2));
	var userTop = userCenter.y - (user.height / 2) * Math.sin(theta);
	var userBottom = (user.height / 2) * Math.sin(theta) + userCenter.y;
	if (userTop > holeTop && userBottom < holeBottom) {
		return false;
	} else {
		return true;
	}
};

Wall.prototype.randomHoleSize = function() {
	//console.log(Math.floor(Math.random() * (this.maxDiameterY - this.minDiameterY)) + this.minDiameterY);
	return  Math.floor(Math.random() * (this.maxDiameterY - this.minDiameterY)) + this.minDiameterY;
};

Wall.prototype.randomHolePosition = function() {
	var newY = Math.random() * (powerupjs.Game.size.y - this.diameterY) + 
	           this.diameterY / 2;
	return new powerupjs.Vector2(this.initX, newY);
};

/*Wall.prototype.calculateRandomPosition = function() {
	//var calcNewY = this.calculateRandomY;
	var enemy = this.root.find(ID.enemy1);
	if (enemy) {
		console.log("here");
		var newY = null;

		while (! newY || (((newY - this.diameterY / 2) <= enemy.position.y + enemy.height) && 
						 ((newY + this.diameterY / 2) >= enemy.position.y) )) {
			newY = this.calculateRandomY();
			console.log(newY);
		}
		return new powerupjs.Vector2(this.initX, newY);
	} else {
		return new powerupjs.Vector2(this.initX, this.calculateRandomY());
	}
};*/

Wall.prototype.calculateWallPath = function(type) {

	var xPoints = [];
	var yPoints = [];
	var pathType = [];

	// Default values
	// Wall bounds
	var thick = this.wallThickness;
	var left = this.position.x - this.diameterX / 2;
	var right = this.position.x + (this.diameterX / 2) + thick;
	var shiftedCenter = left + (this.diameterX / 2) + thick;
	var top = 0;
	var bottom = powerupjs.Game.size.y;
	// Circle bounds
	var cBase = this.position.y + this.diameterY / 2;
	var cTop = this.position.y - this.diameterY / 2;
	var cLeft = shiftedCenter - this.diameterX / 2;
	var cRight = shiftedCenter + this.diameterX / 2;
	switch(type){
		case "holeLeft" :
			top = cTop - 5;
			bottom = cBase + 5;
			right = shiftedCenter;

			xPoints = [left, left, right, right,
					   [cLeft, cLeft, right],
					   right, left];
			yPoints = [top, bottom, bottom, cBase, 
					   [cBase, cTop, cTop],
					   top, top];
			pathType = ['line','line','line','bezierCurve','line', 'line'];
			break;
		case "holeRight" :
			top = cTop - 1;
			bottom = cBase + 1;
			left = shiftedCenter;
			xPoints = [left, left,
			           [cRight, cRight, left],
			           left, right, right, left];
			yPoints = [top, cTop,
			    	   [cTop, cBase, cBase],
			    	   bottom, bottom, top, top]; 
			pathType = ['line','bezierCurve','line', 'line', 'line', 'line'];
			break;	
		case "holeSide" :
			thick = thick;
			right = shiftedCenter;

			xPoints = [right - thick,
					   [cLeft - thick, cLeft - thick, right - thick],
					   right,
					   [cLeft, cLeft, right],
					   right - thick];
			yPoints = [cTop,
					   [cTop, cBase, cBase],
					   cBase,
					   [cBase, cTop, cTop],
					   cTop];
			pathType = ['bezierCurve','line','bezierCurve','line'];
			break;	
		case "topFront" :
			bottom = cTop;
			//right = shiftedCenter + 5;

			xPoints = [left, left, right, right, left];
			yPoints = [top, bottom, bottom, top, top];
			pathType = ['line','line','line','line'];
			break;
		case "bottomFront" :
			top = cBase;
			//right = shiftedCenter + 5;

			xPoints = [left, left, right, right, left];
			yPoints = [top, bottom, bottom, top, top];
			pathType = ['line','line','line','line'];
			break;
		case "rightSide" :
			right = right - 1;
			left = right;
			right = right + thick;

			xPoints = [left, left, right, right, left];
			yPoints = [top, bottom, bottom, top, top];
			pathType = ['line','line','line','line'];
			break;
	}
	return { xPoints : xPoints, yPoints : yPoints,
			pathType : pathType };
};
