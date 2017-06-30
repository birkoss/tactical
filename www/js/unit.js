function Unit(game, newTeam) {
    Entity.call(this, game, "unit");

    this.onDeath = new Phaser.Signal();

    this.commands = [];

    this.attackRange = 1;

    this.stats = {
        attack: 10,
        defense: 7,
        health: 15
    };
    this.currentStats = {
        health: this.stats.health
    };

    this.team = newTeam;

    this.clearATB();
};

Unit.prototype = Object.create(Entity.prototype);
Unit.prototype.constructor = Unit;

Unit.Team = {
    Player: 1,
    Enemy: 2
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

/* Commands */

Unit.prototype.addCommand = function(command) {
    this.commands.push(command);
};
