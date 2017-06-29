function Map(game) {
    Phaser.Group.call(this, game);

    this.tilesContainer = this.game.add.group();
    this.addChild(this.tilesContainer);

    this.unitsContainer = this.game.add.group();
    this.addChild(this.unitsContainer);

    this.onUnitReady = new Phaser.Signal();
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
            let tile = new Tile(this.game);
            tile.setBackground();

            tile.x = gridX * tile.width;
            tile.y = gridY * tile.height;

            tile.gridX = gridX;
            tile.gridY = gridY;

            this.tilesContainer.addChild(tile);

            tile.setBorder(false);

        }
    }
};

Map.prototype.addUnit = function(unit) {
    unit.setSprite();

    unit.x = unit.gridX * unit.width;
    unit.y = unit.gridY * unit.height;

    this.unitsContainer.addChild(unit);
};

Map.prototype.updateUnits = function() {
    let unit = null;

    /* Check for units ready to action */
    this.unitsContainer.forEach(function(single_unit) {
        if (unit == null && single_unit.isReady()) {
            unit = single_unit;
        }
    }, this);

    /* Update the ATB if no units are ready */
    if (unit == null) {
        this.unitsContainer.forEach(function(single_unit) {
            single_unit.updateATB();
        }, this);
    } else {
        this.onUnitReady.dispatch(unit);
    }
};
