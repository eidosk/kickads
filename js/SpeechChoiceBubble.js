var KA = KA || {};
KA.SpeechChoiceBubble = function(game, msg, character, y){
    this.lines = msg;
    this.currentLine = 0;
    KA.SpeechBubble.call(this, game, this.lines[this.currentLine], character, y);
    this.whiteArrowWidth = 3;
    this.padding = 2;
    this.bodyCenter.width += this.whiteArrowWidth*2;
    this.bottomRightCorner.x += this.whiteArrowWidth*2;
    this.topRightCorner.x += this.whiteArrowWidth*2;
    this.text.x += this.whiteArrowWidth;
    this.leftWhiteArrow = game.make.sprite(0,0,"speech_arrow_white");
    this.leftWhiteArrow.scale.setTo(this.leftWhiteArrow.scale.x * -1, 1);
    this.rightWhiteArrow = game.make.sprite(0,0, "speech_arrow_white");
    this.leftWhiteArrow.x = this.whiteArrowWidth + this.padding;
    this.rightWhiteArrow.x = this.bodyCenter.width + this.whiteArrowWidth*2 + this.padding;
    this.leftWhiteArrow.y = this.rightWhiteArrow.y = 3;
    this.add(this.leftWhiteArrow);
    this.add(this.rightWhiteArrow);
    var scope = this;
    game.input.keyboard.onDownCallback = function(){
        if(game.input.keyboard.event.keyCode==Phaser.Keyboard.LEFT){
            scope.prevLine();
        }else if(game.input.keyboard.event.keyCode==Phaser.Keyboard.RIGHT){
            scope.nextLine();
        }else if(game.input.keyboard.event.keyCode==Phaser.Keyboard.X){
            scope.resumeGame(); //temp
        }
    }
}
KA.SpeechChoiceBubble.prototype = Object.create(KA.SpeechBubble.prototype);
KA.SpeechBubble.prototype.constructor = KA.SpeechChoiceBubble;
/*FUNCTIONS*/
KA.SpeechChoiceBubble.prototype.prevLine = function(){
    this.currentLine--;
    if(this.currentLine<0)this.currentLine = this.lines.length-1;
    this.setText(this.lines[this.currentLine])
    this.add(this.text);
}
KA.SpeechChoiceBubble.prototype.nextLine = function(){
    this.currentLine++;
    if(this.currentLine>this.lines.length-1)this.currentLine = 0;
    this.setText(this.lines[this.currentLine])
    this.add(this.text);
}

KA.SpeechChoiceBubble.prototype.resumeGame = function(){  //wrong scope!!
    trace("RESUME");
    KA.player.enableInput();
    game.input.keyboard.onDownCallback = null;
    KA.player.removeSpeechBubble();
    KA.player.dialoguePartner.resumeMission();
    KA.player.dialoguePartner = null; 
}
