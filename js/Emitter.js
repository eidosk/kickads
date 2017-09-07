var KA = KA || {};
KA.Emitter = function(game, x, y, health, name){
    Phaser.Sprite.call(this, game);
    game.add.existing(this);
    this.name = name;
    this.brandId = this.getBrandId(this.name);
    this.x = x;
    this.y = y;
    this.diameter = 200;
    this.center = new Phaser.Circle(x, y, 4);
    this.emitTimer = game.time.create(false);
    this.emitTimer.loop(6000, this.emit, this);
    this.emitTimer.start();
    this.updateHealth(health);
}
KA.Emitter.constructor = KA.Emitter;
KA.Emitter.prototype = Object.create(Phaser.Sprite.prototype); 
KA.Emitter.prototype.update = function(){
    //this.updateCircle();
}

KA.Emitter.prototype.getBrandId = function(name){
    var brandId = -1;
    /*
    switch(name){
           case "street_cola":
           case "billboard_cola":
           case "banner_cola_vert_mid":
           case "banner_cola_line":
                brandId = 0;
           break;
           case "billboard_burger":
           case "banner_green_tall":
                brandId = 1;
           break;
           case "bill_phone_big":
           case "bill_phone_mid":
                brandId = 2;
           break;
    }
    */
    
    //return brandId;
    
    
    return 0; //temp for test
}

KA.Emitter.prototype.updateHealth = function(health){
    this.health = health;
    //this.diameter = 100;
    //this.updateCircleGfx();
}
KA.Emitter.prototype.updateCircle = function(){
    this.diameter++;
    this.updateCircleGfx();
}
KA.Emitter.prototype.initDiameter = function(){
    this.diameter = 4;
}
KA.Emitter.prototype.updateCircleGfx = function(){
    if(this.graphics) this.graphics.destroy();
    this.graphics = this.game.add.graphics(this.x, this.y);
    this.graphics.lineStyle(1, 0xFFFF0B, HIT_AREA_ALPHA);
    this.graphics.beginFill(0xFFFF0B, HIT_AREA_ALPHA);
    this.graphics.drawCircle(0, 0, this.diameter);
}
//function emit(){
KA.Emitter.prototype.emit = function(){
    var fx = KA.player.body.x + KA.player.body.width*.5; //player
    var fy = KA.player.body.y + KA.player.body.height*.5;
    this.checkTarget(fx, fy);
    var charArr = KA.NPCManager.characters; //npcs
    for(i=0; i<charArr.length; i++){
        var char = charArr[i];
        //trace("char.isZombie(): " + char.isZombie());
        if(!char.isZombie())this.checkTarget(char.body.world.x + char.scale.x * 10, char.body.world.y);
    }
}

KA.Emitter.prototype.checkTarget = function(x,y){
    var dist = Phaser.Math.distance(this.x, this.y, x, y);
    var radius = this.diameter * .5;
    
    if(dist <= radius){
        new KA.Bullet(KA.game, this.brandId, this.x, this.y, x, y, radius);
    }
}

KA.Emitter.prototype.remove = function(){
    this.emitTimer.destroy();
    if(this.graphics) this.graphics.destroy();
    this.destroy();
}