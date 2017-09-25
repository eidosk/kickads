var KA = KA || {};
KA.Emitter = function(game, x, y, health, name){
    Phaser.Sprite.call(this, game);
    game.add.existing(this);
    this.name = name;
    this.brandId = this.getBrandId(this.name);
    this.x = x;
    this.y = y;
    this.detectionType = "x";
    this.center = new Phaser.Circle(x, y, 4);
    /*this.emitTimer = game.time.create(false);
    this.timerLoop = this.emitTimer.loop(KA.Emitter.LOOP_TIME, this.emit, this);    
    this.emitTimer.start();*/
    
    this.emitTimer = game.time.create(false);
    this.emitTimer.loop(KA.Emitter.LOOP_TIME, this.emit, this);
    this.emitTimer.start();
    
    this.updateHealth(health);
}
KA.Emitter.constructor = KA.Emitter;
KA.Emitter.prototype = Object.create(Phaser.Sprite.prototype);

/* CONSTANTS */
KA.Emitter.RADIUS = 100;
KA.Emitter.LOOP_TIME = 4000;
KA.Emitter.DETECTION_TYPE = 1;  //0 is circle, 1 is x
KA.Emitter.EMIT_TYPE = 1; //0 is bullet, 1 is ray

/* FUNCTIONS */
KA.Emitter.isCircleDetectionType = function(){
    return KA.Emitter.DETECTION_TYPE==0;
}
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
    return 0; //temp for testing
}
KA.Emitter.prototype.updateHealth = function(health){
    this.health = health;
    if(KA.Emitter.isCircleDetectionType())this.updateCircleGfx();
}
KA.Emitter.prototype.updateCircleGfx = function(){
    if(this.graphics) this.graphics.destroy();
    this.graphics = this.game.add.graphics(this.x, this.y);
    this.graphics.lineStyle(1, 0xFFFF0B, HIT_AREA_ALPHA);
    this.graphics.beginFill(0xFFFF0B, HIT_AREA_ALPHA);
    this.graphics.drawCircle(0, 0, KA.Emitter.RADIUS);
}
KA.Emitter.prototype.emit = function(){
    if(IS_PLAYER_A_TARGET){
        var fx = KA.player.body.x + KA.player.body.width*.5; //player
        var fy = KA.player.body.y + KA.player.body.height*.5;
        this.checkTarget(KA.player);
    }
    var charArr = KA.NPCManager.characters; //npcs
    for(i=0; i<charArr.length; i++){
        var char = charArr[i];
        if(!char.isZombie())this.checkTarget(char);
    }
}
KA.Emitter.prototype.checkTarget = function(target){
    var x;
    var y;
    if(target == KA.player){
        x = KA.player.body.x + KA.player.body.width*.5; //player
        y = KA.player.body.y + KA.player.body.height*.5;
    }else{ //npc
        x = target.body.world.x + target.scale.x * 10;
        y = target.body.world.y;
    }
    if(KA.Emitter.isCircleDetectionType()){ //circle
        var dist = Phaser.Math.distance(this.x, this.y, x, y);
        if(dist <= KA.Emitter.RADIUS){
            this.shootTarget(target, x, y);
        }
    }else if(KA.Emitter.DETECTION_TYPE==1){ //x
        if(target.isFacingX(this.x) && Math.abs(x - this.x) < 100){
            this.shootTarget(target, x, y);
        }
    }
}
KA.Emitter.prototype.shootTarget = function(target, x,y){
    if(KA.Emitter.EMIT_TYPE==0)new KA.Bullet(KA.game, this.brandId, this.x, this.y, x, y, BULLET_SPEED);
    else if(KA.Emitter.EMIT_TYPE==1){
        this.shootRay(x,y);
        target.onCollision(0);
    }
}
KA.Emitter.prototype.shootRay = function(x,y){
    if(this.graphics) this.graphics.destroy();
    this.graphics = this.game.add.graphics(this.x, this.y);
    this.graphics.lineStyle(1, TINT_SODA, .5);
    this.graphics.lineTo(x - this.x, y - this.y);
    this.graphics.beginFill(TINT_SODA, .5);
    this.game.time.events.add(200, this.destroyGraphics, this);
}
KA.Emitter.prototype.destroyGraphics = function(){
    if(this.graphics) this.graphics.destroy();
}
KA.Emitter.prototype.doDestroy = function(){
    this.emitTimer.stop();
    this.emitTimer.destroy();
    if(this.graphics) this.graphics.destroy();
    this.destroy();
}