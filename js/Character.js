var KA = KA || {};

KA.Character = function(game, name){
    Phaser.Sprite.call(this, game, 0, 0, name);
    game.add.existing(this);
    this.state = "";
}
KA.Character.prototype = Object.create(Phaser.Sprite.prototype); 
KA.Character.prototype.constructor = KA.Character;


KA.Character.prototype.playAnim = function(name){
    trace("!!!playAnim!!!");
    this.state = name;
    trace(this.animations);
    if(this.animations)this.animations.play(name);
}


KA.Character.prototype.update = function(){
    //trace("update! ");
}

KA.Character.prototype.setAnchor = function(){
    this.anchor.setTo(0.5, 0);
}

KA.Character.prototype.isFacingRight = function(){
    return this.isFacing(false);
}

KA.Character.prototype.isFacingLeft = function(){
    return this.isFacing(true);
}

KA.Character.prototype.isFacing = function(left = true){
    if(left){
        return this.scale.x == -1;
    }else{
        return this.scale.x == 1;
    }
}
KA.Character.prototype.flipX = function(){
    this.scale.setTo(this.scale.x * -1, 1);
}

KA.Character.prototype.isOffScreen = function(){
    return this.x < 0 || this.x > WORLD_WIDTH;
}