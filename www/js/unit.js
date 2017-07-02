function Unit(game, unitID, newTeam) {
    Entity.call(this, game, "unit");

    this.moveContainer = this.game.add.group();
    this.addChild(this.moveContainer);

    this.entityID = unitID;

    this.onDeath = new Phaser.Signal();

    this.commands = [];

    this.attackRange = 1;

    /* Default stats */
    this.baseStats = {
        attack: 10,
        defense: 7,
        health: 15
    };

    let unitData = GAME.json.units[this.entityID];
    if (unitData.stats != null) {
        this.baseStats = unitData.stats;
    }
    if (unitData.range != null) {
        this.attackRange = unitData.range;
    }

    this.stats = {};

    this.xp = {
        base: 10,
        factor: 2,
        current: 0,
        next: 0
    };

    this.setLevel(1);

    this.currentStats = {
        health: this.stats.health
    };

    this.team = newTeam;

    this.clearATB();
    this.MOVE = 100;

    this.createProgress();
};

Unit.prototype = Object.create(Entity.prototype);
Unit.prototype.constructor = Unit;

Unit.Team = {
    Player: 1,
    Enemy: 2
};

Unit.prototype.createProgress = function() {
    this.moveProgress = this.moveContainer.create(0, 0, "tile:blank");
    this.moveProgress.width = 0;
    this.moveProgress.maxWidth = 48;
    this.moveProgress.height = 6;
    this.moveProgress.tint = 0xff322f;
};

Unit.prototype.applyDamage = function(damage) {
    this.currentStats.health = Math.max(0, this.currentStats.health - damage);
    if (!this.isAlive()) {
        this.die();
    }
};

Unit.prototype.getAttack = function() {
    return this.stats.attack;
};

Unit.prototype.getDefense = function() {
    return this.stats.defense;
};

Unit.prototype.getAttackRange = function() {
    return this.attackRange;
};

Unit.prototype.isAlive = function() {
    return (this.currentStats.health > 0);
};


Unit.prototype.die = function() {
    this.clearATB();
    this.onDeath.dispatch(this);
};

/* Level and XP */

Unit.prototype.setLevel = function(newLevel) {
    console.log("set level:" + newLevel);
    this.level = newLevel;

    /* Calculate next XP */
    this.xp.next = this.xp.base * (Math.pow((this.level+1), this.xp.factor));

    /* Update stats */
    for (let stat in this.baseStats) {
        this.stats[stat] = Math.round(this.baseStats[stat] + (this.baseStats[stat] * 0.42) * (this.level-1));
    }
};

Unit.prototype.addXP = function(newXP) {
    this.xp.current += newXP;

    while (this.xp.current > this.xp.next) {
        this.setLevel(this.level+1);
    }
};

Unit.prototype.dropXP = function() {
    let EP = 10;
    return 0.02 * this.xp.next * EP + 6;
};

/* ATB */

Unit.prototype.clearATB = function() {
    this.ATB = 0;
};

Unit.prototype.getMaxATB = function() {
    return 100;
};

Unit.prototype.getFillRateATB = function() {
    return 1;
};

Unit.prototype.isReady = function() {
    return (this.ATB >= this.getMaxATB());
};

Unit.prototype.updateATB = function() {
    this.ATB = Math.min(this.ATB + this.getFillRateATB(), this.getMaxATB());
};

/* Movement */

Unit.prototype.canMove = function() {
    return (this.MOVE >= 100);
};

Unit.prototype.clearMove = function() {
    this.MOVE = 0;
};

Unit.prototype.getFillRateMove = function() {
    return 1;
};

Unit.prototype.updateMove = function() {
    this.MOVE = Math.min(this.MOVE + this.getFillRateMove(), 100);
    this.moveProgress.width = this.moveProgress.maxWidth - (this.MOVE / 100 * this.moveProgress.maxWidth);
};

/* Commands */

Unit.prototype.addCommand = function(command) {
    this.commands.push(command);
};
