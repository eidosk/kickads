var KA = KA || {};
KA.Character = function(game, name){
    Phaser.Sprite.call(this, game, 0, 0, name);
    game.add.existing(this);
    this.state = "";
    this.speechBubble = null;
    this.popUp = null; // pop up is a text message on the character (ex: press x to interact)
    this.timerEvent = null;
}
KA.Character.prototype = Object.create(Phaser.Sprite.prototype); 
KA.Character.prototype.constructor = KA.Character;

KA.Character.prototype.playAnim = function(name){
    //trace("!!!playAnim!!!");
    this.state = name;
    if(this.animations)this.animations.play(name);
}

KA.Character.prototype.update = function(){
    ////trace("update! ");
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
    if(this.speechBubble!=null)this.speechBubble.flipText();
}

KA.Character.prototype.isOffScreen = function(){
    return this.x < 0 || this.x > WORLD_WIDTH;
}

KA.Character.prototype.speak = function(msg, y, willDisappear){
    if (typeof(willDisappear)==='undefined') willDisappear = true;
    if(this.timerEvent){
        this.game.time.events.remove(this.timerEvent);
        this.timerEvent = null;
    }
    this.removeSpeechBubble();
    this.speechBubble = new KA.SpeechBubble(this.game, msg, this, y);
    this.addChild(this.speechBubble);
    if(willDisappear == true)this.timerEvent = this.game.time.events.add(3000, this.removeSpeechBubble, this); 
}

KA.Character.prototype.showPopUp = function(){
    if(!this.isSpeaking()){
        this.speak("...", -16, false);
        this.popUp = true;
    }
}

KA.Character.prototype.isFacingX = function (x){
    if( (this.scale.x == 1 && this.body.world.x < x) ||
       (this.scale.x == -1 && this.body.world.x >= x) ){
        return true;
    }else{
        return false;
    }
}

KA.Character.prototype.isSpeaking = function(){
    return (this.speechBubble!=null);
}

KA.Character.prototype.removePopUp = function(){
    this.removeSpeechBubble();
    this.popUp = null;
}

KA.Character.prototype.removeSpeechBubble = function(){
    if(this.speechBubble!=null){
        this.removeChild(this.speechBubble);
        this.speechBubble = null;
    }
}