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
    let command = new Command();
    command.target = Command.Target.Foe;
    command.action = Command.Action.Attack;

    let unit = new Unit(this.game);
    unit.addCommand(command);
    unit.gridX = 5;
    unit.gridY = 5;
    this.map.addUnit(unit);

    unit = new Unit(this.game);
    unit.gridX = 2;
    unit.gridY = 2;
    this.map.addUnit(unit);
};

GAME.Main.prototype.unitStartAction = function(unit) {
    this.activeUnit = unit;
console.log("start action...");
    this.unitExecuteCommand();
};

GAME.Main.prototype.unitExecuteCommand = function() {
    let command = null;

    this.activeUnit.commands.forEach(function(single_command) {
        if (command == null) {
            switch (single_command.action) {
                case Command.Action.Attack:
                    console.log("Trying to attack...");
                    break;
                case Command.Action.Heal:
                    break;
            }
        }
    }, this);

    if (command == null) {
        /* No command found, skip it */
        this.unitStopAction();
    }
};

GAME.Main.prototype.unitStopAction = function() {
    this.activeUnit.clearATB();
    this.activeUnit = null;
};
