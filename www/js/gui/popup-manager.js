function PopupManager(game) {
    Phaser.Group.call(this, game);

    this.popups = [];
};

PopupManager.prototype = Object.create(Phaser.Group.prototype);
PopupManager.prototype.constructor = PopupManager;

PopupManager.prototype.addPopup = function(popup) {
    this.addChild(popup);
    this.popups.push(popup);
    popup.generate();

    popup.onPopupHidden.add(this.removePopup, this);

    if (this.popups.length == 1) {
        popup.show();
    } else {
        this.popups[0].hide();
    }
};

PopupManager.prototype.removePopup = function(popup) {
    let index = this.popups.indexOf(popup);
    if (index != -1) {
        this.popups.splice(index, 1);
    }

    if (this.popups.length > 0) {
        this.popups[0].show();
    }
};

PopupManager.prototype.hide = function() {
    this.popups.forEach(function(single_popup) {
        single_popup.hide();
    }, this);
}
