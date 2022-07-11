


function moveObject(object, value_x, value_y) {
    if((object.pos_y+value_y<mapManager.yCount-4)&&(object.pos_y+value_y>=0)) {
        if((object.pos_x+value_x<mapManager.xCount)&&(object.pos_x+value_x>=0)){
            if(mapManager.Cell_class[object.pos_x+value_x][object.pos_y].isFree()){
                if(mapManager.Cell_class[object.pos_x][object.pos_y+value_y].isFree()) {
                    object.pos_y+=value_y;
                    object.pos_x+=value_x;
                    object.draw(ctx);
                    mapManager.to_generate_blocks()
                } else if(object.name === 'Fireball') object.kill();
            } else if(object.name === 'Fireball') object.kill();
        } else if(object.name === 'Fireball') object.kill();
    } else if(object.name === 'Fireball') object.kill();
}
function moveObjectNotDraw(object, value_x, value_y) {
    if((object.pos_y+value_y<mapManager.yCount-1)&&(object.pos_y+value_y>=0)) {
        if((object.pos_x+value_x<mapManager.xCount)&&(object.pos_x+value_x>=0)){
            if(mapManager.Cell_class[object.pos_x+value_x][object.pos_y].isFree()){
                if(mapManager.Cell_class[object.pos_x][object.pos_y+value_y].isFree()) {
                    object.pos_y+=value_y;
                    object.pos_x+=value_x;
                    mapManager.to_generate_blocks()
                } else {
                    if(object.name === 'Fireball') object.kill();
                }
            } else {
                if(object.name === 'Fireball') object.kill();
            }
        } else {
            if(object.name === 'Fireball') object.kill();
        }
    } else {
        if(object.name === 'Fireball') object.kill();
        if(object.name === 'Player') {
            if(object.pos_y+value_y>=mapManager.yCount-1)
                object.pos_y = 0;
        }
    }
}

function ObjectDraw(object) {
    object.draw(ctx);
}
let physicManager = {
    update: (obj)=>{
        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        let ts = mapManager.getTilesetIdx(newX + obj.size_x/2, newY + obj.size_y/2);
        let e = physicManager.entityAtXY(obj, newX, newY);
        if(e !== null && obj.onTouchEntity){
            console.log(obj.name+' touching '+e.name +' x: '+ e.pos_x +' y:'+ e.pos_y);
            obj.onTouchEntity(e);
        }
        if(ts !== 0 && obj.onTouchMap){
            obj.onTouchMap(ts);
        }
        if(ts === 0 && e === null){
            obj.pos_x = newX;
            obj.pos_y = newY;
        }else{
            return "break";
        }
        return "move";
    },

    entityAtXY: (obj, x, y)=>{
        for(let i = 0; i < Entities.length; i++){
            let e = Entities[i];
            if(e.name !== obj.name) {
                if( (x + 1 < e.pos_x || x + 1 > e.pos_x + 1) ||
                    (y - 1 > e.pos_y || y - 1 < e.pos_y - 1) ){
                    continue
                }
                return e;
            }
        }
        return null;
    }
}