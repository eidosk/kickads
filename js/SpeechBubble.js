var KA = KA || {};
KA.SpeechBubble = function(game, msg, character, y){
    Phaser.Group.call(this, game);
    game.add.existing(this);
    this.topLeftCorner = game.make.sprite(0, 0,'speech_corner');
    var cornerWidth = this.topLeftCorner.width;
    var cornerHeight = this.topLeftCorner.height;
    this.text = game.add.bitmapText(cornerWidth, -1, 'myfont', msg, 16);
    var bodyCenter = game.make.sprite(this.topLeftCorner.width, 0,'speech_body');
    bodyCenter.width = this.text.width;
    var textHeight = 6;
    bodyCenter.height = textHeight;
    var topRightCorner = game.make.sprite(cornerWidth*2 + this.text.width, 0,'speech_corner');
    topRightCorner.scale.setTo(-1, 1);
    var bottomLeftCorner = game.make.sprite(0, textHeight*2,'speech_corner');
    bottomLeftCorner.scale.setTo(1,-1);
    var bottomRightCorner = game.make.sprite(cornerWidth*2 + this.text.width, textHeight*2,'speech_corner');
    bottomRightCorner.scale.setTo(-1, -1);
    this.add(this.topLeftCorner);
    this.add(bodyCenter);
    this.add(topRightCorner);
    this.add(bottomLeftCorner);
    this.add(bottomRightCorner);
    bodyCenter.height = this.height;
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
    this.add(this.text);
    this.center();
    if(y)this.y = y;
    else this.y = -16;
    if(character.scale.x == -1)this.flipText();
}
KA.SpeechBubble.prototype = Object.create(Phaser.Group.prototype);
KA.SpeechBubble.prototype.constructor = KA.SpeechBubble;
/*FUNCTIONS*/
KA.SpeechBubble.prototype.flipText = function(){
    this.scale.setTo(this.scale.x * -1, 1);
    this.center();
}
KA.SpeechBubble.prototype.center = function(){
    this.x = - Math.floor(this.width *.5);
}