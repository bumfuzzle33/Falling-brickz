//custom setup 2
console.log("working");
let canvas
let loop;
let score = 0;
let skin = [], restart_before, restart_after, font;
let tmp_restart_store
let pieces;//storing individual pieces
let next_piece;
let blockfast, tap_strict = true;
let linematch, gameover = false;
let blockstore = [];
let grid_map = new Array(16);
for (var i = 0; i < grid_map.length; i++)
    grid_map[i] = new Array(20).fill(0);
//for the boundary for rotate collision
grid_map[-2] = new Array(20).fill(1);
grid_map[-1] = new Array(20).fill(1);
grid_map[15] = new Array(20).fill(1);

//display screen properties
let vscreen = {
    x: 660,
    y: 880,
    drawlines() {
        for (x = 44; x < this.x; x += 44)
            line(x, 0, x, this.y);

        for (y = 44; y < this.y; y += 44)
            line(0, y, this.x, y);
    }
}
//creation of basic block piece
class block {
    constructor(posx, posy, skin) {
        this.side = 44;
        this.posx = 44 * posx;
        this.posy = 44 * posy;
        this.skin = skin;
    }
    show() {
        image(this.skin, this.posx, this.posy, this.side, this.side);
    }
    moveLeft() {
        this.posx -= 44;
    }
    moveRight() {
        this.posx += 44;
    }
    moveDown() {
        this.posy += 44;
    }
    changepos(x, y) {
        this.posx += x * 44;
        this.posy += y * 44;
    }
}
// creation of each individual pieces with the block class
class L_piece {
    constructor(posx, posy, skin) {
        this.blocks = new Array(4);
        this.blocks[0] = new block(posx, posy - 1, skin);
        //main piece 
        this.blocks[1] = new block(posx, posy, skin);
        this.blocks[2] = new block(posx, posy + 1, skin);
        this.blocks[3] = new block(posx + 1, posy + 1, skin);
        this.rotateCount = 0;
    }
    show() {
        for (let i = 0; i < this.blocks.length; i++)
            this.blocks[i].show();
    }
    moveLeft() {
        this.leftmove = true;
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].posx <= 0 || grid_map[this.blocks[i].posx / 44 - 1][this.blocks[i].posy / 44])
                this.leftmove = false;
            if (i === 3 && this.leftmove) {
                this.blocks[0].moveLeft();
                this.blocks[1].moveLeft();
                this.blocks[2].moveLeft();
                this.blocks[3].moveLeft();
            }
        }
    }
    moveRight() {
        this.rightmove = true;
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].posx >= 616 || grid_map[this.blocks[i].posx / 44 + 1][this.blocks[i].posy / 44])
                this.rightmove = false;
            if (i === 3 && this.rightmove) {
                this.blocks[0].moveRight();
                this.blocks[1].moveRight();
                this.blocks[2].moveRight();
                this.blocks[3].moveRight();
            }
        }
    }
    rotate() {
        this.shouldItRotate = true;
        this.moveleft = undefined;
        //creating virtual blocks for the collision
        this.v = new Array(3);
        //0
        if (!this.rotateCount) {
            this.v[0] = createVector((this.blocks[0].posx + 44) / 44, (this.blocks[0].posy + 44) / 44);
            this.v[1] = createVector((this.blocks[2].posx - 44) / 44, (this.blocks[2].posy - 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx - 88) / 44, (this.blocks[3].posy) / 44);
        }
        //1
        if (this.rotateCount === 1) {
            this.v[0] = createVector((this.blocks[0].posx - 44) / 44, (this.blocks[0].posy + 44) / 44);
            this.v[1] = createVector((this.blocks[2].posx + 44) / 44, (this.blocks[2].posy - 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx / 44), (this.blocks[3].posy - 88) / 44);
        }
        //2
        if (this.rotateCount === 2) {
            this.v[0] = createVector((this.blocks[0].posx - 44) / 44, (this.blocks[0].posy - 44) / 44);
            this.v[1] = createVector((this.blocks[2].posx + 44) / 44, (this.blocks[2].posy + 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx + 88) / 44, (this.blocks[3].posy) / 44);
        }
        //3
        if (this.rotateCount === 3) {
            this.v[0] = createVector((this.blocks[0].posx + 44) / 44, (this.blocks[0].posy - 44) / 44);
            this.v[1] = createVector((this.blocks[2].posx - 44) / 44, (this.blocks[2].posy + 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx / 44), (this.blocks[3].posy + 88) / 44);
        }
        for (let i = 0; i < this.v.length; i++) {
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x === this.blocks[1].posx / 44)
                this.shouldItRotate = false;
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x > this.blocks[1].posx / 44) {
                for (let j = 0; j < this.v.length; j++) {
                    if (grid_map[this.v[j].x - 1][this.v[j].y]) {
                        this.shouldItRotate = false;
                        break;
                    }
                }
                this.moveleft = 1;
            }
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x < this.blocks[1].posx / 44) {
                for (let j = 0; j < this.v.length; j++) {
                    if (grid_map[this.v[j].x + 1][this.v[j].y]) {
                        this.shouldItRotate = false;
                        break;
                    }
                }
                this.moveleft = 0;
            }
        }
        if (this.shouldItRotate) {
            if (this.rotateCount === 0) {
                this.blocks[0].changepos(1, 1);
                this.blocks[2].changepos(-1, -1);
                this.blocks[3].changepos(-2, 0);
                this.rotateCount = 1;
            }
            else if (this.rotateCount === 1) {
                this.blocks[0].changepos(-1, 1);
                this.blocks[2].changepos(1, -1);
                this.blocks[3].changepos(0, -2);
                this.rotateCount = 2;
            }
            else if (this.rotateCount === 2) {
                this.blocks[0].changepos(-1, -1);
                this.blocks[2].changepos(1, 1);
                this.blocks[3].changepos(2, 0);
                this.rotateCount = 3;
            }
            else if (this.rotateCount === 3) {
                this.blocks[0].changepos(1, -1);
                this.blocks[2].changepos(-1, 1);
                this.blocks[3].changepos(0, 2);
                this.rotateCount = 0;
            }
        }
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.moveleft === 1 && this.shouldItRotate)
                this.blocks[i].moveLeft();
            if (this.moveleft === 0 && this.shouldItRotate)
                this.blocks[i].moveRight();
        }
    }
    moveDown() {
        this.finish = false;
        for (let i = 0; i < this.blocks.length; i++)
            if (this.blocks[i].posy >= 836 || grid_map[this.blocks[i].posx / 44][this.blocks[i].posy / 44 + 1]) {
                this.finish = true;
                break;
            }
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.finish)
                grid_map[this.blocks[i].posx / 44][this.blocks[i].posy / 44] = 1;
            else
                this.blocks[i].moveDown();
        }
    }
    delete_block(block_to_delete) {
        this.blocks.splice(block_to_delete, 1);
    }
}
class T_piece extends L_piece {
    constructor(posx, posy, skin) {
        super(posx, posy, skin);
        this.blocks = new Array(4);
        this.blocks[0] = new block(posx - 1, posy, skin);
        this.blocks[1] = new block(posx, posy, skin);
        this.blocks[2] = new block(posx + 1, posy, skin);
        this.blocks[3] = new block(posx, posy + 1, skin);
        this.rotateCount = 0;
    }
    rotate() {
        this.shouldItRotate = true;
        this.moveleft = undefined;
        //creating virtual blocks for the collision
        this.v = new Array(3);
        //0
        if (!this.rotateCount) {
            this.v[0] = createVector((this.blocks[0].posx + 44) / 44, (this.blocks[0].posy - 44) / 44);
            this.v[1] = createVector((this.blocks[2].posx - 44) / 44, (this.blocks[2].posy + 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx - 44) / 44, (this.blocks[3].posy - 44) / 44);
        }
        //1
        if (this.rotateCount === 1) {
            this.v[0] = createVector((this.blocks[0].posx + 44) / 44, (this.blocks[0].posy + 44) / 44);
            this.v[1] = createVector((this.blocks[2].posx - 44) / 44, (this.blocks[2].posy - 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx + 44) / 44, (this.blocks[3].posy - 44) / 44);
        }
        //2
        if (this.rotateCount === 2) {
            this.v[0] = createVector((this.blocks[0].posx - 44) / 44, (this.blocks[0].posy + 44) / 44);
            this.v[1] = createVector((this.blocks[2].posx + 44) / 44, (this.blocks[2].posy - 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx + 44) / 44, (this.blocks[3].posy + 44) / 44);
        }
        //3
        if (this.rotateCount === 3) {
            this.v[0] = createVector((this.blocks[0].posx - 44) / 44, (this.blocks[0].posy - 44) / 44);
            this.v[1] = createVector((this.blocks[2].posx + 44) / 44, (this.blocks[2].posy + 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx - 44) / 44, (this.blocks[3].posy + 44) / 44);
        }
        for (let i = 0; i < this.v.length; i++) {
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x === this.blocks[1].posx / 44)
                this.shouldItRotate = false;
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x > this.blocks[1].posx / 44) {
                for (let j = 0; j < this.v.length; j++) {
                    if (grid_map[this.v[j].x - 1][this.v[j].y]) {
                        this.shouldItRotate = false;
                        break;
                    }
                }
                this.moveleft = 1;
            }
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x < this.blocks[1].posx / 44) {
                for (let j = 0; j < this.v.length; j++) {
                    if (grid_map[this.v[j].x + 1][this.v[j].y]) {
                        this.shouldItRotate = false;
                        break;
                    }
                }
                this.moveleft = 0;
            }
        }
        if (this.shouldItRotate) {
            if (this.rotateCount === 0) {
                this.blocks[0].changepos(1, -1);
                this.blocks[2].changepos(-1, 1);
                this.blocks[3].changepos(-1, -1);
                this.rotateCount = 1;
            }
            else if (this.rotateCount === 1) {
                this.blocks[0].changepos(1, 1);
                this.blocks[2].changepos(-1, -1);
                this.blocks[3].changepos(1, -1);
                this.rotateCount = 2;
            }
            else if (this.rotateCount === 2) {
                this.blocks[0].changepos(-1, 1);
                this.blocks[2].changepos(1, -1);
                this.blocks[3].changepos(1, 1);
                this.rotateCount = 3;
            }
            else if (this.rotateCount === 3) {
                this.blocks[0].changepos(-1, -1);
                this.blocks[2].changepos(1, 1);
                this.blocks[3].changepos(-1, 1);
                this.rotateCount = 0;
            }
        }
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.moveleft === 1 && this.shouldItRotate)
                this.blocks[i].moveLeft();
            if (this.moveleft === 0 && this.shouldItRotate)
                this.blocks[i].moveRight();
        }
    }

}
class Square_piece extends L_piece {
    constructor(posx, posy, skin) {
        super(posx, posy, skin);
        this.blocks[0] = new block(posx - 1, posy, skin);
        this.blocks[1] = new block(posx, posy, skin);
        this.blocks[2] = new block(posx, posy - 1, skin);
        this.blocks[3] = new block(posx - 1, posy - 1, skin);
    }
    rotate() {

    }
}
class Z_piece extends L_piece {
    constructor(posx, posy, skin) {
        super(posx, posy, skin);
        this.blocks[0] = new block(posx - 1, posy, skin);
        this.blocks[1] = new block(posx, posy, skin);
        this.blocks[2] = new block(posx, posy - 1, skin);
        this.blocks[3] = new block(posx + 1, posy - 1, skin);
    }
    rotate() {
        this.shouldItRotate = true;
        this.moveleft = undefined;
        //creating virtual blocks for the collision
        this.v = new Array(3);
        //0
        if (!this.rotateCount) {
            this.v[0] = createVector((this.blocks[0].posx + 44) / 44, (this.blocks[0].posy + 44) / 44);
            this.v[1] = createVector((this.blocks[2].posx - 44) / 44, (this.blocks[2].posy + 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx - 88) / 44, (this.blocks[3].posy) / 44);
        }
        //1
        if (this.rotateCount === 1) {
            this.v[0] = createVector((this.blocks[0].posx - 44) / 44, (this.blocks[0].posy - 44) / 44);
            this.v[1] = createVector((this.blocks[2].posx + 44) / 44, (this.blocks[2].posy - 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx + 88) / 44, (this.blocks[3].posy) / 44);
        }
        for (let i = 0; i < this.v.length; i++) {
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x === this.blocks[1].posx / 44)
                this.shouldItRotate = false;
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x > this.blocks[1].posx / 44) {
                for (let j = 0; j < this.v.length; j++) {
                    if (grid_map[this.v[j].x - 1][this.v[j].y]) {
                        this.shouldItRotate = false;
                        break;
                    }
                }
                this.moveleft = 1;
            }
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x < this.blocks[1].posx / 44) {
                for (let j = 0; j < this.v.length; j++) {
                    if (grid_map[this.v[j].x + 1][this.v[j].y]) {
                        this.shouldItRotate = false;
                        break;
                    }
                }
                this.moveleft = 0;
            }
        }
        if (this.shouldItRotate) {
            if (this.rotateCount === 0) {
                this.blocks[0].changepos(1, 1);
                this.blocks[2].changepos(-1, 1);
                this.blocks[3].changepos(-2, 0);
                this.rotateCount = 1;
            }
            else if (this.rotateCount === 1) {
                this.blocks[0].changepos(-1, -1);
                this.blocks[2].changepos(1, -1);
                this.blocks[3].changepos(2, 0);
                this.rotateCount = 0;
            }
        }
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.moveleft === 1 && this.shouldItRotate)
                this.blocks[i].moveLeft();
            if (this.moveleft === 0 && this.shouldItRotate)
                this.blocks[i].moveRight();
        }
    }
}
class I_piece extends L_piece {
    constructor(posx, posy, skin) {
        super(posx, posy, skin);
        this.blocks[0] = new block(posx, posy - 2, skin);
        this.blocks[2] = new block(posx, posy - 1, skin);
        this.blocks[1] = new block(posx, posy, skin);
        this.blocks[3] = new block(posx, posy + 1, skin);
    }
    rotate() {
        this.shouldItRotate = true;
        this.moveleft = undefined;
        //creating virtual blocks for the collision
        this.v = new Array(3);
        //0
        if (!this.rotateCount) {
            this.v[0] = createVector((this.blocks[0].posx - 88) / 44, (this.blocks[0].posy + 88) / 44);
            this.v[1] = createVector((this.blocks[2].posx - 44) / 44, (this.blocks[2].posy + 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx + 44) / 44, (this.blocks[3].posy - 44) / 44);
        }
        //1
        if (this.rotateCount === 1) {
            this.v[0] = createVector((this.blocks[0].posx + 88) / 44, (this.blocks[0].posy - 88) / 44);
            this.v[1] = createVector((this.blocks[2].posx + 44) / 44, (this.blocks[2].posy - 44) / 44);
            this.v[2] = createVector((this.blocks[3].posx - 44) / 44, (this.blocks[3].posy + 44) / 44);
        }
        for (let i = 0; i < this.v.length; i++) {
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x === this.blocks[1].posx / 44)
                this.shouldItRotate = false;
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x > this.blocks[1].posx / 44) {
                for (let j = 0; j < this.v.length; j++) {
                    if (grid_map[this.v[j].x - 1][this.v[j].y]) {
                        this.shouldItRotate = false;
                        break;
                    }
                }
                this.moveleft = 1;
            }
            if (grid_map[this.v[i].x][this.v[i].y] && this.v[i].x < this.blocks[1].posx / 44) {
                for (let j = 0; j < this.v.length; j++) {
                    if (grid_map[this.v[j].x + 2][this.v[j].y]) {
                        console.log("found");
                        this.shouldItRotate = false;
                        break;
                    }
                }
                this.moveleft = 0;
            }
        }
        if (this.shouldItRotate) {
            if (this.rotateCount === 0) {
                this.blocks[0].changepos(-2, 2);
                this.blocks[2].changepos(-1, 1);
                this.blocks[3].changepos(1, -1);
                this.rotateCount = 1;
            }
            else if (this.rotateCount === 1) {
                this.blocks[0].changepos(2, -2);
                this.blocks[2].changepos(1, -1);
                this.blocks[3].changepos(-1, 1);
                this.rotateCount = 0;
            }
        }
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.moveleft === 1 && this.shouldItRotate)
                this.blocks[i].moveLeft();
            if (this.moveleft === 0 && this.shouldItRotate) {
                this.blocks[i].moveRight();
                this.blocks[i].moveRight();
            }

        }
    }

}
//clears the line
function lineclear(v_row) {
    score += 10;
    //displaying score
    scoreboard.innerHTML = `score  ${score}`;
    for (let i = blockstore.length - 1; i >= 0; i--) {
        for (let j = blockstore[i].blocks.length - 1; j >= 0; j--) {
            //removing individual blocks
            if (blockstore[i].blocks[j].posy / 44 === v_row)
                blockstore[i].delete_block(j);
        }
        //removing whole pieces
        if (blockstore[i].blocks.length === 0)
            blockstore.splice(i, 1);
    }
    for (let i = blockstore.length - 1; i >= 0; i--) {
        for (let j = blockstore[i].blocks.length - 1; j >= 0; j--) {
            if (blockstore[i].blocks[j].posy / 44 < v_row)
                blockstore[i].blocks[j].moveDown();
        }
    }
    //reset grid_map
    for (var i = 0; i < grid_map.length - 1; i++)
        grid_map[i] = new Array(20).fill(0);
    for (let i = 0; i < blockstore.length; i++) {
        for (let j = 0; j < blockstore[i].blocks.length; j++) {
            grid_map[blockstore[i].blocks[j].posx / 44][blockstore[i].blocks[j].posy / 44] = 1;
        }
    }
}
function game_over() {
    fill(38, 70, 83);
    rect(20, 200, 620, 320, 50);
    textFont(font);
    fill(233, 196, 106);
    textSize(35);
    text("retry!", 290, 370);
    textSize(48);
    text(`Your score : ${score}`, 130, 500);
    image(restart_before, 6 * 45, 6 * 35, 120, 120);
    if (mouseX >= 270 && mouseX <= 390 && mouseY >= 210 && mouseY <= 330) {
        restart_before = restart_after;
        if (mouseIsPressed) {
            //resetting all and starting the interval backup again so that interval moves down the pieces automatically
            score = 0;
            blockstore = [];
            blockstore.push(random([new L_piece(7, -2, skin[1]), new T_piece(7, -2, skin[2]), new Square_piece(7, -2, skin[3]), new Z_piece(7, -2, skin[4]), new I_piece(7, -2, skin[5])]));
            gameover = false;
            //resetting the map
            for (var i = 0; i < grid_map.length - 1; i++)
                grid_map[i] = new Array(20).fill(0);
            loop = setInterval(() => blockstore[blockstore.length - 1].moveDown(), 500);
        }
    }
    else
        restart_before = tmp_restart_store;
}

