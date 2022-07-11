
let factory = {}
let Entities = []
let fireNum = 0;
let player = 0;
let laterKill = []
let ended = 0;
let isGo = 1;

const player_name_inner = document.getElementById('player_name');
const scores_inner = document.getElementById('scores');




function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function initPlayer(obj) {
    active_player = obj
}

function kill(obj) {
    laterKill.push(obj);

}
function draw(ctx) {
    active_player.draw(ctx)
}

var Entity = {
    pos_x: 0, pos_y: 0,
    size_x: 0, size_y: 0,
    path_image: "",
    extend: function (extendProto) {
        var object = Object.create(this);
        for (var property in extendProto) {
            if (this.hasOwnProperty(property) || typeof object[property] === 'undefined') {
                object[property] = extendProto[property];
            }
        }
        return object;
    },
    draw_self(ctx) {
        var local_x = this.pos_x;
        var local_y = this.pos_y;
        var main_image = new Image();
        main_image.onload = function () {
            ctx.drawImage(main_image, local_x * 16 - 15, local_y * 16 - 12, 40, 40)
        }
        main_image.src = this.path_image;
    },
    kill() {
        //console.log(this)
        laterKill.push(this)
    }
};
var active_bonus = Entity.extend( {
    pos_x: 0, pos_y: 0,
    move_x: 0, move_y: 0,
    speed: 1,
    path_image: './images/hero.png',
    name_direction: "bonus",
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, this.name_direction, this.pos_x * 16 - 15, this.pos_y * 16 - 15);
    },
    update: function () {
        physicManager.update(this)
    },
    function(obj) {},
    fire: function () {},
    onTouchEntity: function (obj) {
        if(obj.name === 'Player') {
            active_player.lifetime++;
            alert('Вы подобрали бонус с жизнями, теперь у вас: '+active_player.lifetime+' жизней')
            eventsManager.action["up"] = false
            eventsManager.action["left"] = false
            eventsManager.action["right"] = false
            eventsManager.action["down"] = false
            eventsManager.action["fire"] = false
            scores_inner.innerHTML = 'Жизни: ' + active_player.lifetime;
            //console.log(this)
            this.kill()
        }
    }

})


var active_fireball = Entity.extend( {
    pos_x: 0, pos_y: 0,
    move_x: 0, move_y: 0,
    speed: 1,
    path_image: './images/hero.png',
    name_direction: "fireball",
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, this.name_direction, this.pos_x * 16 - 15, this.pos_y * 16 - 15);
    },
    update: function () {
        physicManager.update(this)
    },
    function(obj) {},
    fire: function () {},
    onTouchEntity: function (obj) {
        if(obj.name === 'Enemy') {
            //console.log(this)
            this.kill()
        }
    }

})
var active_enemy = Entity.extend({
    pos_x: 0, pos_y: 0,
    lifetime: 100,
    move_x: 0, move_y: 0,
    speed: 1,
    path_image: './images/hero.png',
    name_direction: "enemy_right",
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, this.name_direction, this.pos_x * 16 - 15, this.pos_y * 16 - 15);
    },
    update: function () {
        physicManager.update(this)
    },
    function(obj) {},
    fire: function () {},
    onTouchEntity: function (obj) {
        if(obj.name === 'Fireball') {
            //console.log(this)
            this.kill()
        }
    }

});
var active_player = Entity.extend({
    pos_x: 0, pos_y: 0,
    lifetime: 2,
    move_x: 0, move_y: 0,
    speed: 1,
    path_image: './images/hero.png',
    name_direction: "hero_right",
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, this.name_direction, this.pos_x * 16 - 15, this.pos_y * 16 - 15);
        },
    update: function () {
        physicManager.update(this)
    },
    function(obj) {},
    fire: function () {
        soundManager.play('../audio/click_combo.wav', {looping: false, volume: 100})
        var r = Object.create(active_fireball);
        r.name = "Fireball";
        r.pos_x = active_player.pos_x;
        r.pos_y = active_player.pos_y;
        if(this.name_direction === "hero_right")
            setInterval(()=> moveObject(r,1,0), 50)
        if(this.name_direction === "hero_left")
            setInterval(()=> moveObject(r,-1,0), 50)
        if(this.name_direction === "hero_up")
            setInterval(()=> moveObject(r,0,-1), 50)
        if(this.name_direction === "hero_down")
            setInterval(()=> moveObject(r,-1,1), 50)
        Entities.push(r);

    },
    onTouchEntity: function (obj){
        if((obj.name === 'Enemy')&&(this.lifetime===1)) {
            //console.log('collized');
            cur_scores = active_player.lifetime
            window.location.href = '/'
            alert('Вас убили!')
            if(ended == 0) {
                writeRec({name: player_name, scores: cur_scores});
                ended = 1;
            }
            scores_inner.innerHTML = 'Жизни: ' + active_player.lifetime;
        }
        if((obj.name === 'Enemy')&&(this.lifetime!==1)) {
            this.lifetime--
            do {
                this.pos_x = getRandomInt(mapManager.xCount)
                this.pos_y = getRandomInt(mapManager.yCount-3)
            } while(!mapManager.Cell_class[this.pos_x][this.pos_y].isFree())
            alert('Вас ранили, у вас осталось '+this.lifetime+' жизни. Вы перемещены в случайную точку карты')
            eventsManager.action["up"] = false
            eventsManager.action["left"] = false
            eventsManager.action["right"] = false
            eventsManager.action["down"] = false
            eventsManager.action["fire"] = false
            scores_inner.innerHTML = 'Жизни: ' + active_player.lifetime;
        }
    }
});



