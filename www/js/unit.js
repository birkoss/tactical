function Unit(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.clearATB();
};

Unit.prototype = Object.create(Phaser.Group.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.setSprite = function(themeName) {
    let image = this.backgroundContainer.create(0, 0, "tile:blank");
    image.scale.set(4);
    image.tint = 0xff0000;
};

Unit.prototype.getATBMax = function() {
    return 100;
};

Unit.prototype.getATBFillRate = function() {
    return 1;
};

Unit.prototype.updateATB = function() {
    this.ATB = Math.min(this.ATB + this.getATBFillRate(), this.getATBMax());
};

Unit.prototype.clearATB = function() {
    this.ATB = 0;
};

Unit.prototype.isReady = function() {
    return (this.ATB >= this.getATBMax());
};
