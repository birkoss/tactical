function Map(game) {
    Phaser.Group.call(this, game);

    this.tilesContainer = this.game.add.group();
    this.addChild(this.tilesContainer);

    this.unitsContainer = this.game.add.group();
    this.addChild(this.unitsContainer);

    this.itemsContainer = this.game.add.group();
    this.addChild(this.itemsContainer);

    this.effectsContainer = this.game.add.group();
    this.addChild(this.effectsContainer);

    this.onUnitReady = new Phaser.Signal();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.createGrid = function(gridWidth, gridHeight) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
};

Map.prototype.setTheme = function(themeName) {
    this.themeName = themeName;
};

Map.prototype.generate = function() {
    let image;

    this.grid = [];
    for (gridY=0; gridY<this.gridHeight; gridY++) {
        let row = [];
        for (gridX=0; gridX<this.gridWidth; gridX++) {
            let tile = new Tile(this.game);
            tile.setBackground();

            tile.x = gridX * tile.width;
            tile.y = gridY * tile.height;

            tile.gridX = gridX;
            tile.gridY = gridY;

            this.tilesContainer.addChild(tile);

            tile.setBorder(false);

            row.push(tile);
        }
        this.grid.push(row);
    }
};

Map.prototype.addItem = function(itemSprite, gridX, gridY) {
    if (this.getItemAt(gridX, gridY).length == 0) {
       let item = this.itemsContainer.create(0, 0, "item:" + itemSprite);
       item.scale.set(2);
       item.gridX = gridX;
       item.gridY = gridY;
       item.x = item.gridX * item.width;
       item.y = item.gridY * item.height;
    }
};

Map.prototype.addUnit = function(unit) {
    unit.onDeath.add(this.removeUnit, this);
    unit.setSprite();

    unit.x = unit.gridX * unit.width;
    unit.y = unit.gridY * unit.height;

    this.unitsContainer.addChild(unit);
};

Map.prototype.removeUnit = function(unit) {
    this.grid[unit.gridY][unit.gridX].addBlood();
    this.unitsContainer.remove(unit);
    unit.destroy();
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
            if (single_unit.isAlive()) {
                single_unit.updateATB();
            }
        }, this);
    } else {
        this.onUnitReady.dispatch(unit);
    }
};

Map.prototype.getUnits = function(target, position, range) {
    return this.unitsContainer.filter(function(single_unit) {
        /* Never target dead unit */
        if (!single_unit.isAlive()) {
            return false;
        }

        if (target != null) {
            /* Should be an Ally, and is not */
            if (target > 0 && target != single_unit.team) {
                return false;
            }
            /* Should be a Fow, and is not */
            if (target < 0 && Math.abs(target) == single_unit.team) {
                return false;
            }
            /* @TODO Should be itself */
        }

        if (position != null && range != null) {
            /* Should be in range, and is not */
            if (Math.abs(single_unit.gridX - position.gridX) + Math.abs(single_unit.gridY - position.gridY) > range) {
                return false;
            }
        }

        return true;
    }, this).list;
};

Map.prototype.getItemAt = function(gridX, gridY) {
    return this.itemsContainer.filter(function(single_item) {
        return (single_item.gridX == gridX && single_item.gridY == gridY);
    }, this).list;
};