//loading textures and fonts
function preload() {
    for (let i = 1; i < 6; i++)
        skin[i] = loadImage(`textures&font/color${i}.png`);
    restart_before = loadImage(`textures&font/restart_before.png`);
    restart_after = loadImage("textures&font/restart_after.png");
    font = loadFont('textures&font/pixel.otf');
}
//creation of canvas to display the whole animation you see
function setup() {
    canvas = createCanvas(vscreen.x, vscreen.y);
    canvas.position(window.innerWidth / 2 - vscreen.x / 2, window.innerHeight / 2 - vscreen.y / 2);
    loop = setInterval(() => blockstore[blockstore.length - 1].moveDown(), 500);
    pieces = [new L_piece(7, -2, skin[1]), new T_piece(7, -2, skin[2]), new Square_piece(7, -2, skin[3]), new Z_piece(7, -2, skin[4]), new I_piece(7, -2, skin[5])];
    blockstore.push(random(pieces));
    //next piece predefined to be displayed in side screen
    let random_skin = random([skin[1], skin[2], skin[3], skin[4], skin[5]]);
    next_piece = random([new L_piece(7, -2, random_skin), new T_piece(7, -2, random_skin), new Square_piece(7, -2, random_skin), new Z_piece(7, -2, random_skin), new I_piece(7, -2, random_skin)]);
    tmp_restart_store = restart_before;
}
//A forever loop that draws image over and over
function draw() {
    if (blockfast)
        blockstore[blockstore.length - 1].moveDown();
    //looping through the grid_map to find horizontal match and vertical match
    for (let v = 0; v < 20; v++) {
        linematch = true;
        for (let h = 0; h < 15; h++) {
            if (grid_map[h][0])
                gameover = true;
            if (!grid_map[h][v])
                linematch = false;
            if (h === 14 && linematch)
                lineclear(v);
        }
    }
    //gameover check part
    if (gameover) {
        clearInterval(loop);
        game_over();
    }
    //pushing random pieces with random textures
    if (blockstore[blockstore.length - 1].finish) {
        random_skin = random([skin[1], skin[2], skin[3], skin[4], skin[5]]);
        blockstore.push(next_piece);
        next_piece = random([new L_piece(7, -2, random_skin), new T_piece(7, -2, random_skin), new Square_piece(7, -2, random_skin), new Z_piece(7, -2, random_skin), new I_piece(7, -2, random_skin)]);
    }
    if (!gameover) {
        clear();
        vscreen.drawlines();

        //displaying pieces
        for (let i = 0; i < blockstore.length; i++)
            blockstore[i].show();
    }

}
//input
function keyPressed() {
    if (tap_strict) {
        if (keyCode === LEFT_ARROW)
            blockstore[blockstore.length - 1].moveLeft();
        if (keyCode === RIGHT_ARROW)
            blockstore[blockstore.length - 1].moveRight();
        if (keyCode === UP_ARROW)
            blockstore[blockstore.length - 1].rotate();
        tap_strict = false;
    }
    if (keyCode === DOWN_ARROW)
        blockfast = true;
}
function keyReleased() {
    tap_strict = true;
    blockfast = false;
}




