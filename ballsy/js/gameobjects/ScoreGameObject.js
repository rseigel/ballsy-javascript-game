"use strict";

function ScoreGameObject(fontName, fontSize, layer, id) {
    powerupjs.Label.call(this, fontName, fontSize, layer, id);
    this.text = 0;
    this._align = "right";
}

ScoreGameObject.prototype = Object.create(powerupjs.Label.prototype);

Object.defineProperty(ScoreGameObject.prototype, "score",
    {
        get: function () {
            return this._contents;
        },
        set: function (value) {
            if (value >= 0)
                this.text = value;
        }
    });

ScoreGameObject.prototype.reset = function () {
    this.score = 0;
};