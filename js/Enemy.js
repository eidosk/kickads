var KA = KA || {};
/* CONSTRUCTOR */
KA.Enemy = function(game, x, y, name){
    Phaser.Sprite.call(this, game, x, y, name);
    this.x = x;
    this.y = y;
    this.name = name;
    this.value = (this.width / TILE_WIDTH) * (this.height/TILE_WIDTH);
    trace("this.value: " + this.value);
}
KA.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
KA.Enemy.prototype.constructor = KA.Enemy;
/* CONSTANTS */
KA.Enemy.KICK_DAMAGE = 3.5;
/* FUNCTIONS */
KA.Enemy.prototype.init = function(){
    //this.shown = true;
    game.add.existing(this);
    this.frame = 0;
    //this.shown = false;
    this.totFrames = this.animations.frameTotal / 4;
    this.health = (this.width / TILE_WIDTH) * (this.height / TILE_WIDTH);
    this.destruction = 0;
    this.destructionStep = this.health / this.totFrames;
    this.particleEmitter = null;
    var fx = this.x + this.width * .5;
    var fy = this.y + this.height * .5;
    this.emitter = new KA.Emitter(game, fx, fy, 100, this.name);
    Signals.kick.add(this.onKick, this);
}

KA.Enemy.prototype.update = function(){
    
}

KA.Enemy.prototype.onKick = function(){
    var cx = KA.player.x + 11 * KA.player.scale.x;
    var cy = KA.player.y + 13;
    //KA.game.add.sprite(cx, cy, "pixel"); //DEBUG
    if(KA.Collision.hitTestPoint(this, cx, cy)){
        this.emitParticles(cx, cy);
        this.destruction += KA.Enemy.KICK_DAMAGE;
        var frame = Math.floor(this.destruction / this.destructionStep);    
        if(this.frame < this.totFrames-1){
            this.frame = frame;
        }else{
            var tween = this.game.add.tween(this).to( { alpha: 0.1, y: this.y + 12 }, 300, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.doDestroy, this);
        }
    }
}

KA.Enemy.prototype.emitParticles = function(cx, cy){
    trace("EMIT PARTICLES: " + this.game + ", name: " + this.id);
    //if(this.particleEmitter!=null)this.destroyParticleEmitter();
    var particleEmitter = this.game.add.emitter(cx, cy, 10);
    particleEmitter.alpha = .75;
    var time = 500;
    particleEmitter.makeParticles(['particle_01', 'particle_02', 'particle_03']);
    //particleEmitter.gravity = 5;
    particleEmitter.start(true, 1000, null, 10);
    this.game.time.events.add(500, this.destroyParticleEmitter, this, particleEmitter);
}

KA.Enemy.prototype.destroyParticleEmitter = function(particleEmitter){
    particleEmitter.destroy();
}

KA.Enemy.prototype.doDestroy = function(){
    this.removeKickSignal();
    Signals.enemyDestroyed.dispatch(this.value);
    this.emitter.doDestroy();
    this.destroy();
}

KA.Enemy.prototype.removeKickSignal = function () {
    trace("AAA");
    Signals.kick.remove(this.onKick, this);
};