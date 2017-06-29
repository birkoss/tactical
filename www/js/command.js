function Command() {
    this.action = '';
    this.target = null;
    this.conditions = [];
};

Command.Target = {
    Itself: 1,
    Ally: 2,
    Foe: 3
};

Command.Action = {
    Attack: 1,
    Heal: 2
};
