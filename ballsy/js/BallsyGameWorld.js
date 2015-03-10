"use strict";

function BallsyGameWorld(layer, id) {
	GameObjectList.call(this, layer, id);

	// Add the title screen objects
	var titleScreen = new TitleScreenObjects(ID.layer_overlays_2, ID.titleScreen);
	this.add(titleScreen);

	// Add the tutorial objects
	var tutorialScreen = new TutorialObjects(ID.layer_overlays_2, ID.tutorialScreen);
	tutorialScreen.visible = false;
	this.add(tutorialScreen);

	// Add the Game objects
	var gamePlayObjects = new GamePlayObjects();
	this.add(gamePlayObjects);

	// Add the Game over screen
	var gameOverScreen = new GameOverObjects(ID.layer_overlays_2, ID.gameOverScreen);
	gameOverScreen.visible = false;
	this.add(gameOverScreen);

	// A few GameWorld member variables
	this.lives = 1;
	this.isDying = false;
	this.computeFinalScore = false;
	this.bestScore = 0;
}

BallsyGameWorld.prototype = Object.create(GameObjectList.prototype);

BallsyGameWorld.prototype.handleInput = function(delta) {

    // title screen
    var titleScreen = this.root.find(ID.titleScreen);
    var tutorialScreen = this.root.find(ID.tutorialScreen);
    if (titleScreen.visible) {
        if (Mouse.left.pressed || Touch.isPressing) {
            titleScreen.visible = false;
        	tutorialScreen.visible = true;
        }
        return;
    }

    // Tutorial screen
    if (tutorialScreen.visible) {
    	var done = this.root.find(ID.doneButton);
    	if (done.pressed) {
    		tutorialScreen.visible = false;
    	}
    }

    // Game over screen
    var gameOverScreen = this.root.find(ID.gameOverScreen);
    if (gameOverScreen.visible) {
        if (Mouse.left.up || Touch.touchRelease)
        	this.reset();
    }

    // Playing the game
	if (!this.gameOver()) {
		GameObjectList.prototype.handleInput.call(this, delta);
	}
};

BallsyGameWorld.prototype.update = function(delta) {

	// title screen
    var titleScreen = this.root.find(ID.titleScreen);
    if (titleScreen.visible)
        return;

    // Tutorial screen
    var tutorialScreen = this.root.find(ID.tutorialScreen);
    if (tutorialScreen.visible)
    	return;

    // Game over screen
    var gameOverScreen = this.root.find(ID.gameOverScreen);
    if (this.gameOver() && !this.isDying){
    	gameOverScreen.visible = true;
    	// Add the score to final score
    	if (!this.computeFinalScore) {
    		var finalScore = this.root.find(ID.finalScore);
    		var bestScore = this.root.find(ID.bestScore);
    		var score = this.root.find(ID.score);
    		finalScore.text = "Score: " + score.score;

    		// Deal with local storage for best score
    		if (localStorage && localStorage.ballsyBestScore) {
    			localStorage.ballsyBestScore = Math.max(score.score, localStorage.ballsyBestScore);
    			this.bestScore = localStorage.ballsyBestScore;
    		} else if (localStorage && !localStorage.ballsyBestScore) {
    			localStorage.ballsyBestScore = score.score;
    			this.bestScore = localStorage.ballsyBestScore;
    		} else {
    			this.bestScore = score.score;
    		}
    		bestScore.text = "Best Score: " + this.bestScore;

    		// Final score computed
    		this.computeFinalScore = !this.computeFinalScore;
    	}
    }

    // Playing the game
	if (!this.gameOver()) {
		GameObjectList.prototype.update.call(this, delta);
	} else if (this.gameOver() && this.isDying) {
		var user = this.root.find(ID.user);
		this.dying(delta);
		user.update(delta);
	}

};

/*
BallsyGameWorld.prototype.draw = function() {
};
*/

BallsyGameWorld.prototype.reset = function() {
	GameObjectList.prototype.reset.call(this);
	var gameOverScreen = this.root.find(ID.gameOverScreen);
    gameOverScreen.visible = false; 
    var titleScreen = this.root.find(ID.titleScreen);
    titleScreen.visible = false;
	this.lives = 1;
	this.isDying = false;
	this.computeFinalScore = false;
};

// Only considering side scrolling. Check X only.
BallsyGameWorld.prototype.isOutsideWorld = function(position, radius) {
	var xRight = position.x + radius;
	var yTop = position.y - radius;
	if (xRight <= 0 || yTop >= Game.size.y) 
		return true;
	else {
		return false;
	}
};

BallsyGameWorld.prototype.dying = function(delta) {
	var user = this.root.find(ID.user);
	if (!this.isOutsideWorld(user.position, user.radius)) {
		user.dying();
	} else {
		this.isDying = false;
	}
};

BallsyGameWorld.prototype.gameOver = function() {
	return this.lives <= 0;
};

BallsyGameWorld.prototype.drawBackground = function() {
	Canvas2D.drawSquare(0, 0, Game.size.x, Game.size.y, this.backgroundColor);

	/*
	var circleRadius = this.user.maxRadius;
	for (var row = 0; row < 1000; row++) {
		for (var col = 0; col < 1000; col++) {
			var x = col * circleRadius * 2;
			var y = row * circleRadius * 2;
			Canvas2D.drawCircle(x, y, circleRadius, Color.darkGray, 'none');
			if (this.isOutsideWorld({x : x, y : y}, circleRadius))
				break;
		}
		if (this.isOutsideWorld({x : x, y : y}, circleRadius))
			break;
	}
	*/
};
