"use strict";

function Enemy(sprite, layer, id) {
	powerupjs.SpriteGameObject.call(this, sprite, layer, id);
	this.playingState = powerupjs.GameStateManager.get(ID.game_state_playing);

	// Some defaults
	this._intelligence = 200; // higher = smarter enemy
	this._maxX = powerupjs.Game.size.x; + this.width;
	this.position = new powerupjs.Vector2(this._maxX, 0); // Initialize off screen
}
Enemy.prototype = Object.create(powerupjs.SpriteGameObject.prototype);

Enemy.prototype.reset = function() {
	this.calculateRandomPosition();
};

Enemy.prototype.update = function(delta) {
	powerupjs.SpriteGameObject.prototype.update.call(this,delta);

	
	// Initialize the enemy based on wall position
	if (this.velocity.x === 0) {
		var leftWindow = powerupjs.Game.size.x * 0.4;
		var rightWindow = powerupjs.Game.size.x * 0.5;
		if (this.playingState.backWall.position.x <= rightWindow &&
			this.playingState.backWall.position.x > leftWindow) {
			this.velocity = this.playingState.backWall.velocity;
			this.calculateRandomPosition();
		}
	}

	// Add some AI to enemy motion
	if (this.velocity.x != 0) {
		this.followUser(delta);
	}

	// Identify collision
	if (this.isColliding()) {
		this.playingState.lives -= 1;
		this.playingState.isDying = true;
	}
	
	// Reset if off edge of screen
	if (this.playingState.isOutsideWorld(this)) {
		this.reset();
	}

};

Enemy.prototype.isColliding = function() {
	var user = this.playingState.user;
	var xDist = this.boundingBox.center.x - user.boundingBox.center.x;
	var yDist = this.boundingBox.center.y - user.boundingBox.center.y;
	var dist = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2));
	if (dist < (user.width / 2 + this.width / 2 - 8))
		return true;
	else
		return false;
};

Enemy.prototype.followUser = function(delta) {
	var user = this.playingState.user;
	var normDistance = (user.boundingBox.center.y - this.boundingBox.center.y) / 
					    powerupjs.Game.size.y;
	this.position.y += normDistance * delta * this._intelligence;
	//console.log(user.boundingBox.center.y, this.boundingBox);
};

Enemy.prototype.calculateRandomPosition = function() {
	var newY = Math.random() * (powerupjs.Game.size.y - this.height);
	this.position = new powerupjs.Vector2(this._maxX, newY);
	return;
};

