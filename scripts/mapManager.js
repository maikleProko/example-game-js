class CellClass {
    reserved = false;
    constructor() {
        this.reserved = false;
    }
    isFree() {
        if(this.reserved===false)
            return true;
    }
    setBlock(){
        this.reserved = true;
    }
    setFree(){
        this.reserved = false;
    }
}

var mapManager = {
    mapData: null,
    tLayer: null,
    bLayer: null,
    xCount: 0,
    yCount: 0,
    tSize: {x: 64, y: 64},
    mapSize: {x: 64, y: 64},
    tilesets: [],
    imgLoadCount: 0,
    imgLoaded: false,
    jsonLoaded: false,
    view: {x: 0, y: 0, w: 400, h: 400},
    moving_map: false,
    Cell_class: [[]],


    loadMap(path) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                mapManager.parseMap(request.responseText)
            }
        };
        request.open("GET", path, true);
        request.send()

    },

    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;

        if (this.mapSize.x > this.view.w || this.mapSize.y > this.view.h) this.moving_map = true;

        for (let i = 0; i < this.mapData.tilesets.length; i++) {
            var img = new Image();
            img.onload = function () {
                mapManager.imgLoadCount++;
                if (mapManager.imgLoadCount === mapManager.mapData.tilesets.length) {
                    mapManager.imgLoaded = true;
                }
            };
            img.src = this.mapData.tilesets[i].image;
            var t = this.mapData.tilesets[i];
            var ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / mapManager.tSize.x),
                yCount: Math.floor(t.imageheight / mapManager.tSize.y),
            };
            this.tilesets.push(ts)
        }
        this.jsonLoaded = true;


        for (var i = 0; i < this.xCount; i++) {
            this.Cell_class.push([]);
        }
        for (var i = 0; i < this.xCount; i++) {
            for (var j = this.Cell_class[i].length; j < this.yCount; j++) {
                this.Cell_class[i].push(new CellClass);
            }
        }
        this.Cell_class.pop()
        this.draw_self();

    },

    draw(ctx) {
        ctx.rect(this.view.x, this.view.y, this.view.w, this.view.h);
        ctx.fillStyle = "rgba(0,0,0,0.63)";
        ctx.fill();
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function () {
                mapManager.draw(ctx);
            }, 100)
        } else {
            if (this.tLayer === null || this.bLayer === null)
                for (let id = 0; id < this.mapData.layers.length; id++) {
                    var layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") {
                        if (layer.name === "tile_front") {
                            this.tLayer = layer;
                            continue;
                        }
                        if (layer.name === "tile_back") {
                            this.bLayer = layer;
                        }
                    }

                }


            for (let i = 0; i < this.tLayer.data.length; i++) {
                if (this.bLayer.data[i] !== 0) {
                    let tile = this.getTile(this.bLayer.data[i]);
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;
                    if (!this.isVisible(pX, pY, this.tSize.x, this.tSize.y))
                        continue;
                    pX -= this.view.x;
                    pY -= this.view.y;
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                }

                if (this.tLayer.data[i] !== 0) {
                    let tile = this.getTile(this.tLayer.data[i]);
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;
                    if (!this.isVisible(pX, pY, this.tSize.x, this.tSize.y))
                        continue;
                    pX -= this.view.x;
                    pY -= this.view.y;
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                }
            }
        }
    },

    getTile(tileIndex) {
        var tile = {
            img: null,
            px: 0,
            py: 0
        };
        var tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        var id = tileIndex - tileset.firstgid;
        var x = id % tileset.xCount;
        var y = Math.floor(id / tileset.xCount);
        tile.px = x * mapManager.tSize.x;
        tile.py = y * mapManager.tSize.y;
        return tile;
    },

    getTileset(tileIndex) {
        for (var i = mapManager.tilesets.length - 1; i >= 0; i--)
            if (mapManager.tilesets[i].firstgid <= tileIndex) {
                return mapManager.tilesets[i];
            }
        return null;
    },

    isVisible(x, y, width, height) {
        if (x + width < this.view.x || y + height < this.view.y || x > this.view.x + this.view.w || y > this.view.y + this.view.h)
            return false;
        return true;
    },

    parseEntities() {
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function () {
                mapManager.parseEntities();
            }, 100)
        } else
            for (var j = 0; j < this.mapData.layers.length; j++)
                if (this.mapData.layers[j].type === 'objectgroup') {
                    var entities = this.mapData.layers[j];
                    for (var i = 0; i < entities.objects.length; i++) {
                        var e = entities.objects[i];

                        try {
                            //console.log(factory)
                            var obj = Object.create(factory[e.type]);
                            obj.name = e.name;
                            //console.log(obj.name)
                            obj.pos_x = Math.floor(e.x/16);
                            //console.log(obj.pos_x)
                            obj.pos_y = Math.floor(e.y/16);
                            //console.log(obj.pos_y)
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            if (e.type === "Box" || e.type === "Finish") {
                                //if (e.type === "Box") gameManager.count_target++;
                                obj.color = e.properties[0].value;
                                console.log(obj)
                                //console.log(e.properties[0].value)
                            }
                            Entities.push(obj);
                            console.log('entities: '+Entities)
                            if (obj.name === "Player")
                                initPlayer(obj);
                        } catch (ex) {
                            console.log("Ошибка создания: [" + e.gid + "]" + e.type + "," + ex)
                        }
                    }
                }
    },
    centerAt(x, y) {
    if(x < this.view.w / 2) this.view.x = 0;
    else
    if(x > this.mapSize.x - this.view.w / 2) this.view.x = this.mapSize.x - this.view.w;
    else
        this.view.x = x - (this.view.w / 2);
    if(y < this.view.h / 2) this.view.y = 0;
    else
    if(y > this.mapSize.y - this.view.h / 2) this.view.y = this.mapSize.y - this.view.h;
    else
        this.view.y = y - (this.view.h / 2);
    },

