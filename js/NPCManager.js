var KA = KA || {};
KA.NPCManager = {}
KA.NPCManager.init = function(game, json){
    this.characters = [];
    var house1x = json.layers[1].objects[0].x;
    var officex = json.layers[1].objects[1].x;
    KA.game.global.shopX = json.layers[1].objects[2].x;
    var house2x = json.layers[1].objects[3].x;
    var char1 = new KA.NPC(game, "business_man", house1x, officex, GO_TO_WORK);
    this.characters.push(char1);
    var char2 = new KA.NPC(game, "business_woman", house2x, officex, GO_TO_WORK);
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
        if(char.visible){
            if(KA.Collision.hitTestPoint(char.body,x,y, true)){
                match = true;
                char.onCollision(brandId);
                break;
            }
        }
    }
    return match;
}

KA.NPCManager.everybodyGoHomeAfterWork = function(){
    for(i=0; i<this.characters.length; i++){
        var char = this.characters[i];
        char.goHomeAfterWork();
    }
    
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

KA.NPCManager.isEverybodyHome = function(){
    var result = true;
    for(i=0; i<this.characters.length; i++){
        var char = this.characters[i];
        if(!char.isAtHome()){
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

KA.NPCManager.isPlayerNearAnybody = function(){
    var result = false;
    for(i=0; i<this.characters.length; i++){
        ////trace("loop");
        var char = this.characters[i];
        if(char.isNearPlayer(KA.player)){
            result = true;
            break;
        } 
    }
    return result;
}