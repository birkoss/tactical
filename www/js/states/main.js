var GAME = GAME || {};

GAME.Main = function() {
    this.isRunning = false;
    this.activeUnit = null;
};

GAME.Main.prototype = new AnimatedState();

GAME.Main.prototype.create = function() {
    this.panelContainer = this.game.add.group();
    this.mapContainer = this.game.add.group();
    this.informationContainer = this.game.add.group();
    this.informationContainer.animation = AnimatedState.Animation.SlideUp;

    this.containers.push(this.informationContainer);

    this.createPanel();

    this.level = "level1";

    this.createMap();
    this.createUnits();

    //this.isRunning = true;

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
    this.map.onMapClicked.add(this.showInformation, this);

    this.map.createGrid(6, 7);
    this.map.setTheme(GAME.json.levels[this.level].theme);

    GAME.json.levels[this.level].items.forEach(function(single_item) {
        this.map.addItem(single_item.item, single_item.gridX, single_item.gridY);
    }, this);

    this.map.generate();

    this.mapContainer.addChild(this.map);
    this.map.x = (this.game.width - this.mapContainer.width) / 2;
    this.map.y = this.panelContainer.height + this.map.x;

    this.informationContainer.y = this.map.y + this.map.x + this.map.height;
    this.informationContainer.maxHeight = this.game.height - this.informationContainer.y;
};

GAME.Main.prototype.createUnits = function() {
    let command = new Command();
    command.target = Command.Target.Foe;
    command.action = Command.Action.Attack;

    GAME.json.levels[this.level].units.forEach(function(single_unit) {
        let unit = new Unit(this.game, single_unit.unit, Unit.Team.Enemy);
        unit.addCommand(command);
        unit.gridX = single_unit.gridX;
        unit.gridY = single_unit.gridY;
        this.map.addUnit(unit);
    }, this);

    GAME.json.levels[this.level].base.forEach(function(single_base, index) {
        let single_unit = GAME.config.party[index];
        let unit = new Unit(this.game, single_unit.unit, Unit.Team.Player);
        unit.addCommand(command);
        unit.gridX = single_base.gridX;
        unit.gridY = single_base.gridY;
        this.map.addUnit(unit);
        unit.face(Entity.Facing.Right);
    }, this);

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
    attacker.face(attacker.x > defender.x ? Entity.Facing.Left : Entity.Facing.Right);

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
    this.map.addEffect(damageText);
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

GAME.Main.prototype.showInformation = function(entity) {
    if (entity != null) {
        this.currentEntity = entity;
    }

    /* Pause the game if not already paused */
    if (this.isRunning) {
        this.toggleTime();
    }

    /* If an information is already visible */
    if (this.informationContainer.children.length > 0) {
        this.hideInformation();
    } else {
        this.information = new Panel(this.game, "gui:information", this.informationContainer.maxHeight);
        this.informationContainer.addChild(this.information);

        switch (this.currentEntity.type) {
            case "item":
                this.information.createTitle(this.currentEntity.data.name, 10);
                this.information.createDescription(this.currentEntity.data.description);
                break;
            case "unit":
                this.information.createTitle(this.currentEntity.data.name + " (Level " + this.currentEntity.level + ")", 10);

                this.information.addStat("HP", this.currentEntity.currentStats.health, this.currentEntity.stats.health, true);
                this.information.addStat("ATB", this.currentEntity.ATB, this.currentEntity.getMaxATB(), true);
                this.information.addStat("ATK", this.currentEntity.stats.attack, this.currentEntity.getAttack());
                this.information.addStat("DEF", this.currentEntity.stats.defense, this.currentEntity.getDefense());

                this.information.statsContainer.y = this.information.title.y + this.information.title.height + 12;

                break;
        }
        console.log(this.currentEntity);

        this.show();
    }
};

GAME.Main.prototype.hideInformation = function() {
    if (this.information != null) {
        this.hide(this.resetInformation, this);
    }
};

GAME.Main.prototype.resetInformation = function() {
    this.informationContainer.removeAll();
    this.information.destroy();
    this.showInformation();
};
