var KA = KA || {};

KA.EnemyManager = function(tMap, info){
    this.map = tMap;
    this.info = info;
    this.enemies = [];
    trace("There are " + this.info.tilesets.length + " types of ads");
    for(i = 0; i < this.info.tilesets.length; i++){ //types of ads loop
        var tSet = this.info.tilesets[i];
        var firstTileArr = this.getEnemyFirstTileArray(tSet.firstgid);
        var count = firstTileArr.length;
        trace("Ad " + i + " is called " + tSet.name + ", it has ID: " + tSet.firstgid + " and there are " + count + " ads of this type on screen");
        this.map.addTilesetImage(tSet.name, tSet.name);
        for(j = 0; j<count; j++){
            var firstTile = firstTileArr[j];
            var tWidth = tSet.columns;
            var tHeight = tSet.tilecount/tSet.columns;
            var tiles = this.map.copy(firstTile.x, firstTile.y, tWidth, tHeight); //get tiles
            var enemyInfo = {
                name:tSet.name, 
                width:tWidth, 
                height:tHeight,
                firstTile:firstTile
            }
            this.enemies.push(new KA.Enemy(this, enemyInfo, tiles));
            //copy(x, y, width, height, layer) → {array}
        }
    }
    trace("tot enemies: " + this.enemies.length);
}
KA.EnemyManager.constructor = KA.EnemyManager;

KA.EnemyManager.prototype.getEnemies = function(){
    return this.enemies;
}

KA.EnemyManager.prototype.removeEnemy = function(enemy){
    for(i = 0; i<this.enemies.length; i++){
        var tEnemy = this.enemies[i];
        if(enemy == tEnemy){
            this.enemies.splice(i, 1);
            break;
        }
    }
    trace("now tot enemies: " + this.enemies.length);
}

KA.EnemyManager.prototype.countTiles = function(){
    var count = 0;
    for(c=0; c<this.map.width; c++){
        for(r=0; r<this.map.height; r++){
            var tTile = this.map.getTile(c, r);
            if(tTile!=null)count++;
        }
    }
    return count;
}

KA.EnemyManager.prototype.getEnemyTiles = function(){
    
}

KA.EnemyManager.prototype.getEnemyFirstTileArray = function(id){
    trace("id: " + id);
    //EnemyManager
    tArray = [];
    var i = 0;
    while (mapAds.searchTileIndex(id, i)!=null){
        var t = mapAds.searchTileIndex(id,i);
        tArray.push(t);
        i++;
    }
    return tArray;
}

KA.EnemyManager.prototype.test = function(){
    for(i = 0; i<this.enemies.length; i++){
        var tEnemy = this.enemies[i];
        this.removeEnemy(tEnemy);
    }
}

/*
EnemyManager.countTiles() = function(map){
    var count = 0;
    for(c=0; c<map.width; c++){
        for(r=0; r<map.height; r++){
            var tTile = map.getTile(c, r);
            if(tTile!=null)count++;
        }
    }
    return count;
}
*/