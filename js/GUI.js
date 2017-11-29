var KA = KA || {};
KA.GUI = function(game) {
    Phaser.Sprite.call(this, game);
    game.add.existing(this);
    this.fixedToCamera = true;
    this.cameraOffset.setTo(0, 0);
    this.dayText = null;
    this.progressBar = null;
    //this.showProgressBar();
    this.addProgressBar();
    Signals.enemyDestroyed.add(this.onEnemyDestroyed, this);
};
KA.GUI.prototype = Object.create(Phaser.Sprite.prototype);
KA.GUI.prototype.constructor = KA.GUI;
/*CONSTANTS*/
KA.GUI.BAR_WIDTH = 40;
KA.GUI.BAR_HEIGHT = 4;
/*FUNCTIONS*/
KA.GUI.prototype.addProgressBar = function(){
    this.balance = KA.global.balance;
    this.totValue = KA.global.totValue;
    this.progressBar = new KA.ProgressBar(this.game, KA.GUI.BAR_WIDTH , KA.GUI.BAR_HEIGHT, this.balance / this.totValue, 0xFF3300);
    this.addChild(this.progressBar);
    this.progressBar.x = 16;
    this.progressBar.y = 4;
    this.adText = this.game.make.bitmapText(2, -2, 'myfont', "ADS", 16);
    this.adText.tint = 0x000000;
    this.adText2 = this.game.make.bitmapText(2, -3, 'myfont', "ADS", 16);
    this.addChild(this.adText);
    this.addChild(this.adText2);
}
KA.GUI.prototype.onEnemyDestroyed = function(value){
    this.balance -= value;
    var progress = this.balance / this.totValue;
    this.progressBar.updateProgress(progress);
}
KA.GUI.prototype.showDayText = function(day){
    this.dayText = this.game.make.bitmapText(0, 10, 'myfont', "Day " + romanize(day), 32);
    //this.dayText.tint = 0x223344;
    this.addChild(this.dayText);
    this.dayText.x = GAME_WIDTH * .5 - this.dayText.width * .5;
    this.game.time.events.add(3000, this.fadeOutDayText, this);
}
KA.GUI.prototype.fadeOutDayText = function(){
    var tween = this.game.add.tween(this.dayText).to({alpha:0.1}, 300, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(this.removeDayText, this);
}
KA.GUI.prototype.removeDayText = function(){
    this.removeChild(this.dayText);
}
KA.GUI.prototype.destroy = function(){
    Signals.enemyDestroyed.remove(this.onEnemyDestroyed, this);
}