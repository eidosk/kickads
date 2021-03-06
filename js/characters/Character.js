var KA = KA || {};
KA.Character = function(game, name, x, y){
    Phaser.Sprite.call(this, game, x, y, name);
    game.add.existing(this);
    this.state = "";
    this.speechBubble = null;
    this.popUp = null; // pop up is a text message on the character (ex: press x to interact)
    this.timerEvent = null;
    this.dialoguePartner = null;
    this.speechBubbleY = -12;
}
KA.Character.prototype = Object.create(Phaser.Sprite.prototype);
KA.Character.prototype.constructor = KA.Character;
/*FUNCTIONS*/
KA.Character.prototype.playAnim = function(name){
    this.state = name;
    if(this.animations)this.animations.play(name);
}
KA.Character.prototype.update = function(){
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
KA.Character.prototype.face = function(x){
    if(x >= this.x && this.scale.x == -1)this.scale.x = 1;
    else if(x < this.x && this.scale.x == 1)this.scale.x = -1;
}
KA.Character.prototype.flipX = function(){
    this.scale.setTo(this.scale.x * -1, 1);
    if(this.speechBubble!=null)this.speechBubble.flipText();
}
KA.Character.prototype.isOffScreen = function(){
    return this.x < 0 || this.x > WORLD_WIDTH;
}
KA.Character.prototype.showPopUp = function(){
    if(!this.isSpeaking()){
        this.speak("...");
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
    KA.player.endAction();
    if(this.speechBubble!=null){
        this.removeChild(this.speechBubble);
        this.speechBubble = null;
    }
}
KA.Character.prototype.speak = function(msg, last){
    if (typeof(last)==='undefined') last = false;
    this.removeSpeechBubble();
    this.speechBubble = new KA.SpeechBubble(this.game, msg, this, this.speechBubbleY);
    this.addChild(this.speechBubble);
}