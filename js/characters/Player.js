var KA = KA || {};
//STRINGS
var STAND = "stand", STOP = "stop", WIND = "wind", RUN = "run", RUN_BREATHE = "run_breathe", JUMP = "jump", LAND = "land", LAND_HARD = "land_hard", KICK = "kick", KICK_AIR = "kick_air",CROUCH = "crouch", SPLAT = "splat";
//OBJECTS
var cursors;
var kickAnim, runAnim, kickAirAnim, landHardAnim, splatAnim;
var jumpButton, actionButton, splatButton, infoButton;
KA.Player = function(game, name, x, y){
    KA.Character.call(this, game, name, x, y);
    this.speechBubbleY = -16;
    this.anchor.setTo(0.5, 0);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.addAnimations();
    this.body.checkCollision.up = this.body.checkCollision.left = this.body.checkCollision.right = false;
    this.body.setSize(8, 20, 6, 2); //adjust collision box
    this.body.collideWorldBounds = this.inputEnabled = true;
    this.needsAir = this.jumpingDown = this.acting = false;
    this.thinkLinesBubble = null;
    this.runCounter = this.jumpDownCounter = this.maxYSpeed = 0;
    game.camera.follow(this);
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    actionButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
    splatButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
    infoButton = game.input.keyboard.addKey(Phaser.Keyboard.I);
    this.playAnim(JUMP);
};
KA.Player.prototype = Object.create(KA.Character.prototype); 
KA.Player.prototype.constructor = KA.Player;
/*FUNCTIONS*/
KA.Player.prototype.act = function(){
    //trace("ACT")
    if(this.canAct()){
        //trace("doAction.dispatch");
        Signals.doAction.dispatch(this);
        this.acting = true;
    }
    if(this.canKick())this.kick();
}
KA.Player.prototype.addAnimations = function(){
    this.animations.add(STAND, [0], 10, false);
    this.animations.add(STOP, [5, 6, 7, 8, 9, 10, 11], 10, false);
    this.animations.add(WIND, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 10, false);
    runAnim = this.animations.add(RUN, [12, 13, 14, 15, 16, 17, 18, 19], 10, true);
    this.animations.add(JUMP, [20, 21, 22], 10, true);
    this.animations.add(LAND, [23, 24, 25, 26, 11], 10, false);
    landHardAnim = this.animations.add(LAND_HARD, [27, 28, 29, 30, 31], 10, false);
    kickAnim = this.animations.add(KICK, [32, 33, 34, 35], 10, false);
    kickAirAnim = this.animations.add(KICK_AIR, [36, 37], 10, false);
    this.animations.add(CROUCH, [38, 39, 40, 41, 42], 16, false);
    this.animations.add(RUN_BREATHE, [43, 44, 45, 46, 47, 48, 49, 50], 10, true);
    splatAnim = this.animations.add(SPLAT, [51, 52, 53, 54, 55, 56, 57, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 59, 58, 58, 58, 58, 58, 58, 58, 58, 58, 59, 60, 61, 62, 63, 64, 65, 64, 64, 64, 64, 64, 64, 64, 64, 64, 66, 67, 68, 68, 68, 68, 68, 68, 68, 69, 68, 68, 68, 68, 68, 68, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82], 10, false);
}
KA.Player.prototype.canAct = function(){
    return !this.acting;
}
KA.Player.prototype.canKick = function(){
    if(KA.NPCManager.isPlayerNearAnybody() || this.state==CROUCH)return false;
    else return true;
}
KA.Player.prototype.enableInput = function(){
    this.inputEnabled = true;
}
KA.Player.prototype.disableInput = function(){
    this.inputEnabled = false;
    //cursors.onDown = jumpButton.onDown = actionButton.onDown = null;
}
KA.Player.prototype.isDown = function(button){
    return button.isDown && this.inputEnabled;
}
KA.Player.prototype.isRunning = function(){
    return this.state==RUN || this.state==RUN_BREATHE;
}
KA.Player.prototype.isKicking = function(){
    return this.state==KICK || this.state==KICK_AIR;
}
KA.Player.prototype.isOnTheFloor = function(){
    return this.y > 320 && this.y < 330;
}
KA.Player.prototype.isJumpingDown = function(){
    return this.jumpingDown;
}
KA.Player.prototype.jumpDown = function(){
    this.jumpingDown = true;
    this.playAnim(JUMP);
}
KA.Player.prototype.land = function(){
    if(this.maxYSpeed <=4){
        this.playAnim(LAND);
    }else if(this.maxYSpeed > 4 && this.maxYSpeed<=6){
        this.landHard();
    }else if(this.maxYSpeed>6){
        this.splat();
    }
    this.maxYSpeed = 0;
}
KA.Player.prototype.landHard = function(){
    this.body.velocity.x = 0
    this.playAnim(LAND_HARD);
    landHardAnim.onComplete.add(this.onSplatAnimComplete, this);
}
KA.Player.prototype.restoreTint = function(){
    this.tint = 16777215;
}
KA.Player.prototype.endAction = function(){
    this.acting = false;
}
KA.Player.prototype.kick = function(){
    Signals.kick.dispatch(this);
    if(this.state==JUMP){
        this.playAnim(KICK_AIR);
        kickAirAnim.onComplete.add(this.onKickAnimComplete, this);
    }else{
        this.playAnim(KICK);
        kickAnim.onComplete.add(this.onKickAnimComplete, this);
    }
    this.body.velocity.x = ATTACK_SPEED * this.scale.x;
}
KA.Player.prototype.onRunAnimComplete = function(){
    //////////trace("AIR!");
    this.needsAir = true;
    this.runCounter = 0;
    this.playAnim(RUN_BREATHE);
    runAnim.onLoop.remove(this.onRunAnimComplete, this);
    //this.needsAir = true;
}
KA.Player.prototype.onKickAnimComplete = function(){
    if(this.state==JUMP)playAnim(JUMP);
    else this.playAnim(STAND);
}
KA.Player.prototype.onSplatAnimComplete = function(){
    this.playAnim(STAND);
}
KA.Player.prototype.playAnim = function(name){
    //Object.getPrototypeOf(KA.Player.prototype).playAnim(name);
   this.state = name;
    if(this.animations)this.animations.play(name);
    if(this.state!=RUN_BREATHE && this.needsAir){
        this.needsAir = false;
    }
}
KA.Player.prototype.run = function(){
    if(this.needsAir)this.playAnim(RUN_BREATHE);
    else this.playAnim(RUN);
}
KA.Player.prototype.splat = function(){
    this.body.velocity.x = 0
    this.playAnim(SPLAT);
    splatAnim.onComplete.add(this.onSplatAnimComplete, this);
}

