var KA = KA || {};



//-------- BUBBLES 12x13 -------//


/*
bubbles.animations.add('bubble_low', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12], 5, true);
bubbles.animations.add('bubble_mid', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 29], 5, true);
bubbles.animations.add('bubble_high', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], 5, true);

*/


KA.NPC = function(game, name, x, direction){
    if (typeof(direction)==='undefined') direction = 1;
    this.name = name;
    Phaser.Sprite.call(this, game, x, 0, "npcs");
    game.add.existing(this);
    this.assignAnimations();
    this.animations.play("walk");
    this.y = FLOOR_Y - this.height;
    this.scale.setTo(direction, 1);
    this.speedPerc = .1;
    this.stunned = false;
    this.tempRandSentence = this.getRandomSentence();
    //this.setRandomDirection();
    this.setAnchor();
    this.thoughtBubble = null;
    this.bubbles = null;
    
    this.bubbles = this.game.make.sprite(12, 13,'bubbles');
    this.bubbles.animations.add('bubble_low', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12], 8, true);
    this.bubbles.animations.add('bubble_mid', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 29], 8, true);
    this.bubbles.animations.add('bubble_high', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], 8, true);
    
    this.body = this.addChild(this.createBody());
    this.brandInfluence = [0,0,0,0];
    //Signals.kick.add(this.onKick, this);
    Signals.doAction.add(this.onAction, this);
    
    this.showBubbles();
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
    this.influence(brandId);   
}
KA.NPC.prototype.influence = function(brandId){
    this.brandInfluence[brandId] += 10;
    trace("brandInfluence: "  + this.brandInfluence[brandId]);
    this.stun();
    this.game.time.events.add(1000, this.recoverFromStun, this);
    if(this.brandInfluence[brandId]>=100){
        this.zombify(brandId);
    }
}


KA.NPC.prototype.stun = function(){
    this.stunned = true;
    this.thoughtBubble = this.game.make.sprite(11, 13,'influence_bubbles');
    this.thoughtBubble.x = -10;
    this.thoughtBubble.y = -12;
    this.thoughtBubble.frame = 2;
    this.addChild(this.thoughtBubble);
    
}

KA.NPC.prototype.showBubbles = function(){
    this.addChild(this.bubbles);
    this.bubbles.x = -this.bubbles.width * .5;
    this.bubbles.y = -10;
    //this.bubbles.animations.play('bubble_low');
    //this.bubbles.animations.play('bubble_mid');
    this.bubbles.animations.play('bubble_high');
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
        this.game.state.start("GameOver");
    }
}

KA.NPC.prototype.isZombie = function(){
    return this.name == "business_woman_zombie";
}
KA.NPC.prototype.onAction = function(player) {
    if(this.isNearPlayer(player)){
        this.speak(this.tempRandSentence);
        
        //player.speak(this.getRandomSentence());
        //this.flipX();
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
    
    if(this.x > 482 && this.x < 488){  //temp
        this.removeSpeechBubble();
        this.removePopUp();
        this.destroy();
    }
    
}
KA.NPC.prototype.setRandomDirection = function(){
    //trace(Math.random());
    if(Math.random()<.5)this.scale.setTo(this.scale.x * -1, 1);
    //else this.scale.setTo(this.scale.x * -1, 1);
}