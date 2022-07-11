
let physicManager = {
    update: (obj)=>{
        if(obj.move_x === 0 && obj.move_y === 0){
            return "stop";
        }
        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        let ts = mapManager.getTilesetIdx(newX + obj.size_x/2, newY + obj.size_y/2);
        let e = physicManager.entityAtXY(obj, newX, newY);
        if(e !== null && obj.onTouchEntity){
            console.log('touching');
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

    updatePigs: (obj)=>{
        console.log(obj);
        if(obj.moveFlag === -1) {
            if (obj.destination - obj.pos_y >= 0 && obj.regime === 'up') {
                obj.moveFlag *= -1;
                obj.regime = 'down';
            }
        }else{
            if (obj.pos_y - obj.start <= 0  && obj.regime === 'down') {
                obj.moveFlag *= -1;
                obj.regime = 'up';
            }
        }
        let newY = obj.pos_y + Math.floor(obj.moveFlag * obj.speed);
        let ts = mapManager.getTilesetIdx(obj.pos_x + obj.size_x / 2, newY + obj.size_y / 2);
        let e = physicManager.entityAtXY(obj, obj.pos_x, newY);
        if (e !== null && obj.onTouchEntity) {
            obj.onTouchEntity(e);
        }
        if (ts !== 0 && obj.onTouchMap) {
            obj.onTouchMap(ts);
        }
        if (ts === 0 && e === null) {
            obj.pos_y = newY;
        } else {
            return "break";
        }
        return "move";
    },

    entityAtXY: (obj, x, y)=>{
        for(let i = 0; i < gameManager.entities.length; i++){
            let e = gameManager.entities[i];
            if(e.name !== obj.name) {
                if( (x + obj.size_x/2 < e.pos_x || x + obj.size_x/2 > e.pos_x + e.size_x*2) ||
                    (y - obj.size_y/2 > e.pos_y || y - obj.size_y/2 < e.pos_y - e.size_y*2) ){
                    continue
                }
                return e;
            }
        }
        return null;
    }
}