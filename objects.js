/*
let Entity = {
    pos_x: 0,
    pos_y: 0,
    size_x: 0,
    size_y: 0,
    extend: (extendProto)=>{
        var object = Object.create(this);
        for(let property in extendProto){
            if(this.hasOwnProperty(property) || typeof object[property] === 'undefined'){
                object[property] = extendProto[property];
            }
        }
        return object;
    }
};

 */
/*
let Player = Entity.extend({
    lifetime: 100,
    move_x: 0,
    move_y : 0,
    speed: 1,
    draw: (ctx)=>{
        spriteManager.drawSprite(ctx, "./images/Ground (78x58)", this.pos_x, this.pos_y);
    },
    update: ()=>{
        physicManager.update(this);
    },
    onTouchEntity: (obj)=>{},
    kill: ()=>{},
    fire: ()=>{}
});
*/

let Player = {
    type: 'player',
    pos_x: 0,
    pos_y: 0,
    size_x: 0,
    size_y: 0,
    lifetime: 100,
    move_x: 0,
    move_y : 0,
    speed: 2,
    draw: (ctx, x, y)=>{
        spriteManager.drawSprite(ctx, "Ground (16x16)", x, y);
    },
    drawAttack: (ctx, x, y)=>{
        spriteManager.drawSprite(ctx, "Attack (78x58)", x, y);
    },
    update: (obj)=>{
        physicManager.update(obj);
    },
    onTouchEntity: (obj)=>{
        console.log(gameManager.player.lifetime);
        if(obj.type === 'box'){
            if(gameManager.player.lifetime < 100){
                gameManager.player.lifetime = (gameManager.player.lifetime + 25)%101;
                gameManager.laterKill.push(obj);
            }
        }else if(obj.type === 'pig'){
            gameManager.player.lifetime = gameManager.player.lifetime - 10;
            if(eventsManager.action["fire"]){
                obj.lifetime -= 25;
                if(obj.lifetime === 0){
                    gameManager.laterKill.push(obj);
                }
            }
        }
    },
    kill: ()=>{},
    fire: ()=>{}
};

let Pig = {
    type: 'pig',
    lifetime: 100,
    move_x: 0,
    move_y: 0,
    speed: 1,
    moveFlag: -1,
    destination: 0,
    start: 0,
    regime: 'up',
    draw: (ctx, x, y)=>{
        spriteManager.drawSprite(ctx, "pig_stay", x, y);
    },
    update: (obj)=>{
        //console.log('update pigs');
        physicManager.updatePigs(obj);
    },
    onTouchEntity: (obj)=>{

    }
};

let Box = {
    type: 'box',
    draw: (ctx, x, y)=>{
        spriteManager.drawSprite(ctx, "bonus", x, y);
    }
};