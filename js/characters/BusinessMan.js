var KA = KA || {};
/*CONSTRUCTOR*/
KA.BusinessMan = function(game, x, fx, mission){
    KA.NPC.call(this, game, "businessMan", x, fx, mission);
    //var char1 = new KA.NPC(game, "business_man", house1x, officex, GO_TO_WORK);
}

KA.BusinessMan.prototype = Object.create(KA.NPC.prototype); 
KA.BusinessMan.prototype.constructor = KA.BusinessMan;
//FUNCTIONS
