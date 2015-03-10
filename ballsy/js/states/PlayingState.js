"use strict";

function PlayingState(layer, id) {
	powerupjs.GameObjectList.call(this, layer, id);

	var padding = 30;

	// Add the Game objects
	this.background = new powerupjs.SpriteGameObject(sprites.background, ID.layer_background);
    this.background.position = this.background.screenCenter;
    this.add(this.background);

	this.backWall = new Wall(ID.layer_objects);
	this.add(this.backWall);

	this.user = new User(sprites.userSheet, ID.layer_objects_1);
	this.add(this.user);

	this.frontWall = new FrontWall(this.backWall, ID.layer_objects_2);
	this.add(this.frontWall);

	this.score = new ScoreGameObject(global.font, "72px", ID.layer_objects_3);
    this.score.position = new powerupjs.Vector2(powerupjs.Game.size.x - padding, padding);
    this.score.color = global.color;
    this.add(this.score);

    this.pauseButton = new PauseButton(sprites.pauseButtonSheet, ID.layer_overlays_3);
    this.add(this.pauseButton);

    this.pauseLabel = new powerupjs.Label(global.font, "80px", ID.layer_overlays_1);
    this.pauseLabel.visible = false;
    this.pauseLabel.text = "Game Paused";
    this.pauseLabel.align = "center";
    this.pauseLabel.color = powerupjs.Color.white;
    this.pauseLabel.position = new powerupjs.Vector2(powerupjs.Game.size.x / 2, powerupjs.Game.size.y / 3);
    this.add(this.pauseLabel);

    // *********************
    // HELP stuff
    var centerLine = powerupjs.Game.size.x * 0.5;
    this.helpButton = new powerupjs.Button(sprites.helpButton, ID.layer_overlays_3);
    this.helpButton.position = new powerupjs.Vector2(padding, powerupjs.Game.size.y - padding - sprites.helpButton.height);
    this.helpButton.isPressed = false;
    this.add(this.helpButton);

	this.helpBackground = new powerupjs.SpriteGameObject(sprites.helpBackground, ID.layer_overlays_3);
    this.helpBackground.position = this.helpBackground.screenCenter;
    this.helpBackground.visible = false;
    this.add(this.helpBackground);

    this.helpInstructions = new powerupjs.SpriteGameObject(sprites.instructions, ID.layer_overlays_3);
    this.helpInstructions.position = new powerupjs.Vector2(centerLine, 0);
    this.helpInstructions.visible = false;
    this.add(this.helpInstructions);

    this.helpDone = new powerupjs.Button(sprites.doneButton, ID.layer_overlays_3);
    this.helpDone.position = new powerupjs.Vector2(centerLine + 50, powerupjs.Game.size.y - this.helpDone.height - 75);
    this.helpDone.visible = false;
    this.add(this.helpDone);
    // *********************

    // Some gameplay settings
	this.lives = 1;
	this.isDying = false;
	this.bestScore = 0;
	this.initEnemyScore = 5;
	this.initSmartWallScore = 10;

}
PlayingState.prototype = Object.create(powerupjs.GameObjectList.prototype);

PlayingState.prototype.handleInput = function(delta) {

	// Handle pause button input
	if (!this.helpButton.isPressed) this.pauseButton.handleInput(delta);

	// Pause label visibility
	this.pauseLabel.visible = this.pauseButton.isPaused;

	// Handle help done button
	if (this.helpButton.isPressed) this.helpDone.handleInput(delta);

	// Toggle the help button and objects
	if (this.helpButton.pressed || this.helpDone.pressed) this.toggleHelp();

	// Game is not paused AND helpButton is not pressed, handle all input
	if ((!this.pauseButton.isPaused && !this.pauseButton.down) && !this.helpButton.isPressed) {
		powerupjs.GameObjectList.prototype.handleInput.call(this, delta);
	}

};
PlayingState.prototype.update = function(delta) {

	// Playing the game
	if (!this.gameOver()) {
		// The game is paused
		if (this.pauseButton.isPaused) {
			this.pauseButton.sheetIndex = 1;
		} else {
			this.pauseButton.sheetIndex = 0;
			// The help button is not engaged
			if (!this.helpButton.isPressed) {
				powerupjs.GameObjectList.prototype.update.call(this, delta);

				// Add enemies
				if (this.score.score >= this.initEnemyScore && !this.enemy) {
					this.enemy = new Enemy(sprites.enemy, ID.layer_objects_1);
					this.add(this.enemy);
					//console.log(this.enemy.velocity, this.enemy.position);
				}
			}
		}

	} else if (this.gameOver() && this.isDying) {
		this.dying(delta);
		this.user.update(delta);
	} else {
    	// Now switch Game State
    	powerupjs.GameStateManager.switchTo(ID.game_state_gameover);
	}
};

PlayingState.prototype.reset = function() {
	powerupjs.GameObjectList.prototype.reset.call(this);
	this.lives = 1;
	this.isDying = false;
	this.pauseLabel.visible = false;
	this.helpButton.isPressed = false;
	this.helpDone.visible = false;
	this.helpInstructions.visible = false;
	this.helpBackground.visible = false;
	if (this.enemy) {
		this.remove(this.enemy);
		this.enemy = null;
	}
	//console.log(this.enemy);
};

// Only considering side scrolling. Check X only.
PlayingState.prototype.isOutsideWorld = function(obj) {
	if (obj.boundingBox.right <= 0 || obj.boundingBox.top >= powerupjs.Game.size.y) 
		return true;
	else {
		return false;
	}
};

PlayingState.prototype.dying = function(delta) {
	if (!this.isOutsideWorld(this.user)) {
		this.user.dying();
	} else {
		this.isDying = false;
	}
};

PlayingState.prototype.gameOver = function() {
	return this.lives <= 0;
};

PlayingState.prototype.toggleHelp = function() {
	this.helpDone.visible = !this.helpDone.visible;
	this.helpInstructions.visible = !this.helpInstructions.visible;
	this.helpBackground.visible = !this.helpBackground.visible;
	this.helpButton.isPressed = !this.helpButton.isPressed;
	this.helpButton.pressed = !this.helpButton.pressed;
}

