"use strict";

function TitleMenuState(layer) {
	powerupjs.GameObjectList.call(this, layer);

	// Add the objects
    var background = new powerupjs.SpriteGameObject(sprites.background, ID.layer_overlays);
    background.position = background.screenCenter;
    this.add(background);

    this.titleHeader = new powerupjs.Label(global.font, "120px", ID.layer_overlays_1);
    this.titleHeader.text = "Ballsy";
    this.titleHeader.align = "left";
    this.titleHeader.color = global.color;
    this.titleHeader.position = new powerupjs.Vector2(414, 400);
    this.add(this.titleHeader);

    this.titleSubHeader = new powerupjs.Label(global.font, "46px", ID.layer_overlays_1);
    this.titleSubHeader.text = "Press to play";
    this.titleSubHeader.align = "left";
    this.titleSubHeader.color = this.titleHeader.color;
    this.titleSubHeader.position = new powerupjs.Vector2(420, 530);
    this.add(this.titleSubHeader);

    this.titleWall = new powerupjs.SpriteGameObject(sprites.wall, ID.layer_overlays_1);
    this.titleWall.position = new powerupjs.Vector2(210, 0);
    this.add(this.titleWall);

    this.titleUser = new powerupjs.SpriteGameObject(sprites.userSheet, ID.layer_overlays_1);
    this.titleUser.position = new powerupjs.Vector2(200, (powerupjs.Game.size.y / 2) - (this.titleUser.height / 2));
    this.add(this.titleUser);

}
TitleMenuState.prototype = Object.create(powerupjs.GameObjectList.prototype);

TitleMenuState.prototype.handleInput = function (delta) {
    powerupjs.GameObjectList.prototype.handleInput.call(this, delta);
    if (powerupjs.Mouse.left.pressed || powerupjs.Touch.isTouching)
        // Tutorial
        if (localStorage && !localStorage.seenTutorial) {
            localStorage.seenTutorial = true;
            powerupjs.GameStateManager.switchTo(ID.game_state_tutorial);
        // Playing Game
        } else if (localStorage && localStorage.seenTutorial) {
            powerupjs.GameStateManager.switchTo(ID.game_state_playing);
        // Tutorial if no localStorage - default
        } else {
            powerupjs.GameStateManager.switchTo(ID.game_state_tutorial);
        }
};
