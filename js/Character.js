var KA = KA || {};

KA.Character = function(game, name){
    Phaser.Sprite.call(this, game, 0, 0, name);
    game.add.existing(this);
    this.state = "";
    this.speechBubble = null;
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


KA.Character.prototype.speak = function(){
    var speechBubble = game.make.sprite(8, -16, 'speech_bubble');
    var text = game.add.bitmapText(speechBubble.x + 4, speechBubble.y, 'myfont','I will kick ads', 16);
    this.addChild(speechBubble);
    this.addChild(text);
}
/*
KA.Character.prototype.createSpeechBubble = function(){
    
    body.add.bitmapText(10, 10, 'myfont','ciao!', 16);
    //body.width = 14;
    //body.height = 20;
    //body.alpha = HIT_AREA_ALPHA;
    return body;
}
*/




