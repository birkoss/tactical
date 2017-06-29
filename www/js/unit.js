function Unit(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.commands = [];

    this.clearATB();
};

Unit.prototype = Object.create(Phaser.Group.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.setSprite = function(themeName) {
    let image = this.backgroundContainer.create(0, 0, "tile:blank");
    image.scale.set(4);
    image.tint = 0xff0000;
};

/* ATB */

Unit.prototype.clearATB = function() {
    this.ATB = 0;
};

Unit.prototype.getMaxATB = function() {
    return 100;
};

Unit.prototype.getFillRateATB = function() {
    return 1;
};

Unit.prototype.isReady = function() {
    return (this.ATB >= this.getMaxATB());
};

Unit.prototype.updateATB = function() {
    this.ATB = Math.min(this.ATB + this.getFillRateATB(), this.getMaxATB());
};

/* Commands */

Unit.prototype.addCommand = function(command) {
    this.commands.push(command);
};
