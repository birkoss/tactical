var GAME = GAME || {};

GAME.Main = function() {
    this.isRunning = false;
    this.activeUnit = null;
};

GAME.Main.prototype.create = function() {
    this.panelContainer = this.game.add.group();
    this.createPanel();

    this.mapContainer = this.game.add.group();
    this.createMap();
    this.createUnits();

    this.isRunning = true;
};

GAME.Main.prototype.update = function() {
    this.btnTime.label.setText(this.isRunning ? "Pause" : "Resume");
    if (this.isRunning && this.activeUnit == null) {
        this.map.updateUnits();
    }
};

GAME.Main.prototype.createPanel = function() {
    this.panel = new Panel(this.game);
    this.panelContainer.addChild(this.panel);

    this.btnTime = new PanelButton(this.game, "Pause");
    this.btnTime.onClicked.add(this.toggleTime, this);
    this.panel.addButton(this.btnTime);
};

GAME.Main.prototype.createMap = function() {
    this.map = new Map(this.game);
    this.map.onUnitReady.add(this.unitStartAction, this);

    this.map.createGrid(6, 8);
    this.map.setTheme("forest");

    this.map.addItem("tree", 0, 0);
    this.map.addItem("tree", 5, 4);
    this.map.addItem("tree", 2, 0);

    this.map.generate();

    this.mapContainer.addChild(this.map);
    this.mapContainer.x = (this.game.width - this.mapContainer.width) / 2;
    this.mapContainer.y = this.panelContainer.height + this.mapContainer.x;
};

GAME.Main.prototype.createUnits = function() {
    let command = new Command();
    command.target = Command.Target.Foe;
    command.action = Command.Action.Attack;

    let unit = new Unit(this.game, Unit.Team.Player);
    unit.addCommand(command);
    unit.gridX = 5;
    unit.gridY = 5;
    this.map.addUnit(unit);

    unit = new Unit(this.game, Unit.Team.Enemy);
    unit.addCommand(command);
    unit.gridX = 4;
    unit.gridY = 5;
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
            let target = null;
            switch (single_command.target) {
                case Command.Target.Itself:
                    target = 0;
                    break;
                case Command.Target.Foe:
                    target = this.activeUnit.team * -1;
                    break;
                case Command.Target.Ally:
                    target = this.activeUnit.team;
                    break;
            }

            switch (single_command.action) {
                case Command.Action.Attack:
                    let units = this.map.getUnits(target, {gridX:this.activeUnit.gridX, gridY:this.activeUnit.gridY}, this.activeUnit.getAttackRange());
                    if (units.length > 0) {
                        command = true;
                        this.unitStartAttack(this.activeUnit, units[0]);
                        //this.activeUnit.attackUnit(units[0]);
                    }
                    units.forEach(function(single_unit) {
                        console.log(" = " + single_unit.team + " -> " + single_unit.gridX + "x" + single_unit.gridY);
                    }, this);
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

GAME.Main.prototype.unitStartAttack = function(attacker, defender) {
    /* Save the original position (to come back there after) */
    attacker.originalX = attacker.x;
    attacker.originalY = attacker.y;

    /* Face the right way depending of the defender */
    attacker.face(attacker.x > defender.x ? Unit.Facing.Left : Unit.Facing.Right);

    /* Always be on top of the defender */
    attacker.parent.bringToTop(attacker);

    attacker.target = defender;
    let tween = this.game.add.tween(attacker).to({x:defender.x, y:defender.y}, 400, Phaser.Easing.Elastic.In);
    tween.onComplete.add(this.unitAnimateAttack, this);
    tween.start();
};

GAME.Main.prototype.unitAnimateAttack = function(attacker) {

    /* Calculate the damage, always at least 1 */
    let damage = Math.round(Math.max(1, attacker.getAttack() * (attacker.getAttack() / (attacker.getAttack() + attacker.target.getDefense()))));
    attacker.target.applyDamage(damage);

    /* Show the damage (and auto remove it after) */
    let damageText = this.game.add.bitmapText(attacker.x + attacker.width/2 - 10, attacker.y, "font:guiOutline", damage, 20);
    let damageY = damageText.y - attacker.height;
    let tween = this.game.add.tween(damageText).to({y:damageY}, 500);
    tween.onComplete.add(function(text) {
        let tween = this.game.add.tween(text).to({alpha:0}, 400);
        tween.onComplete.add(function(text) {
            text.destroy();
        }, this);
        tween.start();
    }, this);
    tween.start();
    
    /* Show the attacking animation */
    let effect = this.map.effectsContainer.create(attacker.x, attacker.y, "effect:attack");
    effect.attacker = attacker;
    effect.scale.set(2);

    let animation = effect.animations.add("attack", [0, 1, 0, 1, 0, 1], 8);
    animation.onComplete.add(this.unitStopAttack, this);
    
    effect.animations.play("attack");
};

GAME.Main.prototype.unitStopAttack = function(effect) {
    effect.destroy();

    let attacker = effect.attacker;

    let tween = this.game.add.tween(attacker).to({x:attacker.originalX, y:attacker.originalY}, 400, Phaser.Easing.Elastic.Out);
    tween.onComplete.add(this.unitStopAction, this);
    tween.start();
};

GAME.Main.prototype.toggleTime = function() {
    this.isRunning = !this.isRunning;
};
