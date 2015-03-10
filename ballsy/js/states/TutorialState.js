"use strict";

function TutorialState(layer) {
	powerupjs.GameObjectList.call(this, layer);

	var centerLine = powerupjs.Game.size.x * 0.5;

    // Add the Tutorial objects
    this.background = new powerupjs.SpriteGameObject(sprites.tutorialBackground, ID.layer_background);
    this.background.position = this.background.screenCenter;
    this.add(this.background);

    // Add the size guidance
    this.instructions = new powerupjs.SpriteGameObject(sprites.instructions, ID.layer_overlays_1);
    this.instructions.position = new powerupjs.Vector2(centerLine, 0);
    this.add(this.instructions);

    // Add the button to finish tutorial
    this.done = new powerupjs.Button(sprites.doneButton, ID.layer_overlays_1);
    this.done.position = new powerupjs.Vector2(centerLine + 50, powerupjs.Game.size.y - this.done.height - 75);
    this.add(this.done);

    // Add the user
    this.user = new User(sprites.userSheet, ID.layer_objects_1);
    this.add(this.user);

}
TutorialState.prototype = Object.create(powerupjs.GameObjectList.prototype);

TutorialState.prototype.handleInput = function (delta) {
    powerupjs.GameObjectList.prototype.handleInput.call(this, delta);
    if (this.done.pressed)
        powerupjs.GameStateManager.switchTo(ID.game_state_playing);
};