KA.Player.prototype.update = function(){
    if(this.state==SPLAT || this.state==LAND_HARD)return; //must wait for end of land hard or splate animations
    if(this.jumpingDown){
        this.jumpDownCounter++;
        if(this.jumpDownCounter > MAX_JUMP_DOWN_COUNTER){
            this.jumpDownCounter = 0;
            this.jumpingDown = false;
        }
    }
    if(this.state==RUN){
        this.runCounter++;
        if(this.runCounter>=MAX_RUN_COUNTER){
            runAnim.onLoop.add(this.onRunAnimComplete, this);
        }
    }
    if(this.state == JUMP){
        var diff = this.body.y - this.body.prev.y;
        if(diff > this.maxYSpeed)this.maxYSpeed = diff;
    }
    if(this.body.velocity.x < -10 || this.body.velocity.x > 10){
        if(this.state==JUMP)this.body.velocity.x *= .9;
        else this.body.velocity.x *= .75;
    }else if(this.body.velocity.x!=0){
        this.body.velocity.x = 0;
    }
    var isOnFloor = this.body.onFloor();
    if (this.isDown(cursors.left)){   //PRESS LEFT
        if(this.isFacingRight())this.flipX();
        if(!cursors.down.isDown){
            this.body.velocity.x = -RUN_SPEED;
            if(this.state!=JUMP && !this.isKicking()){
                this.run();
            }
        }
    }else if (this.isDown(cursors.right) && !cursors.down.isDown){  //PRESS RIGHT
        if(this.isFacingLeft())this.flipX();
        if(!cursors.down.isDown){
            this.body.velocity.x = RUN_SPEED;
            if(this.state!=JUMP && !this.isKicking()){
                this.run();
            }
        }
    }else{
        if(this.isRunning() && isOnFloor){
            this.playAnim(STOP);
        }
    }
    if(isOnFloor){
        if(this.state==JUMP){ 
            this.land();
        }else if (this.isDown(jumpButton) && this.state==CROUCH && !this.isOnTheFloor()){ //JUMP DOWN
            this.jumpDown();
        }else if (this.isDown(jumpButton) && this.state!=JUMP){ //JUMP
            this.body.velocity.y = -JUMP_SPEED;  
            this.playAnim(JUMP);
        }else if(this.isDown(cursors.down) && this.state!=CROUCH){ //CROUCH
            this.playAnim(CROUCH);
        }else if(cursors.down.isUp && this.state==CROUCH){ //STAND UP
            this.playAnim(STOP);
        }
        if(splatButton.isDown && DEBUG_MODE && (this.state==STAND || this.state==STOP)){
            this.splat();
        }
        if(infoButton.isDown){
            ////trace("x: " + this.x);
        }
    }else{
        if(this.isRunning()){
            this.playAnim(JUMP);
        }
    }
    if(this.isDown(actionButton) && !this.isKicking()){
        this.act();
    }else if (actionButton.isUp && this.isKicking()){
        if(this.state==JUMP)this.playAnim(JUMP);
        else if (this.isRunning()) this.run();
    }
    if(kickAirAnim.isPlaying && this.state==JUMP){
       this.body.velocity.x = ATTACK_SPEED * this.scale.x;
    }
}