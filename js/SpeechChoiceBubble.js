var KA = KA || {};
KA.SpeechChoiceBubble = function(game, msg, y){
    this.lines = msg;
    this.currentLine = 0;
    KA.SpeechBubble.call(this, game, this.lines[this.currentLine], KA.player, y);
    this.whiteArrowWidth = 3;
    this.padding = 2;
    /*
    this.bodyCenter.width += this.whiteArrowWidth*2;
    this.bottomRightCorner.x += this.whiteArrowWidth*2;
    this.topRightCorner.x += this.whiteArrowWidth*2;
    this.bitmapText.x += this.whiteArrowWidth;
    */
    this.leftWhiteArrow = game.make.sprite(0,0,"speech_arrow_white");
    this.leftWhiteArrow.scale.setTo(this.leftWhiteArrow.scale.x * -1, 1);
    this.rightWhiteArrow = game.make.sprite(0,0, "speech_arrow_white");
    /*
    this.leftWhiteArrow.x = this.whiteArrowWidth + this.padding;
    this.rightWhiteArrow.x = this.bodyCenter.width + this.whiteArrowWidth*2 + this.padding;
    this.leftWhiteArrow.y = this.rightWhiteArrow.y = 3;
    */
    this.add(this.leftWhiteArrow);
    this.add(this.rightWhiteArrow);
    this.resize(); //resize according to text
    var scope = this;
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
    this.addBitmapText(this.lines[this.currentLine]);
    this.resize();
}
KA.SpeechChoiceBubble.prototype.prevLine = function(){
    this.currentLine--;
    if(this.currentLine<0)this.currentLine = this.lines.length-1;
    this.addBitmapText(this.lines[this.currentLine]);
    this.resize();
}

KA.SpeechChoiceBubble.prototype.resize = function(){
    //this.bodyCenter.width = ;
    this.bodyCenter.width = this.bitmapText.width + this.whiteArrowWidth*2 + this.padding;
    this.bottomRightCorner.x = this.topRightCorner.x = this.topLeftCorner.width*2 + this.bodyCenter.width;
    //this.bottomRightCorner.y = -10;
    this.bitmapText.x = this.topLeftCorner.width + this.whiteArrowWidth;
    this.leftWhiteArrow.x = this.whiteArrowWidth + this.padding;
    this.rightWhiteArrow.x = this.bodyCenter.width + this.whiteArrowWidth*2;
    this.leftWhiteArrow.y = this.rightWhiteArrow.y = 3;
    this.center();
    this.speechBlackArrow.x = Math.floor(this.width * .5) - 2;
    
}


