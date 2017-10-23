var KA = KA || {};
KA.SpeechBubble = function(game, msg, character, y){
    Phaser.Group.call(this, game);
    game.add.existing(this);
    this.topLeftCorner = game.make.sprite(0, 0,'speech_corner');
    var cornerWidth =  this.topLeftCorner.width;
    var cornerHeight = this.topLeftCorner.height;
    this.setText(msg);
    this.bodyCenter = game.make.sprite(this.topLeftCorner.width, 0,'speech_body');
    this.bodyCenter.width = this.text.width;
    var textHeight = 6;
    this.bodyCenter.height = textHeight;
    this.topRightCorner = game.make.sprite(cornerWidth*2 + this.text.width, 0,'speech_corner');
    this.topRightCorner.scale.setTo(-1, 1);
    this.bottomLeftCorner = game.make.sprite(0, textHeight*2,'speech_corner');
    this.bottomLeftCorner.scale.setTo(1,-1);
    this.bottomRightCorner = game.make.sprite(cornerWidth*2 + this.text.width, textHeight*2,'speech_corner');
    this.bottomRightCorner.scale.setTo(-1, -1);
    this.add(this.topLeftCorner);
    this.add(this.bodyCenter);
    this.add(this.topRightCorner);
    this.add(this.bottomLeftCorner);
    this.add(this.bottomRightCorner);
    this.bodyCenter.height = this.height;
    if(this.height > cornerHeight*2){
        var bodyLeft = game.make.sprite(0, cornerHeight,'speech_body');
        var bodyRight = game.make.sprite(this.width - cornerWidth, cornerHeight,'speech_body');
        bodyLeft.width = bodyRight.width = cornerWidth;
        bodyLeft.height = bodyRight.height = this.height - cornerHeight*2;
        this.add(bodyLeft);
        this.add(bodyRight);
    }
    var arrow = game.make.sprite(0, 0, 'speech_arrow');
    this.add(arrow);
    arrow.x = Math.floor(this.width * .5) - 2;
    arrow.y = this.height;
    this.y = y;
    this.add(this.text);
    this.center();
    if(character.scale.x == -1)this.flipText();
}
KA.SpeechBubble.prototype = Object.create(Phaser.Group.prototype);
KA.SpeechBubble.prototype.constructor = KA.SpeechBubble;
/*FUNCTIONS*/
KA.SpeechBubble.prototype.center = function(){
    this.x = - Math.floor(this.width *.5);
}
KA.SpeechBubble.prototype.flipText = function(){
    this.scale.setTo(this.scale.x * -1, 1);
    this.center();
}
KA.SpeechBubble.prototype.setText = function(txt){
    if(this.text!=null){
        this.removeChild(this.text);
        this.text = null;
    }
    trace("text: " + txt);
    this.text = this.game.add.bitmapText(this.topLeftCorner.width, -1, 'myfont', txt, 16);
}
