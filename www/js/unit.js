function Unit(game, newTeam) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

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

Unit.prototype = Object.create(Phaser.Group.prototype);
Unit.prototype.constructor = Unit;

Unit.Facing = {
    Left: 2,
    Right: -2
};

Unit.Team = {
    Player: 1,
    Enemy: 2
};

Unit.prototype.setSprite = function(themeName) {
    this.facing = Unit.Facing.Left;

    let image = this.backgroundContainer.create(0, 0, "unit:knight");
    image.anchor.setTo(0.5, 0.5);
    image.scale.set(2);
    image.x += image.width/2;
    image.y += image.height/2;
};

Unit.prototype.face = function(newFacing) {
    if (this.facing != newFacing) {
        this.backgroundContainer.getChildAt(0).scale.x = newFacing;
        this.facing = newFacing;
    }
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
    this.backgroundContainer.getChildAt(0).loadTexture("effect:dead");
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
