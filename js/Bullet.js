var KA = KA || {};
KA.Bullet = function(game, brandId, sx, sy, fx, fy, speed){
    Phaser.Sprite.call(this, game, sx, sy, "bullet");
    game.add.existing(this);
    this.fx = fx;
    this.fy = fy;
    this.sx = sx;
    this.sy = sy;
    this.alpha = BULLET_ALPHA;
    this.speed = speed;
    var angle = game.math.angleBetweenY(sx, sy, this.fx, this.fy);
    this.vx = Math.sin(angle) * this.speed *.02;
    this.vy = Math.cos(angle) * this.speed *.02;
    this.brandId = brandId;
    this.tint = KA.getTintFromBrandId(brandId);
}
KA.Bullet.prototype = Object.create(Phaser.Sprite.prototype); 
KA.Bullet.prototype.constructor = KA.Bullet;

KA.Bullet.prototype.update = function(){
    this.x += this.vx;
    this.y += this.vy;
    this.checkCollision();
    if(this.hasEndedTrajectory()){
        this.doDestroy();
    }
}

KA.Bullet.prototype.hasEndedTrajectory = function(){
    if(KA.Emitter.DETECTION_TYPE == 0){//circle
        var dist = Math.abs(Phaser.Math.distance(this.sx, this.sy, this.x, this.y));
        if(dist > KA.Emitter.RADIUS){
            return true;
        }else{
            return false;
        }
    }else if(KA.Emitter.DETECTION_TYPE == 1){ //x
        if(this.y > WORLD_HEIGHT) return true;
        else return false;
    }
    return true;
}

KA.Bullet.prototype.checkCollision = function(){
    //PLAYER
    if(KA.Collision.hitTestPoint(KA.player.body, this.x, this.y)){ 
        //KA.player.tempTint(this.tint);
        this.doDestroy();
    }
    //NPCs
    if(KA.NPCManager.checkCollision(this.x, this.y, this.brandId)){
        this.doDestroy();
    }
}

KA.Bullet.prototype.doDestroy = function(){
    this.destroy();
}
