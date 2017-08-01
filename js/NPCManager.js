var KA = KA || {};
KA.NPCManager = {
    characters:[]
}
KA.NPCManager.addNPCs = function(game){
    trace("ADD NPCS!");
    this.characters.push(new KA.NPC(game, "girl"));
    this.characters.push(new KA.NPC(game, "old_man"));
    this.characters.push(new KA.NPC(game, "cool_guy"));
    this.characters.push(new KA.NPC(game, "business_man"));
    this.characters.push(new KA.NPC(game, "business_woman"));
    //this.characters.push(new KA.NPC(game, "business_woman_zombie"));
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

