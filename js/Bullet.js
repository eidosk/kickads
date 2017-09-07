var KA = KA || {};
KA.Bullet = function(game, brandId, sx, sy,fx,fy, radius){
    Phaser.Sprite.call(this, game, sx, sy, "bullet");
    game.add.existing(this);
    this.fx = fx;
    this.fy = fy;
    this.sx = sx;
    this.sy = sy;
    this.alpha = BULLET_ALPHA;
    this.radius = radius;
    var angle = game.math.angleBetweenY(sx, sy, this.fx, this.fy);
    this.vx = Math.sin(angle) * radius *.02;
    this.vy = Math.cos(angle) * radius *.02;
    this.brandId = brandId;
    this.tint = KA.getTintFromBrandId(brandId);
}
KA.Bullet.prototype = Object.create(Phaser.Sprite.prototype); 
KA.Bullet.prototype.constructor = KA.Bullet;

KA.Bullet.prototype.update = function(){
    this.x += this.vx;
    this.y += this.vy;
    var dist = Math.abs(Phaser.Math.distance(this.sx, this.sy, this.x, this.y));
    this.checkCollision();
    if(dist > this.radius){
        this.doDestroy();
    }
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
