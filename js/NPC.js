var KA = KA || {};
KA.NPC = function(game, name){
    this.name = name;
    Phaser.Sprite.call(this, game, game.world.randomX, 0, "npcs");
    game.add.existing(this);
    this.assignAnimations();
    this.animations.play("walk");
    this.y = FLOOR_Y - this.height;
    this.setRandomDirection();
    this.setAnchor();
    this.body = this.addChild(this.createBody());
    this.brandInfluence = [0,0,0,0];
    Signals.kick.add(this.onKick, this);
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
    this.brandInfluence[brandId] += 25;
    trace("brandInfluence: "  + this.brandInfluence[brandId]);
    if(this.brandInfluence[brandId]>=100){
        this.zombify(brandId);
    }
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


KA.NPC.prototype.onKick = function(player) {
    if(Math.abs(player.x - this.x) < 20 && Math.abs(player.y - this.y)<15){
        trace("KICK THIS GUY!")
        player.speak(this.getRandomSentence());
        this.speak(this.getRandomSentenceNPC());
        this.flipX();
    }
}

KA.NPC.prototype.getRandomSentence = function(){
    var arr = [];
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
            this.animations.add('idle', [28], 5, false);
            this.animations.add('walk', [28, 29, 30, 31], 5, true);
        break;
        default:
            trace("DEFAULT!");
    }
}
/*
girl.animations.add('idle', [0], 5, false);
girl.animations.add('walk', [1, 2, 3, 4], 5, true);
old_man.animations.add('walk', [5, 6, 7, 8, 9, 10, 11, 12], 5, true);
business_man.animations.add('idle', [13], 5, false);
business_man.animations.add('walk', [14, 15, 16, 17], 5, true);
cool_guy.animations.add('idle', [18], 5, false);
cool_guy.animations.add('walk', [19, 20, 21, 22], 5, true);
business_woman.animations.add('idle', [23], 5, false);
business_woman.animations.add('walk', [24, 25, 26, 27], 5, true);
business_woman_zombie.animations.add('walk', [28, 29, 30, 31], 5, true);
*/
KA.NPC.prototype.update = function(){
    this.x += this.scale.x * .1;
    if(this.isOffScreen())this.flipX();
}
KA.NPC.prototype.setRandomDirection = function(){
    //trace(Math.random());
    if(Math.random()<.5)this.scale.setTo(this.scale.x * -1, 1);
    //else this.scale.setTo(this.scale.x * -1, 1);
}