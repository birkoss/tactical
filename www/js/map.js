function Map(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.tilesContainer = this.game.add.group();
    this.addChild(this.tilesContainer);

    this.unitsContainer = this.game.add.group();
    this.addChild(this.unitsContainer);

    this.itemsContainer = this.game.add.group();
    this.addChild(this.itemsContainer);

    this.effectsContainer = this.game.add.group();
    this.addChild(this.effectsContainer);

    this.onUnitReady = new Phaser.Signal();

    this.onMapClicked = new Phaser.Signal();
    this.selectedPosition = null;
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

    /* Create a transparent background to track clicks */
    image = this.backgroundContainer.create(0, 0, "tile:blank");
    image.alpha = 0;
    image.width = this.tilesContainer.width;
    image.height = this.tilesContainer.height;
    image.inputEnabled = true;
    image.events.onInputDown.add(this.selectItem, this);
    image.events.onInputUp.add(this.releaseItem, this);
};

Map.prototype.isEmptyAt = function(gridX, gridY) {
    return (this.getEntitiesAt(gridX, gridY).length == 0);
};

Map.prototype.isInBound = function(gridX, gridY) {
    return (gridX >= 0 && gridY >= 0 && gridX < this.gridWidth && gridY < this.gridHeight);
};

Map.prototype.addItem = function(itemID, gridX, gridY) {
    if (this.getItemAt(gridX, gridY).length == 0) {
        let item = new Entity(this.game, "item");
        item.load(itemID);
        item.draw(gridX, gridY);
        item.type = "item";

        this.itemsContainer.addChild(item);
    }
};

Map.prototype.addEffect = function(effect) {
    this.effectsContainer.addChild(effect);
};

Map.prototype.addUnit = function(unit) {
    unit.type = "unit";
    unit.onDeath.add(this.removeUnit, this);
    unit.load(unit.entityID);
    unit.draw();

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
                single_unit.updateMove();
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

Map.prototype.selectItem = function(item, pointer) {
    this.selectedPosition = this.getPositionFromXY(pointer.x - this.x, pointer.y - this.y);

    let entities = this.getEntitiesAt(this.selectedPosition.gridX, this.selectedPosition.gridY);

    this.isDragging = null;
    if (entities.length > 0) {
        this.onMapClicked.dispatch(entities[0]);

        if (entities[0].type == "unit" && entities[0].team == Unit.Team.Player && entities[0].canMove()) {
            console.log("Allow drag");
            this.game.input.addMoveCallback(this.followUnit, this);
            this.isDragging = false;
        }
    }
};

Map.prototype.followUnit = function(pointer) {
    let position = this.getPositionFromXY(pointer.x - this.x, pointer.y - this.y);
    if (position != null && (this.selectedPosition.gridX != position.gridX || this.selectedPosition.gridY != position.gridY)) {
        this.isDragging = true;

        if (this.isInBound(position.gridX, position.gridY) && this.isEmptyAt(position.gridX, position.gridY)) {
            let entities = this.getEntitiesAt(this.selectedPosition.gridX, this.selectedPosition.gridY);
            if (entities.length > 0) {
                entities[0].move(position.gridX, position.gridY);
                this.selectedPosition = position;
                this.resetTiles();
                this.highlightTile(position.gridX, position.gridY);
            }
        }
    }
};

Map.prototype.releaseItem = function(item, pointer) {
    if (this.isDragging != null) {
        let entities = this.getEntitiesAt(this.selectedPosition.gridX, this.selectedPosition.gridY);
        if (entities.length > 0) {
            entities[0].clearMove();
            /* Moving kinda count like a move, so reset the ATB */
            entities[0].clearATB();
        }
        console.log("Disable drag");
        this.game.input.deleteMoveCallback(this.followUnit, this);

        this.isDragging = null;
    }

    this.selectedPosition = null;
};

Map.prototype.getEntitiesAt = function(gridX, gridY) {
    let entities = [];

    /* Verify the items */
    entities = entities.concat(this.itemsContainer.filter(function(single_item) {
        if (single_item.gridX == gridX && single_item.gridY == gridY) {
            return true;
        }
        return false;
    }, this).list);

    /* Verify the units */
    entities = entities.concat(this.unitsContainer.filter(function(single_unit) {
        if (single_unit.gridX == gridX && single_unit.gridY == gridY) {
            return true;
        }
        return false;
    }, this).list);

    return entities;
};

Map.prototype.getPositionFromXY = function(x, y) {
    let gridX = Math.floor(x / this.tilesContainer.getChildAt(0).width);
    let gridY = Math.floor(y / this.tilesContainer.getChildAt(0).height);
    return {gridX:gridX, gridY:gridY};
};

Map.prototype.highlightTile = function(gridX, gridY) {
    this.grid[gridY][gridX].activate();
};

Map.prototype.resetTiles = function() {
    this.tilesContainer.forEach(function(single_tile) {
        single_tile.deactivate();
    }, this);
};

Map.prototype.pauseUnits = function() {
    this.unitsContainer.forEach(function(single_unit) {
        single_unit.pause();
    }, this);
};

Map.prototype.resumeUnits = function() {
    this.unitsContainer.forEach(function(single_unit) {
        single_unit.resume();
    }, this);
};
