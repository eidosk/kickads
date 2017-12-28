var KA = KA || {};
KA.SpeechBubble = function(game, msg, character, y){ //optimize
    Phaser.Group.call(this, game);
    game.add.existing(this);
    this.y = y;
    this.character = character;
    this.makeSprites();
    this.flipSprites();
    this.addSprites();
    this.setUp(msg);
    if(this.character.scale.x == -1)this.flipText();
}
KA.SpeechBubble.prototype = Object.create(Phaser.Group.prototype);
KA.SpeechBubble.prototype.constructor = KA.SpeechBubble;
KA.SpeechBubble.TEXT_HEIGHT = 6;
KA.SpeechBubble.BODY_HEIGHT = 12;
/*FUNCTIONS*/
KA.SpeechBubble.prototype.addSprites = function(){
    console.log("ADD SPRITES");
    this.add(this.topLeftCorner);
    this.add(this.bodyCenter);
    this.add(this.topRightCorner);
    this.add(this.bottomLeftCorner);
    this.add(this.bottomRightCorner);
    this.add(this.speechBlackArrow);
}
KA.SpeechBubble.prototype.addBitmapText = function(txt){
    this.createBitmapText(txt);
    this.add(this.bitmapText);
}
KA.SpeechBubble.prototype.center = function(){
    this.x = -Math.floor(this.width *.5);
}
KA.SpeechBubble.prototype.createBitmapText = function(txt){
     if(this.bitmapText!=null){
        this.removeChild(this.bitmapText);
        this.bitmapText = null;
    }
    this.bitmapText = this.game.add.bitmapText(this.topLeftCorner.width, -1, 'myfont', txt, 16);
}
KA.SpeechBubble.prototype.flipSprites = function(){
    this.topRightCorner.scale.setTo(-1, 1);
    this.bottomLeftCorner.scale.setTo(1,-1);
    this.bottomRightCorner.scale.setTo(-1, -1);
}
KA.SpeechBubble.prototype.flipText = function(){
    this.scale.setTo(this.scale.x * -1, 1);
    this.center();
}
KA.SpeechBubble.prototype.getText = function(){
    return this.bitmapText.text;
}
KA.SpeechBubble.prototype.makeSprites = function(){
    this.topLeftCorner = this.game.make.sprite(0, 0,'speech_corner');
    this.bodyCenter = this.game.make.sprite(0, 0,'speech_body');
    this.topRightCorner = this.game.make.sprite(0, 0,'speech_corner');
    this.bottomLeftCorner = this.game.make.sprite(0, 0,'speech_corner');
    this.bottomRightCorner = this.game.make.sprite(0, 0,'speech_corner');
    this.speechBlackArrow = this.game.make.sprite(0, 0, 'speech_arrow');
}
KA.SpeechBubble.prototype.positionSprites = function(){
    this.bodyCenter.x = this.topLeftCorner.width;
    this.topRightCorner.x = this.topLeftCorner.width*2 + this.bitmapText.width;
    this.bottomLeftCorner.y = KA.SpeechBubble.TEXT_HEIGHT*2;
    this.bottomRightCorner.x = this.topLeftCorner.width*2 + this.bitmapText.width;
    this.bottomRightCorner.y = KA.SpeechBubble.TEXT_HEIGHT*2;
    this.speechBlackArrow.x = (this.bodyCenter.width + this.topLeftCorner.width*2) * .5 - this.speechBlackArrow.width*.5;
    this.speechBlackArrow.y = KA.SpeechBubble.BODY_HEIGHT;
}
KA.SpeechBubble.prototype.resize = function(){
    this.bodyCenter.width = this.bitmapText.width;
    this.bodyCenter.height = KA.SpeechBubble.BODY_HEIGHT;
}
KA.SpeechBubble.prototype.setUp = function(msg){
    this.createBitmapText(msg);
    this.resize();
    this.positionSprites();
    this.add(this.bitmapText);
    this.center();
}