function Map(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.createGrid = function(gridWidth, gridHeight) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    this.grid = [];
    for (gridY=0; gridY<this.gridHeight; gridY++) {
        let row = [];
        for (gridX=0; gridX<this.gridWidth; gridX++) {
            row.push(0);
        }
        this.grid.push(row);
    }
};

Map.prototype.setTheme = function(themeName) {
    this.themeName = themeName;
};

Map.prototype.generate = function() {
    let image;

    for (gridY=0; gridY<this.gridHeight; gridY++) {
        for (gridX=0; gridX<this.gridWidth; gridX++) {
            image = this.backgroundContainer.create(0, 0, "tile:blank");
            image.scale.set(4);
            image.tint = 0x00cc00;
            image.x = gridX * image.width;
            image.y = gridY * image.height;

            let border = this.backgroundContainer.create(0, 0, "tile:border");
            border.scale.set(3);
            if (gridX > 0 && gridY > 0) {
                border.alpha = 0.1;
            } else {
                border.alpha = 0.3;
            }
            border.x = image.x + ((image.width - border.width) / 2);
            border.y = image.y + ((image.height - border.height) / 2);

        }
    }
};
