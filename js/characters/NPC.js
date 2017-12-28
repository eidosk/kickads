var KA = KA || {};
/*CONSTRUCTOR*/
KA.NPC = function(game, name, x, fx, mission){
    this.name = name;
    this.dialogues = game.cache.getJSON(name);
    //console.log("dialogue set to: " + this.dialogues);
    KA.Character.call(this, game, name, x, 0);
    this.startX = x;
    this.zombie = false, this.stunned = false, this.immune = false, this.distancing = false;
    //can be immune after shopping, until the end of the day, or when 100% aware
    this.missionId = -1;
    this.prevMissionId = -1;
    this.missionX = this.workX = fx;
    this.state = KA.NPC.IDLE;
    this.setMission(mission);
    this.animations.add('idle', [0], 5, false);
    this.animations.add('walk', [1, 2, 3, 4, 5, 6, 7, 8], 5, true);
    this.animations.add('idle_zombie', [9], 5, false);
    this.animations.add('walk_zombie', [10, 11, 12, 13, 14, 15, 16, 17], 5, true);
    this.animations.play("walk");
    this.y = FLOOR_Y - this.height;
    this.speedPerc = NPC_SPEED_PERC;
    this.setAnchor();
    this.thoughtBubble = null, this.bubbles = null;   // influence bubbles
    this.thoughtBubble = this.game.make.sprite(11, 13,'influence_bubbles');
    this.bubbles = this.game.make.sprite(12, 13,'bubbles');
    this.bubbles.animations.add('bubble_low', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12], 8, true);
    this.bubbles.animations.add('bubble_mid', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 29], 8, true);
    this.bubbles.animations.add('bubble_high', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], 8, true);
    this.body = this.addChild(this.createBody());
    Signals.doAction.add(this.onAction, this);
};
KA.NPC.prototype = Object.create(KA.Character.prototype); 
KA.NPC.prototype.constructor = KA.NPC;
/*CONSTANTS*/
KA.NPC.IDLE = "idle", KA.NPC.WORKING = "working", KA.NPC.SHOPPING = "shopping", KA.NPC.AT_HOME = "at home";
KA.NPC.TALK_DISTANCE = 36;
/*FUNCTIONS*/
KA.NPC.prototype.addBars = function(){
    this.awarenessBar = new KA.ProgressBar(this.game, 14 , 3 , this.awareness / 100, 0x00bb00);
    this.addChild(this.awarenessBar);
    this.awarenessBar.x = -7;
    this.awarenessBar.y = -16;
    this.influenceBar = new KA.ProgressBar(this.game, 14 , 3 , this.brandInfluence[0] / 100, 0xFF3300);
    this.addChild(this.influenceBar);
    this.influenceBar.x = -7;
    this.influenceBar.y = -20;
}
KA.NPC.prototype.areThereBubbles = function(){
    return (this.children.indexOf(this.bubbles) != -1);
}
KA.NPC.prototype.areThereThoughtBubbles = function(){
    return (this.children.indexOf(this.thoughtBubble) != -1);
}
KA.NPC.prototype.canBeShot = function(){
    return this.visible && !this.immune;
}
KA.NPC.prototype.createBody = function(){
    var body = this.game.make.sprite(-5, 10, 'pixel');
    body.width = 14, body.height = 20;
    body.alpha = HIT_AREA_ALPHA;
    return body;
}
KA.NPC.prototype.disappear = function(){
    this.visible = false;
    this.zombie = false;
    Signals.doAction.remove(this.onAction, this);
    this.removeSpeechBubble();
    this.removePopUp();
}
KA.NPC.prototype.doRemove = function(){
    this.disappear();
    KA.NPCManager.remove(this);
    this.destroy();
}
KA.NPC.prototype.endShopping = function(){
    console.log("END SHOPPING!");
    this.setMission(this.prevMissionId);
    this.brandInfluence = [0,0,0,0];
    this.updateInfluenceBar();
    this.immune = true; //until end of the day
    this.animations.play("walk");
    this.reappear();
},
KA.NPC.prototype.getApproached = function(){
    this.distancing = true;
    this.immune = true;
    this.awarenessBar.visible = this.influenceBar.visible = false;
},

