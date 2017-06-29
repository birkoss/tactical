function Tile(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.borderContainer = this.game.add.group();
    this.addChild(this.borderContainer);
};

Tile.prototype = Object.create(Phaser.Group.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.setBackground = function(themeName) {
    let image = this.backgroundContainer.create(0, 0, "tile:blank");
    image.scale.set(4);
    image.tint = 0x00cc00;
};

Tile.prototype.setBorder = function() {
    let border = this.borderContainer.create(0, 0, "tile:border");
    border.scale.set(3);
    border.alpha = 0.3;
    border.x = ((this.backgroundContainer.width - border.width) / 2);
    border.y = ((this.backgroundContainer.height - border.height) / 2);
};
