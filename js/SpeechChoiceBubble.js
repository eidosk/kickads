var KA = KA || {};
KA.SpeechChoiceBubble = function(game, msg, y){
    this.lines = msg;
    this.currentLine = 0;
    this.whiteArrowWidth = 3;
    this.padding = 2;
    KA.SpeechBubble.call(this, game, this.lines[this.currentLine], KA.player, y);
    KA.player.assignSpeechChoiceKeys();
}
KA.SpeechChoiceBubble.prototype = Object.create(KA.SpeechBubble.prototype);
KA.SpeechChoiceBubble.prototype.constructor = KA.SpeechChoiceBubble;

/*FUNCTIONS*/
KA.SpeechChoiceBubble.prototype.getCurrentLineText = function(){
    return this.lines[this.currentLine];
}
KA.SpeechChoiceBubble.prototype.getCurrentLine = function(){
    return this.currentLine;
}
KA.SpeechChoiceBubble.prototype.nextLine = function(){
    this.currentLine++;
    if(this.currentLine>this.lines.length-1)this.currentLine = 0;
    this.setUp(this.lines[this.currentLine]);
}
KA.SpeechChoiceBubble.prototype.prevLine = function(){
    this.currentLine--;
    if(this.currentLine<0)this.currentLine = this.lines.length-1;
    this.setUp(this.lines[this.currentLine]);
}

/*OVERRIDE FUNCTIONS*/
KA.SpeechChoiceBubble.prototype.addSprites = function(){
    KA.SpeechBubble.prototype.addSprites.call(this);
    this.add(this.leftWhiteArrow);
    this.add(this.rightWhiteArrow);
}
KA.SpeechChoiceBubble.prototype.resize = function(){
    KA.SpeechBubble.prototype.resize.call(this);
    this.bodyCenter.width = this.bitmapText.width + this.whiteArrowWidth*2 + this.padding;
}
KA.SpeechChoiceBubble.prototype.positionSprites = function(){
    KA.SpeechBubble.prototype.positionSprites.call(this);
    this.bottomRightCorner.x = this.topRightCorner.x = this.topLeftCorner.width*2 + this.bodyCenter.width;
    this.bitmapText.x = this.topLeftCorner.width + this.whiteArrowWidth;
    this.leftWhiteArrow.x = this.whiteArrowWidth + this.padding;
    this.rightWhiteArrow.x = this.bodyCenter.width + this.whiteArrowWidth*2;
    this.leftWhiteArrow.y = this.rightWhiteArrow.y = 3;
}
KA.SpeechChoiceBubble.prototype.flipSprites = function(){
    KA.SpeechBubble.prototype.flipSprites.call(this); //super call
    this.leftWhiteArrow.scale.setTo(this.leftWhiteArrow.scale.x * -1, 1);
}
KA.SpeechChoiceBubble.prototype.makeSprites = function(){
    KA.SpeechBubble.prototype.makeSprites.call(this); //super call
    this.leftWhiteArrow = this.game.make.sprite(0,0,"speech_arrow_white");
    this.rightWhiteArrow = this.game.make.sprite(0,0, "speech_arrow_white");
}
