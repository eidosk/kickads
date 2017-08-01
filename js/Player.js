var KA = KA || {};
//BOOL
var needsAir = false;
var jumpingDown = false;
//NUMBERS
var kickCounter = 0;
var runCounter = 0;
var jumpDownCounter = 0;
var maxYSpeed = 0;
//STRINGS
var STAND = "stand", STOP = "stop", WIND = "wind", RUN = "run", RUN_BREATHE = "run_breathe", JUMP = "jump", LAND = "land", LAND_HARD = "land_hard", KICK = "kick", KICK_AIR = "kick_air",CROUCH = "crouch", SPLAT = "splat";
//OBJECTS
var kickAnim;
var runAnim;
var kickAirAnim;
var landHardAnim;
var splatAnim;
var cursors;
var jumpButton;
var actionButton;
var splatButton;
var debugButton;
var state;
KA.Player = function(game, name){
    Phaser.Sprite.call(this, game, 32, 300, name);
    game.add.existing(this);
    //trace("wtf" + this);
    this.anchor.setTo(0.5, 0);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.addAnimations();
    this.body.checkCollision.up = false;
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;
    this.body.setSize(8, 20, 6, 2); //adjust collision box
    this.body.collideWorldBounds = true;
    game.camera.follow(this);
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    actionButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
    splatButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
    debugButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
    game.input.keyboard.onDownCallback = function(){
        if(game.input.keyboard.event.keyCode==68){
            DEBUG_MODE = !DEBUG_MODE;
        }
    }
    //state = this.state;
    this.playAnim(JUMP);
};

KA.Player.prototype = Object.create(KA.Character.prototype); 
KA.Player.prototype.constructor = KA.Player;

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

KA.Player.prototype.playAnim = function(name){
    //Object.getPrototypeOf(KA.Player.prototype).playAnim(name);
   state = name;
    if(this.animations)this.animations.play(name);
    if(state!=RUN_BREATHE && needsAir){
        needsAir = false;
    }
}

KA.Player.prototype.splat = function(){
    this.body.velocity.x = 0
    this.playAnim(SPLAT);
    splatAnim.onComplete.add(this.onSplatAnimComplete, this);
}

KA.Player.prototype.land = function(){
    if(maxYSpeed <=4){
        this.playAnim(LAND);
    }else if(maxYSpeed > 4 && maxYSpeed<=6){
        this.landHard();
    }else if(maxYSpeed>6){
        this.splat();
    }
    maxYSpeed = 0;
}

KA.Player.prototype.landHard = function(){
    this.body.velocity.x = 0
    this.playAnim(LAND_HARD);
    landHardAnim.onComplete.add(this.onSplatAnimComplete, this);
}

KA.Player.prototype.onSplatAnimComplete = function(){
    this.playAnim(STAND);
}

KA.Player.prototype.run = function(){
    if(needsAir)this.playAnim(RUN_BREATHE);
    else this.playAnim(RUN);
}


KA.Player.prototype.isRunning = function(){
    return state==RUN || state==RUN_BREATHE;
}

KA.Player.prototype.isKicking = function(){
    return state==KICK || state==KICK_AIR;
}
KA.Player.prototype.onRunAnimComplete = function(){
    //trace("AIR!");
    needsAir = true;
    runCounter = 0;
    this.playAnim(RUN_BREATHE);
    runAnim.onLoop.remove(this.onRunAnimComplete, this);
    //needsAir = true;
}

KA.Player.prototype.onKickAnimComplete = function(){
    if(state==JUMP)playAnim(JUMP);
    else this.playAnim(STAND);
}

KA.Player.prototype.isOnTheFloor = function(){
    return this.y > 320 && this.y < 330;
}
KA.Player.prototype.jumpDown = function(){
    jumpingDown = true;
    this.playAnim(JUMP);
}
KA.Player.prototype.kick = function(){
    Signals.kick.dispatch(this);
    if(state==JUMP){
        this.playAnim(KICK_AIR);
        kickAirAnim.onComplete.add(this.onKickAnimComplete, this);
    }else{
        this.playAnim(KICK);
        kickAnim.onComplete.add(this.onKickAnimComplete, this);
    }
    this.body.velocity.x = ATTACK_SPEED * this.scale.x;
}

KA.Player.prototype.tempTint = function(tint){
    trace("original tint: " + this.tint);
    this.tint = tint;
    game.time.events.add(2000, this.restoreTint, this);
}

KA.Player.prototype.restoreTint = function(){
    this.tint = 16777215;
}

KA.Player.prototype.update = function(){
    if(state==SPLAT || state==LAND_HARD)return; //must wait for end of land hard or splate animations
    if(jumpingDown){
        jumpDownCounter++;
        if(jumpDownCounter > MAX_JUMP_DOWN_COUNTER){
            jumpDownCounter = 0;
            jumpingDown = false;
        }
    }
    if(state==RUN){
        runCounter++;
        if(runCounter>=MAX_RUN_COUNTER){
            runAnim.onLoop.add(this.onRunAnimComplete, this);
        }
    }
    if(state == JUMP){
        var diff = this.body.y - this.body.prev.y;
        if(diff > maxYSpeed)maxYSpeed = diff;
    }
    if(this.body.velocity.x < -10 || this.body.velocity.x > 10){
        if(state==JUMP)this.body.velocity.x *= .9;
        else this.body.velocity.x *= .75;
    }else if(this.body.velocity.x!=0){
        this.body.velocity.x = 0;
    }
    var isOnFloor = this.body.onFloor();
    if (cursors.left.isDown){   //PRESS LEFT
        if(this.isFacingRight())this.flipX();
        this.body.velocity.x = -RUN_SPEED;
        if(state!=JUMP && !this.isKicking()){
            this.run();
        }
    }else if (cursors.right.isDown){  //PRESS RIGHT
        if(this.isFacingLeft())this.flipX();
        this.body.velocity.x = RUN_SPEED;
        if(state!=JUMP && !this.isKicking()){
            this.run();
        }
    }else{
        if(this.isRunning() && isOnFloor){
            this.playAnim(STOP);
        }
    }
    if(isOnFloor){
        if(state==JUMP){
            this.land();
        }else if (jumpButton.isDown && state==CROUCH && !this.isOnTheFloor()){ //JUMP DOWN
            this.jumpDown();
        }else if (jumpButton.isDown && state!=JUMP){ //JUMP
            this.body.velocity.y = -JUMP_SPEED;  
            this.playAnim(JUMP);
        }else if(cursors.down.isDown && state!=CROUCH){ //CROUCH
            this.playAnim(CROUCH);
        }else if(cursors.down.isUp && state==CROUCH){ //STAND UP
            this.playAnim(STOP);
        }
        if(splatButton.isDown && DEBUG_MODE && (state==STAND || state==STOP)){
            this.splat();
        }
    }else{
        if(this.isRunning()){
            this.playAnim(JUMP);
        }
    }
    if(actionButton.isDown && !this.isKicking()){
        trace("KICK!!!");
        this.kick();
    }else if (actionButton.isUp && this.isKicking()){
        if(state==JUMP)this.playAnim(JUMP);
        else if (this.isRunning()) this.run();
        //else this.playAnim(STAND);
    }
    if(kickAirAnim.isPlaying && state==JUMP){
       this.body.velocity.x = ATTACK_SPEED * this.scale.x;
    }
}