"use strict";

function PauseButton(spriteSheet, layer, id) {
	powerupjs.Button.call(this, spriteSheet, layer, id);
	this.isPaused = false;
	this.position = new powerupjs.Vector2(30, 30);
}
PauseButton.prototype = Object.create(powerupjs.Button.prototype);

PauseButton.prototype.handleInput = function(delta) {
	powerupjs.Button.prototype.handleInput.call(this, delta);

	// Toggle pause button
	if (this.pressed) {
		this.isPaused = !this.isPaused;
		this.sheetIndex = 1 - this.sheetIndex; // Toggle sheet index between 0 and 1
	}
};

