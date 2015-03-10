"use strict";

var ID = {};
var sprites = {};
var sounds = {};

var global = {
    font : "Avenir",
    color : '#FFC800'
};

powerupjs.Game.loadAssets = function() {
	// Game-specific assets are loded here
	var loadSprite = function (sprite) {
        return new powerupjs.SpriteSheet("assets/sprites/" + sprite);
    };

    var loadSound = function (sound, looping) {
        return new powerupjs.Sound("assets/sounds/" + sound, looping);
    };

    sprites.background = loadSprite("spr_background.png");
    sprites.tutorialBackground = loadSprite("spr_tutorial_background.png");
    sprites.userSheet = loadSprite("spr_user@3.png");
    sprites.wall = loadSprite("spr_wall.png");
    sprites.enemy = loadSprite("spr_enemy.png");
    sprites.instructions = powerupjs.Touch.isTouchDevice ? loadSprite("spr_instructionsTouch.png") : loadSprite("spr_instructionsMouse.png");
    sprites.replayButton = loadSprite("spr_replay_button.png");
    sprites.doneButton = loadSprite("spr_gotit_button.png");
    sprites.pauseButtonSheet = loadSprite("spr_pause@2.png");
    sprites.helpButton = loadSprite("spr_help_button.png");
    sprites.helpBackground = loadSprite("spr_help_background.png");
    // TODO: Add social sharing
    //sprites.shareButton = loadSprite("spr_share_button.png");

    sounds.ball = loadSound("short_pop_sound");
    sounds.beep = loadSound("short_beep");
    sounds.beep.volume = 0.1;

};

powerupjs.Game.initialize = function() {

    // define the layers
    ID.layer_background = 1;
    ID.layer_background_1 = 2;
    ID.layer_background_2 = 3;
    ID.layer_background_3 = 4;
    ID.layer_tiles = 10;
    ID.layer_objects = 20;
    ID.layer_objects_1 = 21;
    ID.layer_objects_2 = 22;
    ID.layer_objects_3 = 23;
    ID.layer_overlays = 30;
    ID.layer_overlays_1 = 31;
    ID.layer_overlays_2 = 32;
    ID.layer_overlays_3 = 33;
    ID.layer_overlays_4 = 34;

    // create the different game modes
    ID.game_state_title = powerupjs.GameStateManager.add(new TitleMenuState());
    ID.game_state_tutorial = powerupjs.GameStateManager.add(new TutorialState());
    ID.game_state_playing = powerupjs.GameStateManager.add(new PlayingState());
    ID.game_state_gameover = powerupjs.GameStateManager.add(new GameOverState());

    // set the current game mode
    powerupjs.GameStateManager.switchTo(ID.game_state_title);

	// Create the game world
    // OLD METHOD. Leaving it commented out for reference.
	//Game.gameWorld = new BallsyGameWorld();
};