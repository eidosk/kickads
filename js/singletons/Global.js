 KA.global = {
        score : 0,
        sound : false,
        day : 0,
        balance : [0,0,0,0],
        brandInfluence : [], //arr for npcs
        awareness : [], //arr for npcs
        balance : 300,
        totValue : 765, //all ads:  765
        shopX : 0, //
        profit : 0,
        dialogues : null,
        initVars: function(){
            this.dialogues = KA.game.cache.getJSON('dialogues');
        }
}

