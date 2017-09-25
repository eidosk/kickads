var KA = KA || {};

/*
//------- NPCs 22X30 -------//
girl.animations.add('idle', [0], 5, false);
girl.animations.add('walk', [1, 2, 3, 4], 5, true);
old_man.animations.add('walk', [5, 6, 7, 8, 9, 10, 11, 12], 5, true);
business_man.animations.add('idle', [0], 5, false);
business_man.animations.add('walk', [1, 2, 3, 4, 5, 6, 7, 8], 5, true);
business_man.animations.add('idle_zombie', [9], 5, false);
business_man.animations.add('walk_zombie', [15, 16, 17, 18, 19, 20, 21, 22], 5, true);
*/

KA.NPC = function(game, name, x, fx, mission){
    //if (typeof(direction)==='undefined') direction = 1;
    this.name = name;
    Phaser.Sprite.call(this, game, x, 0, name);
    game.add.existing(this);
    this.zombie = false;
    this.stunned = false;
    this.missionId = -1;
    this.prevMissionId = -1;
    this.missionX = fx;
    this.state = KA.NPC.IDLE;
    this.setMission(mission);
    this.animations.add('idle', [0], 5, false);
    this.animations.add('walk', [1, 2, 3, 4, 5, 6, 7, 8], 5, true);
    this.animations.add('idle_zombie', [9], 5, false);
    this.animations.add('walk_zombie', [10, 11, 12, 13, 14, 15, 16, 17], 5, true);
    this.animations.play("walk");
    this.y = FLOOR_Y - this.height;
    this.speedPerc = NPC_SPEED_PERC;
    this.tempRandSentence = this.getRandomSentence();
    //this.setRandomDirection();
    this.setAnchor();
    this.thoughtBubble = null; //thought about the product
    this.bubbles = null;   // influence bubbles
    this.thoughtBubble = this.game.make.sprite(11, 13,'influence_bubbles');
    this.bubbles = this.game.make.sprite(12, 13,'bubbles');
    this.bubbles.animations.add('bubble_low', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12], 8, true);
    this.bubbles.animations.add('bubble_mid', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 29], 8, true);
    this.bubbles.animations.add('bubble_high', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], 8, true);
    this.body = this.addChild(this.createBody());
    this.brandInfluence = [0,0,0,0];
    //Signals.kick.add(this.onKick, this);
    Signals.doAction.add(this.onAction, this);
    //this.showBubbles();
};

//CONSTANTS
KA.NPC.IDLE = "idle";
KA.NPC.WORKING = "working";
KA.NPC.SHOPPING = "shopping";

KA.NPC.prototype = Object.create(KA.Character.prototype); 
KA.NPC.prototype.constructor = KA.NPC;
KA.NPC.prototype.createBody = function(){
    var body = game.make.sprite(-5, 10, 'pixel');
    body.width = 14;
    body.height = 20;
    body.alpha = HIT_AREA_ALPHA;
    return body;
}
KA.NPC.prototype.onCollision = function(brandId){
    //trace("COLL!!!, " + this.isZombie);
    if(!this.isZombie())this.influence(brandId);   
}

KA.NPC.prototype.face = function(x){
    if(x >= this.x && this.scale.x == -1)this.scale.x = 1;
    else if(x < this.x && this.scale.x == 1)this.scale.x = -1;
}

KA.NPC.prototype.influence = function(brandId){
    this.brandInfluence[brandId] += HIT_DAMAGE;
    //trace("brandInfluence: "  + this.brandInfluence[brandId]);
    if(this.brandInfluence[brandId]>=25 && this.brandInfluence[brandId]<50){
        //trace("BUBBLE LOW!")
        this.showBubbles("bubble_low");
    }else if(this.brandInfluence[brandId]>=50 && this.brandInfluence[brandId]<75){
        this.showBubbles("bubble_mid");
    }else if(this.brandInfluence[brandId]>=75 && this.brandInfluence[brandId]<100){
        this.showBubbles("bubble_high");
    }else if(this.brandInfluence[brandId]>=100){
        this.removeBubbles();
        this.zombify(brandId);
        this.gotoTheShop();
    }
    this.stun();
    
}

KA.NPC.prototype.stun = function(){
    //trace("STUN!")
    this.animations.stop();
    if(this.isZombie())this.animations.frame = 9;
    else this.animations.frame = 0;    
    this.stunned = true;
    if(this.areThereBubbles())this.bubbles.alpha = 0;
    this.thoughtBubble.x = -10;
    this.thoughtBubble.y = -12;
    this.thoughtBubble.frame = 2;
    if(!this.areThereThoughtBubbles()){
        //trace("ADD THOUGHT!");
        this.addChild(this.thoughtBubble);
    }
    this.game.time.events.add(1000, this.recoverFromStun, this);
}


