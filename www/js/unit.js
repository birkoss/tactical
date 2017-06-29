function Unit(game, newTeam) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.commands = [];

    this.attackRange = 1;

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
    //image.tint = (this.team == Unit.Team.Player ? 0x0000ff : 0xff0000);
};

Unit.prototype.face = function(newFacing) {
    if (this.facing != newFacing) {
        this.backgroundContainer.getChildAt(0).scale.x = newFacing;
        this.facing = newFacing;
    }
};

Unit.prototype.getAttackRange = function() {
    return this.attackRange;
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

Unit.prototype.attackUnit = function(target) {
    this.originalX = this.x;
    this.originalY = this.y;

    let tween = this.game.add.tween(this).to({x:target.x, y:target.y}, 400, Phaser.Easing.Elastic.Out);
    tween.onComplete.add(this.attackUnitEnd, this);
    tween.start();
};

Unit.prototype.attackUnitEnd = function() {
    let tween = this.game.add.tween(this).to({x:this.originalX, y:this.originalY}, 400, Phaser.Easing.Elastic.Out);
    tween.start();
};
