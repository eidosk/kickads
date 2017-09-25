var KA = KA || {};
KA.NPCManager = {
    characters:[]
}
KA.NPCManager.addNPCs = function(game){
    //trace("ADD NPCS!");
    //this.characters.push(new KA.NPC(game, "girl"));
    //this.characters.push(new KA.NPC(game, "old_man"));
    //this.characters.push(new KA.NPC(game, "cool_guy"));
    var char1 = new KA.NPC(game, "business_man", TEMP_CHAR_1_START_X, WORK_X, GO_TO_WORK);
    this.characters.push(char1);
    
    var char2 = new KA.NPC(game, "business_woman", TEMP_CHAR_2_START_X, WORK_X, GO_TO_WORK);
    this.characters.push(char2);
    
    
    //this.characters.push(new KA.NPC(game, "business_woman_zombie"));
}

KA.NPCManager.remove = function(char){
    for(i=0; i<this.characters.length; i++){
        var tChar = this.characters[i];
        if(tChar == char){
            this.characters.splice(i, 1);
        }
    }
}


KA.NPCManager.checkCollision = function(x, y, brandId){
    var match = false;
    for(i=0; i<this.characters.length; i++){
        var char = this.characters[i];
        if(KA.Collision.hitTestPoint(char.body,x,y, true)){
            match = true;
            char.onCollision(brandId);
        }
        if(match)break;
    }
    return match;
}

KA.NPCManager.goHomeAfterWork = function(){
    var char1 = new KA.NPC(game, "business_man", WORK_X,TEMP_CHAR_1_START_X, GO_HOME);
    var char2 = new KA.NPC(game, "business_woman", WORK_X, TEMP_CHAR_2_START_X, GO_HOME)
    this.characters.push(char1);
    this.characters.push(char2);
}

KA.NPCManager.isEverybodyWorking = function(){
    var result = true;
    for(i=0; i<this.characters.length; i++){
        var char = this.characters[i];
        if(!char.isWorking()){
            result = false;
            break;
        }
    }
    return result;
}

KA.NPCManager.isEverybodyZombie = function(){
    var result = true;
    for(i=0; i<this.characters.length; i++){
        var char = this.characters[i];
        if(!char.isZombie()){
            result = false;
            break;
        }
    }
    return result;
}

KA.NPCManager.isPlayerNear = function(){
    var result = false;
    for(i=0; i<this.characters.length; i++){
        //trace("loop");
        var char = this.characters[i];
        if(char.isNearPlayer(KA.player)){
            result = true;
            break;
        } 
    }
    return result;
}





