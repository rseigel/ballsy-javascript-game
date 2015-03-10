"use strict";

function GameOverState(layer) {
	powerupjs.GameObjectList.call(this, layer);

    // Some settings
	var centerLine = 565;
    this.computeFinalScore = false;
    this.playingState = powerupjs.GameStateManager.get(ID.game_state_playing);

	// Add the objects
    this.gameOverHeader = new powerupjs.Label(global.font, "68px", ID.layer_overlays_1);
    this.gameOverHeader.text = "Ballsy";
    this.gameOverHeader.color = global.color;
    this.gameOverHeader.position = new powerupjs.Vector2(centerLine, 200);
    this.gameOverHeader.align = "center";
    this.add(this.gameOverHeader);

    this.finalScore = new powerupjs.Label(global.font, "40px", ID.layer_overlays_1);
    this.finalScore.color = global.color;
    this.finalScore.position = new powerupjs.Vector2(centerLine, 400);
    this.finalScore.align = "center";
    this.add(this.finalScore);

    this.bestScore = new powerupjs.Label(global.font, "48px", ID.layer_overlays_1);
    this.bestScore.color = global.color;
    this.bestScore.position = new powerupjs.Vector2(centerLine, 450);
    this.bestScore.align = "center";
    this.add(this.bestScore);

    this.replayButton = new powerupjs.Button(sprites.replayButton, ID.layer_overlays_1);
    this.replayButton.position = new powerupjs.Vector2(centerLine - this.replayButton.width / 2, 520);
    this.add(this.replayButton);

    // TODO: Add social sharing
    // this.shareButton = new powerupjs.Button(sprites.shareButton, ID.layer_overlays_1);
    // this.shareButton.position = new powerupjs.Vector2(centerLine - this.shareButton.width / 2, 650);
    // this.add(this.shareButton);

}
GameOverState.prototype = Object.create(powerupjs.GameObjectList.prototype);

GameOverState.prototype.handleInput = function(delta) {
    powerupjs.GameObjectList.prototype.handleInput.call(this, delta);
    if (this.replayButton.pressed) {
        this.playingState.reset();
        this.computeFinalScore = false;
        this.playingState.backWall.smartWall = false;
        powerupjs.GameStateManager.switchTo(ID.game_state_playing);
    }
};

GameOverState.prototype.update = function(delta) {

    // Compute final score once and update bestscore
    if (!this.computeFinalScore) {

        // Scores
        this.finalScore.text = "Score: " + this.playingState.score.score;
        this.bestScore.text = this.getBestScore(this.playingState.score.score);

        // Final score computed
        this.computeFinalScore = !this.computeFinalScore;
    }

    // Call the rest of update
    powerupjs.GameObjectList.prototype.update.call(this, delta);
};

GameOverState.prototype.draw = function() {

    // Draw items from playing state
    this.playingState.background.draw();
    this.playingState.backWall.draw();
    this.playingState.frontWall.draw();
    if (this.playingState.enemy)
        this.playingState.enemy.draw();

    powerupjs.GameObjectList.prototype.draw.call(this);

};

// Deal with local storage for best score
GameOverState.prototype.getBestScore = function(finalScore) {
    var bestScore = null;
    if (localStorage && localStorage.ballsyBestScore) {
        localStorage.ballsyBestScore = Math.max(finalScore, localStorage.ballsyBestScore);
        bestScore = localStorage.ballsyBestScore;
    } else if (localStorage && !localStorage.ballsyBestScore) {
        localStorage.ballsyBestScore = finalScore;
        bestScore = localStorage.ballsyBestScore;
    } else {
        bestScore = finalScore;
    }
    return "Best Score: " + bestScore;
};

