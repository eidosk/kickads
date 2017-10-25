var KA = KA || {};
KA.SpeechBubble = function(game, msg, character, y){ //optimize
    Phaser.Group.call(this, game);
    game.add.existing(this);
    
    this.textHeight = 6;
    
    //make sprites
    this.topLeftCorner = game.make.sprite(0, 0,'speech_corner');
    this.bodyCenter = game.make.sprite(0, 0,'speech_body');
    this.topRightCorner = game.make.sprite(0, 0,'speech_corner');
    this.bottomLeftCorner = game.make.sprite(0, 0,'speech_corner');
    this.bottomRightCorner = game.make.sprite(0, 0,'speech_corner');
    this.speechBlackArrow = game.make.sprite(0, 0, 'speech_arrow');
    
    //add text
    this.createBitmapText(msg);
    
    //position sprites
    this.bodyCenter.x = this.topLeftCorner.width;
    this.topRightCorner.x = this.topLeftCorner.width*2 + this.bitmapText.width;
    this.bottomLeftCorner.y = this.textHeight*2;
    this.bottomRightCorner.x = this.topLeftCorner.width*2 + this.bitmapText.width;
    this.bottomRightCorner.y = this.textHeight*2;
    
    
    
    //flip
    this.topRightCorner.scale.setTo(-1, 1);
    this.bottomLeftCorner.scale.setTo(1,-1);
    this.bottomRightCorner.scale.setTo(-1, -1);
    
    //add to s
    this.add(this.topLeftCorner);
    this.add(this.bodyCenter);
    this.add(this.topRightCorner);
    this.add(this.bottomLeftCorner);
    this.add(this.bottomRightCorner);
    
    
    
    
    
    
    //set size
    this.bodyCenter.width = this.bitmapText.width;
    this.bodyCenter.height = this.height;

    if(this.height > this.topLeftCorner.height*2){
        var bodyLeft = game.make.sprite(0, this.topLeftCorner.height,'speech_body');
        var bodyRight = game.make.sprite(this.width - this.topLeftCorner.width, this.topLeftCorner.height,'speech_body');
        bodyLeft.width = bodyRight.width = this.topLeftCorner.width;
        bodyLeft.height = bodyRight.height = this.height - this.topLeftCorner.height*2;
        this.add(bodyLeft);
        this.add(bodyRight);
    }
    this.y = y;
    this.add(this.bitmapText);
    
    this.speechBlackArrow.x = Math.floor(this.width * .5) - 2;
    this.speechBlackArrow.y = this.height;
    this.add(this.speechBlackArrow);
    
    
    this.center();
    
    
    if(character.scale.x == -1)this.flipText();
}
KA.SpeechBubble.prototype = Object.create(Phaser.Group.prototype);
KA.SpeechBubble.prototype.constructor = KA.SpeechBubble;
/*FUNCTIONS*/
KA.SpeechBubble.prototype.center = function(){
    this.x = - Math.floor(this.width *.5);
}
KA.SpeechBubble.prototype.getText = function(){
    return this.bitmapText.text;
}
KA.SpeechBubble.prototype.flipText = function(){
    this.scale.setTo(this.scale.x * -1, 1);
    this.center();
}
KA.SpeechBubble.prototype.createBitmapText = function(txt){
     if(this.bitmapText!=null){
        this.removeChild(this.bitmapText);
        this.bitmapText = null;
    }
    this.bitmapText = this.game.add.bitmapText(this.topLeftCorner.width, -1, 'myfont', txt, 16);
}
KA.SpeechBubble.prototype.addBitmapText = function(txt){
    this.createBitmapText(txt);
    this.add(this.bitmapText);
}