redraw_player(ctx, x, y) {
        let loc_i = (y*25+x)/16;
        for(var j = -25; j<100; j+=25) {
            var time_i = loc_i-25;
            if(time_i<0) time_i = 0;
            var n = 1
            if(time_i-n<0) n = 0;
            for (var i = time_i-n; i < loc_i+j + 4; i++) {
                if (this.bLayer.data[i] !== 0) {
                    let tile = this.getTile(this.bLayer.data[i]);
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;
                    pX -= this.view.x;
                    pY -= this.view.y;
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                }
                if (this.tLayer.data[i] !== 0) {
                    let tile = this.getTile(this.tLayer.data[i]);
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;
                    pX -= this.view.x;
                    pY -= this.view.y;
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                }
            }
        }
    },

    getTilesetIdx(x, y){
    var wY = y;
    var wX = x;
    var idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor (wX / this.tSize.x);
    return this.tLayer.data[idx];
    },

    to_get_blocks() {
        let returned_blocks = [];
        for (var i = 0; i < this.tLayer.data.length; i++) {
            if (this.tLayer.data[i] !== 0) {
                let local_x = Math.floor(i/25)
                let local_y = i;
                while(local_y>25) {
                    local_y-=25;
                }
                returned_blocks.push({local_x: local_y, local_y: local_x})
            }
        }
        return returned_blocks;
    },
    draw_self() {
        var canvas = document.getElementById("canvasId")
        var ctx = canvas.getContext('2d')
        mapManager.draw(ctx);
    },
    draw_self_object_clear(x,y) {
        var canvas = document.getElementById("canvasId")
        var ctx = canvas.getContext('2d')
        mapManager.redraw_player(ctx,x,y);
        this.to_generate_blocks();
    },

    to_generate_blocks() {
        var canvas = document.getElementById("canvasId")
        var ctx = canvas.getContext('2d')
        let get_blocks = mapManager.to_get_blocks();
        for(let i = 0; i<get_blocks.length; i++) {
            if((get_blocks[i].local_x<25)&&(get_blocks[i].local_y<25))
                this.Cell_class[get_blocks[i].local_x][get_blocks[i].local_y].setBlock();
        }
    }
}



