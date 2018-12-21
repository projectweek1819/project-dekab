// Schrijf hier je code

function width(grid){
    for (let x of grid){
        return x.length;
    }
}

function height(grid){
    return grid.length;
}

function isInside(grid, position){
    return position.x < width(grid) && position.x >= 0 && position.y < height(grid) && position.y >= 0;
}

function swap(grid, p, q){
    let blokp = grid[p.y][p.x];
    let blokq = grid[q.y][q.x];
    grid[p.y][p.x]= blokq;
    grid[q.y][q.x]= blokp;
}

function horizontalChainAt(grid, position){
    let kleur=grid[position.y][position.x];
    let aantal = 0;
    for (let i=position.x; i<width(grid); i++) {
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
    for (let i=position.y; i<height(grid); i++) {
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
    const positions = [];
    const result = {};
    const w = width(grid);
    const h = height(grid);
    for (let y = 0; y !== h; ++y) {
        let x = 0;
        while (x < w) {
            const n = horizontalChainAt(grid, { x, y });
            if (n > 2) {
                for (let i = 0; i !== n; ++i) {
                    positions.push({ x: x + i, y });
                }
            }
            x += n;
        }
    }
    for (let x = 0; x !== w; ++x) {
        let y = 0;
        while (y < h) {
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
        const color = grid[y][x];
        result[color] = (result[color] || 0) +1;
    }
    for (const { x, y } of positions) {
        grid[y][x] = '';
    }
    return result;
}

function collapse(grid){
    for (let a = 1; a < grid.length; a++){
        for (let i = 1; i < grid.length; i++){
            for (let j = 0; j < grid[0].length; j++){
                if(grid[i][j] === ""){
                    let p = {x: j, y: i};
                    let q = {x: j, y: i - 1};
                    swap(grid, p, q);
                }
            }
        }
    }
}


/*
function removeChains(grid) {
    for (let i = 0; i < width(grid); i++) {
        for (let j = 0; j < height(grid); j++) {
            var position = {x: i, y: j};
            var vakjesToRemove = [];
            if (horizontalChainAt(grid, position) >= 3 || verticalChainAt(grid, position) >= 3) {
                let aantal = horizontalChainAt(grid, position) + verticalChainAt(grid, position);
                vakjesToRemove.push([position.x, position.y]);
            }
        }
    }

    for (let i = 0; i < width(grid); i++) {
        for (let j = 0; j < height(grid); j++) {
            if ( i === vakjesToRemove[i]) {
                grid[j][i]
            }
        }
    }

    const kleur = {grid[position.y][position.x]};
    const aantal = {horizontalChainAt(grid, position)}
    return {kleur, aantal};
       return 0;
}*/