KA.NPC.prototype.recoverFromStun = function(){
    if(this.isZombie())this.animations.play("walk_zombie");
    else this.animations.play("walk");
    this.stunned = false;
    if(this.areThereBubbles())this.bubbles.alpha = 1;
    if(this.areThereThoughtBubbles())this.removeChild(this.thoughtBubble);
}

KA.NPC.prototype.areThereBubbles = function(){
    return (this.children.indexOf(this.bubbles) != -1);
}

KA.NPC.prototype.areThereThoughtBubbles = function(){
    return (this.children.indexOf(this.thoughtBubble) != -1);
}


KA.NPC.prototype.showBubbles = function(name){
    if(!this.areThereBubbles())this.addChild(this.bubbles);
    else //trace("already exists");
    this.bubbles.x = -this.bubbles.width * .5;
    this.bubbles.y = -10;
    this.bubbles.animations.play(name);
    //trace("animations add!!");
}

KA.NPC.prototype.removeBubbles = function(name){
    if(this.bubbles!=null)this.removeChild(this.bubbles);
}


KA.NPC.prototype.gotoTheShop = function(){
    this.prevMissionId = this.missionId;
    this.missionX = SHOP_X;
    this.setMission(GO_TO_SHOP);
}

KA.NPC.prototype.setMission = function(id){
    this.missionId = id;
    //trace("this.missionX: " + this.missionX);
    this.face(this.missionX);
}

KA.NPC.prototype.missionComplete = function(){
    //trace("Mission " +this.missionId+ " is complete!");
    if(this.missionId == GO_TO_WORK)this.state = KA.NPC.WORKING;
    else if(this.missionId == GO_TO_SHOP){
        this.state = KA.NPC.SHOPPING;
        this.game.time.events.add(4000, this.endShopping, this);
    }
    
    if(KA.NPCManager.isEverybodyWorking()){
        nextDayPart();
    }
    this.doRemove();
}

KA.NPC.prototype.endShopping = function(){
    this.setMission(this.prevMissionId);
}



KA.NPC.prototype.zombify = function(brandId){
    this.zombie = true;
    
    //this.playAnim("walk_zombie");
    //this.tint = KA.getTintFromBrandId(brandId);
    
    
    /*
    if(KA.NPCManager.isEverybodyZombie()){
        //trace("GAME OVER!!!!!!!!!");
        gameOver();
    }
    */
}

KA.NPC.prototype.isZombie = function(){
    return this.zombie;
}
KA.NPC.prototype.onAction = function(player) {
    if(this.isNearPlayer(player)){
        //trace("111");
        this.speak(this.tempRandSentence);
    }
}
KA.NPC.prototype.isNearPlayer = function(player){
    //trace("this.x " + this.x);
    //trace("player.x " + player.x);
    return (Math.abs(player.x - this.x) < 20 && Math.abs(player.y - this.y)<15);
}
KA.NPC.prototype.getRandomSentence = function(){
    var arr = [];
    /*
    arr.push("Take This!");
    arr.push("In your face!");
    arr.push("That will teach you!");
    arr.push("Give me your bubblegums!");
    arr.push("Wrong way!");
    arr.push("Where are you going?");
    arr.push("Who are you?");
    arr.push("I don't like you.");
    arr.push("I am kicking your ass");
    arr.push("Silly person!");
    */
    arr.push("I am going to work");
    arr.push("Sorry, I am busy");
    arr.push("I am late!");
    arr.push("Get out of my way!");
    arr.push("I have no time for you");
    arr.push("You are a weirdo");
    return arr[Math.floor(Math.random()*arr.length)]
}

KA.NPC.prototype.getRandomSentenceNPC = function(){
    var arr = [];
    arr.push("Ouch!");
    arr.push("Hey!");
    arr.push("You are killing me!");
    arr.push("That hurts!");
    return arr[Math.floor(Math.random()*arr.length)]
}

KA.NPC.prototype.isPlayerNear = function(){
    return Math.abs(this.x - KA.player.x) < 20;
}

KA.NPC.prototype.update = function(){
    if(!this.stunned)this.x += this.scale.x * this.speedPerc;
    if(this.isOffScreen())this.flipX();
    if(this.isPlayerNear()){
        this.showPopUp();
    }else if(this.popUp){
        this.removePopUp();
    }
    if(this.x > this.missionX-3 && this.x < this.missionX+3){  //temp
        this.missionComplete();
    }
}

KA.NPC.prototype.doRemove = function(){
    Signals.doAction.remove(this.onAction, this);
     this.removeSpeechBubble();
    this.removePopUp();
    KA.NPCManager.remove(this);
    this.destroy();
}

KA.NPC.prototype.goHome = function(){
    
}

KA.NPC.prototype.isWorking = function(){
    return this.state == KA.NPC.WORKING;
}

KA.NPC.prototype.setRandomDirection = function(){
    ////trace(Math.random());
    if(Math.random()<.5)this.scale.setTo(this.scale.x * -1, 1);
    //else this.scale.setTo(this.scale.x * -1, 1);
}