KA.NPC.prototype.getHitDamage = function(brandId){
    if(this.awareness<25){
       return HIT_DAMAGE[0];
    }else if(this.awareness>=25 && this.awareness<50){
        return HIT_DAMAGE[1];
    }else if(this.awareness>=50 && this.awareness<75){
        return HIT_DAMAGE[2];
    }else if(this.awareness>=75){
        return HIT_DAMAGE[3];
    }
}//get hit damage depending on awareness
/*
KA.NPC.prototype.getRandomSentence = function(){
    var arr = this.getDialoguesArray();
    return arr[Math.floor(Math.random()*arr.length)];
}
*/
KA.NPC.prototype.goHomeAfterWork = function(){
    this.setMission(GO_HOME);
    this.reappear();
}
KA.NPC.prototype.getInfluenceLevel = function(brandId){
    
    if(this.brandInfluence[brandId]==0){
        return 1;
    }else if(this.brandInfluence[brandId]>0 && this.brandInfluence[brandId]<25){
        return 1;
    }else if(this.brandInfluence[brandId]>=25 && this.brandInfluence[brandId]<50){
        return 2;
    }else if(this.brandInfluence[brandId]>=50 && this.brandInfluence[brandId]<75){
        return 3;
    }else if(this.brandInfluence[brandId]>=75 && this.brandInfluence[brandId]<100){
        return 4;
    }else if(this.brandInfluence[brandId]>=100){
        return 5;
    }
}

KA.NPC.prototype.increaseAwareness = function(){
    this.awareness += 5;
    if(this.awareness>=100){
        this.awareness=100;
        this.immune = true;
    }
}
KA.NPC.prototype.influence = function(brandId){
    this.brandInfluence[brandId] += this.getHitDamage();
    this.loseAwareness();
    var influenceLevel = this.getInfluenceLevel(brandId);
    switch(influenceLevel){
        case 0:
        break;
        case 1: //0-24%
        break;
        case 2: //25-49%
            this.showBubbles("bubble_low");
        break;
        case 3: //50-74%
            this.showBubbles("bubble_mid");
        break;
        case 4: //75-99%
            this.showBubbles("bubble_high");
        break;
        case 5: //100%
            this.removeBubbles();
            this.zombify(brandId);
            this.setMission(GO_TO_SHOP);
        break;
    }
    this.updateInfluenceBar();
    this.updateAwarenessBar();
    this.stun();
}
KA.NPC.prototype.isAware = function(){
    return this.awareness >=100;
}
KA.NPC.prototype.isAtHome = function(){
    return this.state == KA.NPC.AT_HOME;
}
KA.NPC.prototype.isNearPlayer = function(player){
    return (Math.abs(player.x - this.x) < 20 && Math.abs(player.y - this.y)<15);
}
KA.NPC.prototype.isWorking = function(){
    return this.state == KA.NPC.WORKING;
}
KA.NPC.prototype.isZombie = function(){
    return this.zombie;
}
KA.NPC.prototype.listen = function(msg){
    
}
KA.NPC.prototype.loseAwareness = function(){
    this.awareness-- ;
    if(this.awareness<=0)this.awareness=0;
}


