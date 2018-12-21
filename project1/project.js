import p5.js;
let grid;
let gekliktJewel1 = null;
let gekliktJewel2 = null;
let hulpJewel1;
let hulpJewel2;
let clickTeller;

function setup(){
    createCanvas(800,800);
    nieuwRooster(8,8);
    clickTeller = 0;
}

function draw(){
    background(51);
    toonGrid();
    if(gekliktJewel1 != null){
        drawSelectie();
    }
    removeChains(grid);
}

function mousePressed(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            let vlag = grid[i][j].geklikte(mouseX, mouseY);
            if((vlag) && (clickTeller === 0)){
                clickTeller++;
                gekliktJewel1 = grid[i][j];
            }else if((vlag) && (clickTeller === 1)){
                clickTeller = 0;
                gekliktJewel2 = grid[i][j];
                swap(grid[gekliktJewel1.x][gekliktJewel1.y], grid[gekliktJewel2.x][gekliktJewel2.y]);
                gekliktJewel1 = null;
                gekliktJewel2 = null;
            }
        }
    }
}

function drawSelectie(){
    noFill();
    stroke(255,255,255);
    strokeWeight(5);
    triangle(50+100*gekliktJewel1.x, 25+100*gekliktJewel1.y, 25+100*gekliktJewel1.x, 75+100*gekliktJewel1.y, 75+100*gekliktJewel1.x, 75+100*gekliktJewel1.y);
}

function nieuwRooster(x, y){
    grid = new Array(y);
    for(let i = 0; i < grid.length; i++){
        grid[i] = new Array(x);
        for(let j = 0; j < grid[i].length; j++){
            grid[i][j] = new Jewel(i, j, Math.floor(Math.random() * 6) + 1);

            while((i >=2) && (grid[i-1][j].color === grid[i][j].color) &&
            (grid[i-2][j].color === grid[i][j].color)){
                grid[i][j] = new Jewel(i, j, Math.floor(Math.random() * 6) + 1)
            }
            while((j >=2) && (grid[i][j-1].color === grid[i][j].color) &&
            (grid[i][j-2].color === grid[i][j].color)){
                grid[i][j] = new Jewel(i, j, Math.floor(Math.random() * 6) + 1)
            }
        }
    }
}

function toonGrid(){
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            grid[i][j].toon();
        }
    }
}

function widthGrid(grid){
    for (let x of grid){
        return x.length;
    }
}

function heightGrid(grid){
    return grid.length;
}

function gefixedJewel(){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            grid[i][j].x = i;
            grid[i][j].y = j;
        }
    }
}

function swap( Jewel1, Jewel2){
    if(Math.abs(Jewel2.x - Jewel1.x) === 1 && Math.abs(Jewel2.y - Jewel1.y) === 0
        || Math.abs(Jewel2.x - Jewel1.x) === 0 && Math.abs(Jewel2.y - Jewel1.y) === 1){
        hulpJewel1 = Jewel1;
        hulpJewel2 = Jewel2;

        coordinaatX1 = Jewel1.x;
        coordinaatY1 = Jewel1.y;
        coordinaatX2 = Jewel2.x;
        coordinaatY2 = Jewel2.y;

        grid[coordinaatX1][coordinaatY1] = Jewel2;
        grid[coordinaatX2][coordinaatY2] = Jewel1;
        gefixedJewel();
        toonGrid();
        removeChains(grid);
    }
}

function horizontalChainAt(grid, position){
    let kleur=grid[position.y][position.x];
    let aantal = 0;
    for (let i=position.x; i<widthGrid(grid); i++) {
        if (grid[position.y][i] === kleur) {
            aantal++;
        } else {
            break;
        }
    }

    for (let i=position.x; i>=0; i--) {
        if (grid[position.y][i] === kleur) {
            aantal++;
        } else {
            break;
        }
    }
    return aantal-1;
}

function verticalChainAt(grid, position){
    let kleur=grid[position.y][position.x];
    let aantal = 0;
    for (let i=position.y; i<heightGrid(grid); i++) {
        if (grid[i][position.x] === kleur) {
            aantal++;
        } else {
            break;
        }
    }

    for (let i=position.y; i>=0; i--) {
        if (grid[i][position.x] === kleur) {
            aantal++;
        } else {
            break;
        }
    }
    return aantal-1;
}

function removeChains(grid) {
    console.log("begin");
    const positions = [];
    const result = {};
    for (let y = 0; y < heightGrid(grid); ++y) {
        let x = 0;
        while (x < widthGrid(grid)) {
            const n = horizontalChainAt(grid, { x, y });
            if (n > 2) {
                for (let i = 0; i < n; ++i) {
                    positions.push({ x: x + i, y });
                }
            }
            x += n;
        }
    }
    for (let x = 0; x < widthGrid(grid); ++x) {
        let y = 0;
        while (y < heightGrid(grid)) {
            const n = verticalChainAt(grid, { x, y });
            if (n > 2) {
                for (let i = 0; i !== n; ++i) {
                    positions.push({ x, y: y + i });
                }
            }
            y += n;
        }
    }
    for (const position of positions) {
        const { x, y } = position;
        const colorGrid = grid[y][x];
        result[colorGrid] = (result[colorGrid] || 0) +1;
    }
    for (const { x, y } of positions) {
        grid[y][x] = null;
    }
    console.log("einde");
    console.log(grid);
    return result;

}


class Jewel{
    constructor(coordinaatX,coordinaatY,kleur){
        this.x = coordinaatX;
        this.y = coordinaatY;
        this.color = kleur;
    }
    geklikte(positieX,positieY){
        let distance = dist(positieX, positieY, 50+100*this.x, 50+100*this.y);
        if(distance <= 25){
            return true;
        }
    }

    getKleur(){
        return kleur;
    }

    setKleur(){
        switch(this.color){
            //jasmine
            case 1:
                fill(255, 234, 128);
                break;
            //mint green
            case 2:
                fill(153, 255, 153);
                break;
            //electric blue
            case 3:
                fill(128, 255, 255);
                break;
            //lavender
            case 4:
                fill(170, 153, 255);
                break;
            //tickle me pink
            case 5:
                fill(255, 128, 170);
                break;
            //coral
            case 6:
                fill(255, 77, 77);
                break;
        }
    }


    toon(){
        noStroke();
        this.setKleur();
        triangle(50+100*this.x, 25+100*this.y, 25+100*this.x, 75+100*this.y, 75+100*this.x, 75+100*this.y);
    }
}



