var KA = KA || {};
KA.Collision = {
    hitTestPoint : function(sprite, x, y, absolute = false){
        var sx, sy;
        if(absolute){
            sx = sprite.world.x;
            sy = sprite.world.y;
        }else{
            sx = sprite.x;
            sy = sprite.y;
        }
        return (x>=sx && x<=sx + sprite.width && y>=sy && y<=sy + sprite.height);
    }
}