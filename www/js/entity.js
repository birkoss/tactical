function Entity(game, type) {
    Phaser.Group.call(this, game);

    this.type = type;

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);
    this.facing = Entity.Facing.Left;
};

Entity.prototype = Object.create(Phaser.Group.prototype);
Entity.prototype.constructor = Entity;

Entity.Facing = {
    Left: 2,
    Right: -2
};

Entity.prototype.setSprite = function(spriteName) {
    this.spriteName = spriteName;
};

Entity.prototype.drawAt = function(gridX, gridY) {
    let image = this.backgroundContainer.create(0, 0, this.spriteName);
    image.anchor.setTo(0.5, 0.5);
    image.scale.set(2);
    image.x += image.width/2;
    image.y += image.height/2;

    this.x = gridX * image.width;
    this.y = gridY * image.height;
};

Entity.prototype.face = function(newFacing) {
    if (this.facing != newFacing) {
        this.backgroundContainer.getChildAt(0).scale.x = newFacing;
        this.facing = newFacing;
    }
};
