"use strict";

function User(spriteSheet, layer, id) {
	powerupjs.SpriteGameObject.call(this, spriteSheet, layer, id);
	this.reset();
}
User.prototype = Object.create(powerupjs.SpriteGameObject.prototype);

Object.defineProperty(User.prototype, "bounds",
	{
		get: function () {
			return { left : this.position.x - this.radius,
					 right : this.position.x + this.radius,
					 top : this.position.y - this.radius,
					 bottom : this.position.y + this.radius };
		}
	});

User.prototype.handleInput = function(delta) {
	var playingState = powerupjs.GameStateManager.get(ID.game_state_playing);
	if (playingState.isDying)
		return;
	if (powerupjs.Touch.isTouchDevice) {
		this.handleInputTouch(delta);
	} else {
		this.handleInputMouse(delta);
	}
};

User.prototype.handleInputTouch = function(delta) {
	if (powerupjs.Touch.isTouching)
		this.trigger(delta);
};

User.prototype.handleInputMouse = function(delta) {
	if (powerupjs.Mouse.left.down)
		this.trigger(delta);
};

User.prototype.reset = function() {
	this.velocity = powerupjs.Vector2.zero;
	this.position = new powerupjs.Vector2(200,powerupjs.Game.size.y / 2);
	this.sheetIndex = 0;
	this.moveRate = 2;
};

User.prototype.trigger = function(delta) {

	var computePosition = function(obj, delta) {
		return obj.moveRate * delta * powerupjs.Game.size.y;
	};

	this.position.y += computePosition(this, delta);
	if ( (this.position.y <= 0) || 
		 (this.position.y + this.height >= powerupjs.Game.size.y) ) {
		this.moveRate *= -1;
		sounds.ball.play();
		this.position.y += computePosition(this, delta);
	}

	// Change sprite based on moving direction
	if (this.moveRate < 0) this.sheetIndex = 0;
	else this.sheetIndex = 1;

};

User.prototype.release = function() {
	// Move User object to y-location based on radius
	sounds.ball.play();
	this.position.y = this.computePosition();
};

User.prototype.computePosition = function() {
	var relativeSize = ((this.radius - this._minRadius) / (this._maxRadius - this._minRadius));
	var playableArea = powerupjs.Game.size.y - (this._maxRadius * 2);
	return ( playableArea * (1 - relativeSize) ) + this._maxRadius;
};

/*
User.prototype.draw = function() {
	if (this.projection) {
		powerupjs.Canvas2D.drawRectangle(0, this.computePosition(), 50, 10, powerupjs.Color.red);
		//Canvas2D.drawCircle(this.position.x, this.computePosition(), this.radius, 
		//	this.fillColor, this.strokeColor, 0.5);
	}
	powerupjs.Canvas2D.drawCircle(this.position.x, this.position.y, this.radius, 
		this.fillColor, this.strokeColor);
};
*/

User.prototype.dying = function() {
	//this.fillColor = powerupjs.Color.red;
	this.sheetIndex = 2;
	this.velocity.y += 50;
};

