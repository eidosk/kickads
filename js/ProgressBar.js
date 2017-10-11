var KA = KA || {};
KA.ProgressBar = function(game, width, height, progress, color) {
    this.color = (typeof color !== 'undefined') ?  color : 0xffffff;
    Phaser.Sprite.call(this, game);
    game.add.existing(this);
    this.barWidth = width;
    this.barHeight = height;
    this.topGfx = null;
    this.addBottomGfx();
    this.updateProgress(progress);
};
KA.ProgressBar.prototype = Object.create(Phaser.Sprite.prototype); 
KA.ProgressBar.prototype.constructor = KA.ProgressBar;
/*FUNCTIONS*/
KA.ProgressBar.prototype.addBottomGfx = function(){
    bottomGfx = new Phaser.Graphics(this.game, 0, 0);
    bottomGfx.beginFill(0x000000);
    bottomGfx.lineTo(this.barWidth+2, 0);
    bottomGfx.lineTo(this.barWidth+2, this.barHeight);
    bottomGfx.lineTo(0, this.barHeight);
    bottomGfx.lineTo(0, 0);
    bottomGfx.endFill();
    this.addChild(bottomGfx);
}
KA.ProgressBar.prototype.updateProgress = function(progress){
    if(this.hasChild(this, this.topGfx))this.removeChild(this.topGfx);
    var tWidth = this.barWidth * progress;
    //trace("this.game: " + this.game);
    this.topGfx = new Phaser.Graphics(this.game, 1, 1);
    this.topGfx.beginFill(this.color);
    this.topGfx.lineTo(tWidth, 0);
    this.topGfx.lineTo(tWidth, this.barHeight-2);
    this.topGfx.lineTo(0, this.barHeight-2);
    this.topGfx.lineTo(0, 0);
    this.topGfx.endFill();
    this.addChild(this.topGfx);
}
KA.ProgressBar.prototype.hasChild = function(parent, child){
    return parent.children.indexOf(child) != -1
}