var GAME = GAME || {};

GAME.Main = function() {
    this.isRunning = false;
    this.activeUnit = null;
};

GAME.Main.prototype.create = function() {
    this.mapContainer = this.game.add.group();

    this.createMap();

    this.createUnits();

    this.isRunning = true;
};

GAME.Main.prototype.update = function() {
    if (this.isRunning && this.activeUnit == null) {
        this.map.updateUnits();
    }
};

GAME.Main.prototype.createMap = function() {
    this.map = new Map(this.game);
    this.map.onUnitReady.add(this.unitStartAction, this);

    this.map.createGrid(8, 8);
    this.map.setTheme("forest");

    this.map.generate();

    this.mapContainer.addChild(this.map);
};

GAME.Main.prototype.createUnits = function() {
    let unit = new Unit(this.game);
    unit.gridX = 5;
    unit.gridY = 5;
    this.map.addUnit(unit);

    unit = new Unit(this.game);
    unit.gridX = 2;
    unit.gridY = 2;
    this.map.addUnit(unit);
};


GAME.Main.prototype.unitStartAction = function(unit) {
    console.log("A Unit is ready at " + unit.gridX + "x" + unit.gridY);
    this.activeUnit = unit;

    let tween = this.game.add.tween(unit.scale).to({x:2, y:2}, 800);
    tween.onComplete.add(this.unitStopAction, this);
    tween.start();
};

GAME.Main.prototype.unitStopAction = function() {
    this.activeUnit.clearATB();
    this.activeUnit = null;
};
