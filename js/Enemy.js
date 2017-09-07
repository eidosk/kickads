var KA = KA || {};

//Object with info about the tiles
KA.Enemy = function(tManager, tInfo, tTiles){
    this.manager = tManager;
    this.info = tInfo;
    this.name = tInfo.name;
    this.tiles = tTiles.slice(1); //cut out first element
    var fx = (this.info.firstTile.x + this.info.width*.5) * TILE_WIDTH;
    var fy = (this.info.firstTile.y + this.info.height*.5) * TILE_WIDTH;
    this.emitter = new KA.Emitter(KA.game, fx, fy, tTiles.length, this.name);
    Signals.removeTile.add(this.onRemoveTile, this);
    /*
    timer = game.time.create(false);
    timer.loop(2000, updateCounter, this);
    timer.start();
    */
}

/*
function updateCounter() {
    //update code
}
*/
KA.Enemy.constructor = KA.Enemy;
KA.Enemy.prototype.onRemoveTile = function(tile){
    var match = -1;
    for(i=0; i < this.tiles.length; i++){
        var tTile = this.tiles[i];
        if (tTile == null) break;
        if(this.doTilesMatch(tile, tTile)){
            match = i;
            break;
        }
    }
    if(match>=0){
        this.tiles.splice(match,1);
        var health = this.getHealth();
        this.emitter.updateHealth(health);
        if(health == 0){
            this.destroy();
        }
    }
}

KA.Enemy.prototype.getHealth = function(){
    return this.tiles.length;
}


KA.Enemy.prototype.doTilesMatch = function(tile1, tile2){
    return tile1.x == tile2.x && tile1.y == tile2.y && tile1.index == tile2.index;
}

KA.Enemy.prototype.destroy = function(){
    Signals.removeTile.remove(this.onRemoveTile, this);
    this.emitter.remove();
    this.manager.removeEnemy(this);
}

