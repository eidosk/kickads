var KA = KA || {};
KA.EnemyManager = function(tilemap, jsonInfo){
    this.tilemap = tilemap;
    this.info = jsonInfo;
    this.enemyNames = ["banner","billboard","square"];
    this.balance = TEMP_BALANCE; //temp, only one brand
    this.totAdTypes = this.info.tilesets.length;
    ////trace("There are " + this.totAdTypes + " types of ads");
    this.enemies = new Array(this.totAdTypes); //will be a 2d array
    this.replaceTiles();
    ////trace("tot enemies: " + this.countEnemies());
    this.showEnemies();
    //this.removeAllEnemiesExceptShown();
}

KA.EnemyManager.constructor = KA.EnemyManager;

/* Replaces Tiled Enemies with Enemy Spritesheet and removes tiles of enemies */
KA.EnemyManager.prototype.replaceTiles = function(){
    for(i = 0; i < this.totAdTypes; i++){ // types of ads loop
        var tSet = this.info.tilesets[i];
        var firstTileArr = this.getEnemyFirstTileArray(tSet.firstgid);
        var count = firstTileArr.length;
        ////trace("Ad " + i + " is called " + tSet.name + ", it has ID: " + tSet.firstgid + " and there are " + count + " ads of this type on screen");
        this.tilemap.addTilesetImage(tSet.name, tSet.name);
        this.enemies[i] = new Array(count);
        for(j = 0; j<count; j++){ // ads of each type loop
            var firstTile = firstTileArr[j];
            var tWidth = tSet.columns;
            var tHeight = tSet.tilecount/tSet.columns;
            var tiles = this.tilemap.copy(firstTile.x, firstTile.y, tWidth, tHeight); //get tiles*-
            this.enemies[i][j] = new KA.Enemy(KA.game, firstTile.x * TILE_WIDTH, firstTile.y * TILE_WIDTH, this.enemyNames[i]);
            this.removeTiles(tiles);
        }
    }
}
/* Finds how many ads are needed for each type depending on the brand balance. Inits and shows those number of ads, choosing randomly */
KA.EnemyManager.prototype.showEnemies = function(){
    //var banner = game.make.sprite(0,0,"banner");
    //var billboard = game.make.sprite(0,0,"billboard");
    //var square = game.make.sprite(0,0,"square");
    var healthArr = [10, 50, 9];  //banner, billboard, square
    var result = [0, 0, 0];
    var sum = 0;
    var counter = 2;
    while(sum <= this.balance){
        var currentIdx = counter % 3;
        sum += healthArr[currentIdx];
        if(sum <= this.balance){
            result[currentIdx]++;
        }
        counter++;
    }
    //result array now contains how many ads I need for each type
    for(i=0; i<3; i++){
        var arr = ArrayUtils.clone(this.enemies[i]);
        var count = result[i]; //how many ads
        for(j=0; j<count; j++){
            var randNum = Math.floor(Math.random() * arr.length);
            this.enemies[i][randNum].init(); //will be shown!
            ArrayUtils.removeItem(arr, randNum);
        }
    }
}

/*
KA.EnemyManager.prototype.removeAllEnemiesExceptShown = function(){
    for(i=0; i<this.totAdTypes; i++){
        var count = this.enemies[i].length;
        for(j=0; j<count; j++){
            var enemy = this.enemies[i][j];
            if(!enemy.shown)enemy.doDestroy();
        }
    }
}
*/

KA.EnemyManager.prototype.removeTiles = function(tiles){    
    for(var i=0; i<tiles.length; i++){
        var tile = tiles[i];
        this.tilemap.removeTile(tile.x, tile.y);
    }
}

KA.EnemyManager.prototype.getEnemies = function(){
    return this.enemies;
}

KA.EnemyManager.prototype.countEnemies = function(){
    var count = 0;
    for(i=0; i<this.enemies.length; i++){
        for(j=0; j<this.enemies[i].length; j++){
            count++;
        }
    }
    return count;
}

KA.EnemyManager.prototype.removeEnemyFromArr = function(enemy){
    for(i = 0; i<this.enemies.length; i++){
        for(j=0; j<this.enemies[i].length; j++){
            var tEnemy = this.enemies[i][j];
            if(enemy == tEnemy){
                this.enemies.splice(i, 1);
                break;
            }   
        }
    }
    ////trace("now tot enemies: " + this.countEnemies());
}

KA.EnemyManager.prototype.countTiles = function(){
    var count = 0;
    for(c=0; c<this.tilemap.width; c++){
        for(r=0; r<this.tilemap.height; r++){
            var tTile = this.tilemap.getTile(c, r);
            if(tTile!=null)count++;
        }
    }
    return count;
}

KA.EnemyManager.prototype.getEnemyFirstTileArray = function(id){
    ////trace("id: " + id);
    //EnemyManager
    tArray = [];
    var i = 0;
    while (this.tilemap.searchTileIndex(id, i)!=null){
        var t = this.tilemap.searchTileIndex(id,i);
        tArray.push(t);
        i++;
    }
    return tArray;
}