function update() { // oбhobлehиe иh$opmaции
    if(this.active_player === null)
        return;
    this.active_player.move_x = 0;
    this.active_player.move_y = 0;
    mapManager.draw(ctx);
    if (eventsManager.action["up"]) {
        active_player.name_direction = "hero_up"
        moveObjectNotDraw(this.active_player, 0,-1)
    }
    if (eventsManager.action["down"]) {
        active_player.name_direction = "hero_down"
        moveObjectNotDraw(this.active_player, 0,1)
    }
    if (eventsManager.action["left"]) {
        active_player.name_direction = "hero_left"
        moveObjectNotDraw(this.active_player, -1,0)
    }
    if (eventsManager.action["right"]) {
        active_player.name_direction = "hero_right"
        moveObjectNotDraw(this.active_player, 1,0)
    }
    ObjectDraw(this.active_player)
    if (eventsManager.action["fire"]) this.active_player.fire();
    Entities.forEach(function (e){
        e.update()
        e.draw(ctx)
    })


    for(var i = 0; i < laterKill.length; i++) {
        var idx = Entities.indexOf(laterKill[i]);
        if(idx > -1)
            Entities.splice(idx, 1);
       //    console.log(Entities)
    }
    if(laterKill.length > 0)
        laterKill.length = 0;
        //*//*
    //mapManager.centerAt(this.active_player.pos_x, this.active_player.pos_y);
    //draw(ctx);/**/
}

function updateAi() {
    var numbEntities = 0;
    Entities.forEach(function (e) {
        if((e.name==='Enemy')/*&&(isGo === 1)*/) {
            numbEntities++;
            if(active_player.pos_x<e.pos_x)
            {
                e.name_direction = "enemy_left"
                //mapManager.Cell_class[e.pos_x][e.pos_y].SetFree();
                moveObjectNotDraw(e, -1, 0)
                //mapManager.Cell_class[e.pos_x][e.pos_y].SetBlock();
            }
            if(active_player.pos_x>e.pos_x)
            {
                e.name_direction = "enemy_right"
                moveObjectNotDraw(e, 1, 0)
            }
            if(active_player.pos_y>e.pos_y)
            {
                e.name_direction = "enemy_down"
                moveObjectNotDraw(e, 0, 1)
            }
            if(active_player.pos_y<e.pos_y)
            {
                e.name_direction = "enemy_up"
                moveObjectNotDraw(e, 0, -1)
            }
            ObjectDraw(e)
        }
    })
    if(numbEntities === 0) {
        toWin();
    }
}
function toWin() {
    if(level === 0) {
        window.location.href='/level2'
        cur_scores = active_player.lifetime
        alert('Вы победили всех монстров, вы победили. Переход на следующий уровень.')
    }
    if(level === 1) {
        window.location.href='/'
        cur_scores = active_player.lifetime
        writeRec({name: player_name, scores: cur_scores});
        alert('Вы победили всех монстров, игра окончена')
    }
}
function play() {
    setInterval(() => updateAi(), 450);
    setInterval(() => update(), 100);
}
factory['Player'] = active_player; // иhициaли3aция $aбpики
factory['Enemy'] = active_enemy;
factory['Bonus'] = active_bonus;
var canvas = document.getElementById("canvasId")
var ctx = canvas.getContext('2d')
mapManager.loadMap(level_path);
mapManager.parseEntities();
mapManager.draw(ctx);
spriteManager.loadAtlas("./atlas/atlas.json", "./atlas/atlas.png");
setTimeout(() => active_player.draw_self(ctx), 300);
eventsManager.setup(canvas);
play()
let player_name = localStorage["tetris.username"];
let cur_scores = 0;
player_name_inner.innerHTML = 'Имя игрока: ' + player_name;
scores_inner.innerHTML = 'Жизни: ' + active_player.lifetime;
let readed = readRec();
if(readed!=[]) {
    for(i=0;i<readed.length;i++) {
        if(readed[i].name === player_name) {
            active_player.lifetime = readed[i].scores;
            cur_scores = readed[i].scores
        }
    }
}