/*
var GO_TO_WORK = 0;
var GO_TO_SHOP = 1;
var GO_HOME = 2;
*/
KA.NPC.prototype.missionComplete = function(){
    switch(this.missionId){
        case GO_TO_SHOP:
            console.log("GO_TO_SHOP!");
            this.state = KA.NPC.SHOPPING;
            KA.global.profit++;
            this.game.time.events.add(8000, this.endShopping, this);
        break;
        case GO_TO_WORK:
            this.state = KA.NPC.WORKING;
            if(KA.NPCManager.isEverybodyWorking() && KA.Level.isWaitingForNpcs()) KA.Level.nextDayPart();
        break;
        case GO_HOME:
            this.state = KA.NPC.AT_HOME;
            if(KA.NPCManager.isEverybodyHome() && KA.Level.isWaitingForNpcs()) KA.Level.nextDayPart();
        break;
    }
    this.disappear();
}
KA.NPC.prototype.onAction = function(player) {
    if(this.isNearPlayer(player)){
        KA.Dialogue.approach(this);
    }
}
KA.NPC.prototype.onCollision = function(brandId){
    if(!this.isZombie())this.influence(brandId);   
}
KA.NPC.prototype.reappear = function(){
    this.visible = true;
    Signals.doAction.add(this.onAction, this);
    //this.removeSpeechBubble();
    //this.removePopUp();
}
KA.NPC.prototype.recoverFromStun = function(){
    this.resumeWalking();
    this.stunned = false;
    if(this.areThereBubbles())this.bubbles.alpha = 1;
    if(this.areThereThoughtBubbles())this.removeChild(this.thoughtBubble);
}
KA.NPC.prototype.removeBubbles = function(name){
    if(this.bubbles!=null)this.removeChild(this.bubbles);
}

KA.NPC.prototype.resumeMission = function(){
    this.stunned = false;
    this.face(this.missionX);
    this.resumeWalking();
}

KA.NPC.prototype.resumeWalking = function(){
    if(this.isZombie())this.animations.play("walk_zombie");
    else this.animations.play("walk");
}

KA.NPC.prototype.setMission = function(id){
    console.log("set mission: " + id);
    this.prevMissionId = this.missionId;
    console.log("prev mission set to : " + this.prevMissionId);
    this.missionId = id;
    switch(id){
        case GO_TO_SHOP:
            this.missionX = KA.global.shopX;
        break;
        case GO_TO_WORK:
            this.missionX = this.workX;
        break;
        case GO_HOME:
            this.missionX = this.startX;
        break;
    }
    this.face(this.missionX);
}
KA.NPC.prototype.setRandomDirection = function(){
    if(Math.random()<.5)this.scale.setTo(this.scale.x * -1, 1);
    //else this.scale.setTo(this.scale.x * -1, 1);
}
KA.NPC.prototype.showBubbles = function(name){
    if(!this.areThereBubbles())this.addChild(this.bubbles);
    this.bubbles.x = 0;
    this.bubbles.y = -10;
    this.bubbles.animations.play(name);
}
KA.NPC.prototype.stopWalking = function(){
    this.animations.stop();
    if(this.isZombie())this.animations.frame = 9;
    else this.animations.frame = 0;    
    this.stunned = true;
}
KA.NPC.prototype.stun = function(){
    this.stopWalking();
    if(this.areThereBubbles())this.bubbles.alpha = 0;
    this.thoughtBubble.x = -10;
    this.thoughtBubble.y = -12;
    this.thoughtBubble.frame = 2;
    if(!this.areThereThoughtBubbles()){
        this.addChild(this.thoughtBubble);
    }
    this.game.time.events.add(1000, this.recoverFromStun, this);
}
KA.NPC.prototype.update = function(){
    if(this.visible){
        if(!this.stunned)this.x += this.scale.x * this.speedPerc;
        if(this.isOffScreen())this.flipX();
        if(this.isNearPlayer(KA.player) && !this.distancing){
            this.showPopUp();
        }else if(this.popUp && this.speechBubble != null && this.speechBubble.getText() == "..."){
            this.removePopUp();
        }
        if(this.x > this.missionX-3 && this.x < this.missionX+3){
            this.missionComplete();
        }
        if(this.distancing){
            var distance = Math.abs(KA.player.x - this.x);
            if(distance >= KA.NPC.TALK_DISTANCE){
                //this.replyApproach();
                KA.Dialogue.replyApproach();
                this.distancing = false;
            }
        }
    }
}
KA.NPC.prototype.updateAwarenessBar = function(){
    this.awarenessBar.updateProgress(this.awareness / 100);
}
KA.NPC.prototype.updateInfluenceBar = function(){
    this.influenceBar.updateProgress(this.brandInfluence[0] / 100);
}
KA.NPC.prototype.zombify = function(brandId){
    this.zombie = true;
}