var KA = KA || {};

//-------- BUBBLES 12x13 -------//
/*
bubbles.animations.add('bubble_low', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12], 5, true);
bubbles.animations.add('bubble_mid', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 29], 5, true);
bubbles.animations.add('bubble_high', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], 5, true);
*/


KA.NPC = function(game, name, x, fx, mission){
    //if (typeof(direction)==='undefined') direction = 1;
    this.name = name;
    Phaser.Sprite.call(this, game, x, 0, "npcs");
    game.add.existing(this);
    this.assignAnimations();
    this.missionId = -1;
    this.missionX = fx;
    this.state = NPC_STATE_IDLE;
    this.setMission(mission);
    this.animations.play("walk");
    this.y = FLOOR_Y - this.height;
    this.speedPerc = NPC_SPEED_PERC;
    this.stunned = false;
    this.tempRandSentence = this.getRandomSentence();
    //this.setRandomDirection();
    this.setAnchor();
    this.thoughtBubble = null; //thought about the product
    this.bubbles = null;   // influence bubbles
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
    trace("COLL!!!, " + this.isZombie);
    if(!this.isZombie())this.influence(brandId);   
}

/*
KA.NPC.prototype.setMissionX = function(x){
    this.missionX = x;
}
*/

KA.NPC.prototype.setMission = function(id){
    this.missionId = id;
    trace("this.missionX: " + this.missionX);
    this.face(this.missionX);
}

KA.NPC.prototype.face = function(x){
    if(x >= this.x && this.scale.x == -1)this.scale.x = 1;
    else if(x < this.x && this.scale.x == 1)this.scale.x = -1;
}

KA.NPC.prototype.influence = function(brandId){
    this.brandInfluence[brandId] += BULLET_DAMAGE;
    trace("brandInfluence: "  + this.brandInfluence[brandId]);
    if(this.brandInfluence[brandId]>=25 && this.brandInfluence[brandId]<50){
        trace("BUBBLE LOW!")
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
    this.game.time.events.add(1000, this.recoverFromStun, this);
}


KA.NPC.prototype.stun = function(){
    this.stunned = true;
    this.thoughtBubble = this.game.make.sprite(11, 13,'influence_bubbles');
    this.thoughtBubble.x = -10;
    this.thoughtBubble.y = -12;
    this.thoughtBubble.frame = 2;
    this.addChild(this.thoughtBubble);
    
}

KA.NPC.prototype.showBubbles = function(name){
    if(this.children.indexOf(this.bubbles) == -1)this.addChild(this.bubbles);
    else trace("already exists");
    this.bubbles.x = -this.bubbles.width * .5;
    this.bubbles.y = -10;
    this.bubbles.animations.play(name);
    trace("animations add!!");
}

KA.NPC.prototype.removeBubbles = function(name){
    if(this.bubbles!=null)this.removeChild(this.bubbles);
}


KA.NPC.prototype.gotoTheShop = function(){
    this.missionX = SHOP_X;
    this.setMission(GO_TO_SHOP);
}

 

KA.NPC.prototype.recoverFromStun = function(){
    this.stunned = false;
    if(this.thoughtBubble!=null)this.removeChild(this.thoughtBubble);
}

KA.NPC.prototype.zombify = function(brandId){
    this.name = "business_woman_zombie";
    this.assignAnimations();
    this.playAnim("walk");
    this.tint = KA.getTintFromBrandId(brandId);
    if(KA.NPCManager.isEverybodyZombie()){
        trace("GAME OVER!!!!!!!!!");
        gameOver();
    }
}

KA.NPC.prototype.isZombie = function(){
    return this.name == "business_woman_zombie";
}
KA.NPC.prototype.onAction = function(player) {
    if(this.isNearPlayer(player)){
        trace("111");
        this.speak(this.tempRandSentence);
    }
}
KA.NPC.prototype.isNearPlayer = function(player){
    trace("this.x " + this.x);
    trace("player.x " + player.x);
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

KA.NPC.prototype.assignAnimations = function() {
    switch(this.name){
        case "girl":
            this.animations.add('idle', [0], 5, false);
            //this.animations.add('walk', [1, 2, 3, 4], 5, true);
            this.animations.add('walk', [0, 1], 5, true);
        break;
        case "old_man":
            trace("b");
            this.animations.add('idle', [5], 5, false);
            this.animations.add('walk', [5, 6, 7, 8, 9, 10, 11, 12], 5, true);
        break;
        case "business_man":
            this.animations.add('idle', [13], 5, false);
            this.animations.add('walk', [14, 15, 16, 17], 5, true);
        break;
        case "cool_guy":
            this.animations.add('idle', [18], 5, false);
            this.animations.add('walk', [19, 20, 21, 22], 5, true);
        break;
        case "business_woman":
            this.animations.add('idle', [23], 5, false);
            this.animations.add('walk', [24, 25, 26, 27], 5, true);
        break;
        case "business_woman_zombie":
            //this.tint = TINT_FOOD;
            //this.animations.add('idle', [28], 5, false);
            this.animations.add('walk', [28, 29, 30, 31], 5, true);
        break;
        default:
            trace("DEFAULT!");
    }
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

KA.NPC.prototype.missionComplete = function(){
    trace("Mission " +this.missionId+ " is complete!");
    if(this.missionId == 0)this.state = NPC_STATE_WORKING;
    if(KA.NPCManager.isEverybodyWorking()){
        nextDayPart();
    }
    this.doRemove();
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
    return this.state == NPC_STATE_WORKING;
}

KA.NPC.prototype.setRandomDirection = function(){
    //trace(Math.random());
    if(Math.random()<.5)this.scale.setTo(this.scale.x * -1, 1);
    //else this.scale.setTo(this.scale.x * -1, 1);
}