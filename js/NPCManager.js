var KA = KA || {};
KA.NPCManager = {
    addBars: function(){
        for(i=0; i<this.characters.length; i++){
            this.characters[i].addBars();
        }
    },//    Adds awareness and influence bars
    checkCollision: function(x, y, brandId){
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
    },
    everybodyGoHomeAfterWork: function(){
        for(i=0; i<this.characters.length; i++){
            var char = this.characters[i];
            char.goHomeAfterWork();
        }
    },
    getGlobalVars: function(){
        for(i=0; i<this.characters.length; i++){
            var char = this.characters[i];
            char.brandInfluence =  KA.global.brandInfluence[i];
            char.awareness =  KA.global.awareness[i];
        }
    },//    Retrieves Global vars at the beginning of the day 
    halveBrandInfluence: function(){
         for(i=0; i<this.characters.length; i++){
             var char = this.characters[i];
             for(j=0;j<char.brandInfluence.length;j++){
                 char.brandInfluence[j] = char.brandInfluence[j] *.5;
             }
        }
    },
    initChars: function(){
        this.characters = [];
    },
    init: function(game, json){
        var house1x = json.layers[1].objects[0].x;
        var officex = json.layers[1].objects[1].x;
        KA.global.shopX = json.layers[1].objects[2].x;
        var house2x = json.layers[1].objects[3].x;
        var char1 = new KA.NPC(game, "business_man", house1x, officex, GO_TO_WORK);
        this.characters.push(char1);
        var char2 = new KA.NPC(game, "business_woman", house2x, officex, GO_TO_WORK);
        this.characters.push(char2);
        this.initGlobalVars();
        this.getGlobalVars();
        this.addBars();//temp
    },
    initGlobalVars: function(){
        for(i=0; i<this.characters.length; i++){
            var char = this.characters[i];
            if(typeof(KA.global.brandInfluence[i])==='undefined'){
                KA.global.brandInfluence[i] = [0,0,0,0];
            }
            if(typeof(KA.global.awareness[i])==='undefined'){
                KA.global.awareness[i] = 0;
            }
        }
    },
    isEverybodyWorking: function(){
        var result = true;
        for(i=0; i<this.characters.length; i++){
            var char = this.characters[i];
            if(!char.isWorking()){
                result = false;
                break;
            }
        }
        return result;
    },
    isEverybodyHome: function(){
        var result = true;
        for(i=0; i<this.characters.length; i++){
            var char = this.characters[i];
            if(!char.isAtHome()){
                result = false;
                break;
            }
        }
        return result;
    },
    isEverybodyZombie: function(){
        var result = true;
        for(i=0; i<this.characters.length; i++){
            var char = this.characters[i];
            if(!char.isZombie()){
                result = false;
                break;
            }
        }
        return result;
    },
    isPlayerNearAnybody: function(){
        var result = false;
        for(i=0; i<this.characters.length; i++){
            var char = this.characters[i];
            if(char.isNearPlayer(KA.player) && char.visible){
                result = true;
                break;
            } 
        }
        return result;
    },
    remove: function(char){
        for(i=0; i<this.characters.length; i++){
            var tChar = this.characters[i];
            if(tChar == char){
                this.characters.splice(i, 1);
            }
        }
    },
    setGlobalVars: function(){
        for(i=0; i<this.characters.length; i++){
            var char = this.characters[i];
            KA.global.brandInfluence[i] = char.brandInfluence;
            KA.global.awareness[i] = char.awareness;
        }
    }//Stores Global vars at the end of the day
}